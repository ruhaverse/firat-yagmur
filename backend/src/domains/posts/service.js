module.exports = function createService(deps) {
  const db = deps.db;

  async function getPosts({ userId = null, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT p.*, u.email, u.first_name, u.last_name, u.profile_picture
      FROM posts p
      JOIN users u ON p.author_id = u.id
    `;
    const params = [];
    if (userId) { query += ' WHERE p.author_id = $1'; params.push(userId); }
    query += ' ORDER BY p.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    const result = await db.query(query, params);
    return result.rows;
  }

  async function getPostById(id) {
    const result = await db.query(`SELECT p.*, u.email, u.first_name, u.last_name, u.profile_picture FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = $1`, [id]);
    return result.rowCount === 0 ? null : result.rows[0];
  }

  async function listPostsByEmail(email, limit = 50, offset = 0) {
    const q = await db.query(`SELECT p.*, u.email, u.first_name, u.last_name, u.profile_picture FROM posts p JOIN users u ON p.author_id = u.id WHERE u.email = $1 ORDER BY p.created_at DESC LIMIT $2 OFFSET $3`, [email, limit, offset]);
    return q.rows;
  }

  async function listSavedPostsByEmail(email, limit = 50, offset = 0) {
    const u = await db.query('SELECT id FROM users WHERE email=$1', [email]);
    if (u.rowCount === 0) return [];
    const userId = u.rows[0].id;
    try {
      const q = await db.query(`SELECT p.* FROM posts p JOIN saved_posts sp ON p.id = sp.post_id WHERE sp.user_id = $1 ORDER BY p.created_at DESC LIMIT $2 OFFSET $3`, [userId, limit, offset]);
      return q.rows;
    } catch (err) {
      if (err && err.message && err.message.includes('relation "saved_posts"')) return [];
      throw err;
    }
  }

  async function createPost(userId, content, privacy = 'public') {
    const insert = await db.query('INSERT INTO posts (author_id, content, privacy, created_at) VALUES ($1,$2,$3,now()) RETURNING id, author_id, content, privacy, created_at', [userId, content, privacy]);
    return insert.rows[0];
  }

  async function updatePost(id, updates) {
    const updatesArr = [];
    const params = [];
    let idx = 1;
    if (Object.prototype.hasOwnProperty.call(updates, 'content')) { updatesArr.push(`content=$${idx++}`); params.push(updates.content); }
    if (Object.prototype.hasOwnProperty.call(updates, 'privacy')) { updatesArr.push(`privacy=$${idx++}`); params.push(updates.privacy); }
    if (!updatesArr.length) return null;
    params.push(id);
    const q = await db.query(`UPDATE posts SET ${updatesArr.join(',')}, updated_at=now() WHERE id=$${idx} RETURNING *`, params);
    return q.rows[0];
  }

  async function toggleLike(pid, uid) {
    const q = await db.query('SELECT id FROM likes WHERE user_id=$1 AND target_type=$2 AND target_id=$3', [uid, 'post', pid]);
    if (q.rowCount > 0) {
      await db.query('DELETE FROM likes WHERE id=$1', [q.rows[0].id]);
      await db.query('UPDATE posts SET likes_count = GREATEST(COALESCE(likes_count,0)-1,0) WHERE id=$1', [pid]);
      return { post_id: pid, liked: false };
    }
    await db.query('INSERT INTO likes (user_id, target_type, target_id, created_at) VALUES ($1,$2,$3,now()) ON CONFLICT DO NOTHING', [uid, 'post', pid]);
    await db.query('UPDATE posts SET likes_count = COALESCE(likes_count,0)+1 WHERE id=$1', [pid]);
    const postQ = await db.query('SELECT author_id FROM posts WHERE id = $1 LIMIT 1', [pid]);
    const authorId = postQ.rowCount > 0 ? postQ.rows[0].author_id : null;
    return { post_id: pid, liked: true, authorId };
  }

  async function commentOnPost(postId, userId, content) {
    const insert = await db.query('INSERT INTO comments (post_id, user_id, content, target_type, created_at) VALUES ($1,$2,$3,$4,now()) RETURNING *', [postId, userId, content, 'post']);
    await db.query('UPDATE posts SET comments_count = COALESCE(comments_count,0)+1 WHERE id = $1', [postId]);
    const postQ = await db.query('SELECT author_id FROM posts WHERE id = $1 LIMIT 1', [postId]);
    const authorId = postQ.rowCount > 0 ? postQ.rows[0].author_id : null;
    return { comment: insert.rows[0], authorId };
  }

  async function getPostComments(postId) {
    const q = await db.query(`SELECT c.*, u.email, u.first_name, u.last_name, u.profile_picture FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at ASC`, [postId]);
    return q.rows;
  }

  async function toggleSave(pid, uid) {
    const q = await db.query('SELECT id FROM saved_posts WHERE user_id=$1 AND post_id=$2', [uid, pid]);
    if (q.rowCount > 0) {
      await db.query('DELETE FROM saved_posts WHERE id=$1', [q.rows[0].id]);
      return { post_id: pid, saved: false };
    }
    await db.query('INSERT INTO saved_posts (user_id, post_id, created_at) VALUES ($1,$2,now()) ON CONFLICT DO NOTHING', [uid, pid]);
    return { post_id: pid, saved: true };
  }

  async function deletePost(postId) {
    await db.query('DELETE FROM posts WHERE id = $1', [postId]);
    return true;
  }

  async function deleteComment(commentId, userId) {
    // Check if comment exists and belongs to user
    const check = await db.query('SELECT user_id FROM comments WHERE id = $1', [commentId]);
    if (check.rowCount === 0) throw new Error('Comment not found');
    if (check.rows[0].user_id !== userId) throw new Error('Not authorized');
    
    await db.query('DELETE FROM comments WHERE id = $1', [commentId]);
    return true;
  }

  return {
    getPosts,
    getPostById,
    listPostsByEmail,
    listSavedPostsByEmail,
    createPost,
    updatePost,
    toggleLike,
    commentOnPost,
    getPostComments,
    toggleSave,
    deletePost,
    deleteComment,
  };
};
