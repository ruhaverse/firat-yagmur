const makeController = (deps) => {
  const postsService = deps.services.postsService;
  const notificationService = deps.services.notificationService;
  const makeFileUrl = deps.services.storage.makeFileUrl;

  function sanitizeContent(content) {
    if (!content || typeof content !== 'string') return '';
    return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim().slice(0, 5000);
  }

  async function getPosts(req, res, next) {
    try {
      const { userId = null, limit = 50, offset = 0 } = req.query;
      const rows = await postsService.getPosts({ userId, limit: Number(limit), offset: Number(offset) });
      res.json({ data: rows });
    } catch (err) { next(err); }
  }

  async function getPostById(req, res, next) {
    try {
      const postId = req.params.id;
      const p = await postsService.getPostById(postId);
      if (!p) return res.status(404).json({ error: 'Post not found' });
      res.json({ data: p });
    } catch (err) { next(err); }
  }

  async function listPostsByEmail(req, res, next) {
    try {
      const email = req.params.email;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
      const offset = (page - 1) * limit;
      const rows = await postsService.listPostsByEmail(email, limit, offset);
      res.json({ data: rows });
    } catch (err) { next(err); }
  }

  async function listSavedPostsByEmail(req, res, next) {
    try {
      const email = req.params.email;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
      const offset = (page - 1) * limit;
      const rows = await postsService.listSavedPostsByEmail(email, limit, offset);
      res.json({ data: rows });
    } catch (err) { next(err); }
  }

  async function createPost(req, res, next) {
    try {
      const authUserId = req.user && req.user.id;
      if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });
      const userId = parseInt(authUserId, 10);
      const { content = '', privacy = 'public' } = req.body;
      const sanitizedContent = sanitizeContent(content);
      const validPrivacy = ['public','friends','private'].includes(privacy) ? privacy : 'public';
      const media = [];
      if (req.files && Array.isArray(req.files)) {
        for (const f of req.files) media.push({ mediaPath: makeFileUrl(f.filename), mediaType: f.mimetype });
      }
      const post = await postsService.createPost(userId, sanitizedContent, validPrivacy);
      res.status(201).json({ data: { post, media } });
    } catch (err) { next(err); }
  }

  async function updatePost(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (!id) return res.status(400).json({ error: 'Invalid id' });
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const existing = await postsService.getPostById(id);
      if (!existing) return res.status(404).json({ error: 'Post not found' });
      if (existing.author_id !== userId) return res.status(403).json({ error: 'Forbidden' });
      const { content = null, privacy = null } = req.body;
      const updates = {};
      if (content !== null) updates.content = sanitizeContent(content);
      if (privacy !== null) updates.privacy = privacy;
      if (!Object.keys(updates).length) return res.status(400).json({ error: 'No updatable fields provided' });
      const q = await postsService.updatePost(id, updates);
      res.json({ data: q });
    } catch (err) { next(err); }
  }

  async function likeUnlike(req, res, next) {
    try {
      const pid = parseInt(req.params.pid, 10);
      const uid = req.user && req.user.id;
      if (!uid) return res.status(401).json({ error: 'Unauthorized' });

      const result = await postsService.toggleLike(pid, uid);

      if (result.liked && result.authorId && result.authorId !== uid) {
        try {
          await notificationService.createNotification({
            userId: result.authorId,
            actorId: uid,
            type: 'post_like',
            targetType: 'post',
            targetId: pid,
            data: { liker: uid, post_id: pid }
          });
        } catch { /* ignore notification errors */ }
      }

      res.json({ data: { post_id: pid, liked: result.liked } });
    } catch (err) { next(err); }
  }

  async function commentOnPost(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const postId = parseInt(req.params.id, 10);
      const { content } = req.body;
      if (!postId || !content) return res.status(400).json({ error: 'Missing post id or content' });

      const sanitized = sanitizeContent(content).slice(0,1000);
      const { comment, authorId } = await postsService.commentOnPost(postId, userId, sanitized);

      if (authorId && authorId !== userId) {
        try {
          await notificationService.createNotification({
            userId: authorId,
            actorId: userId,
            type: 'post_comment',
            targetType: 'post',
            targetId: postId,
            data: { commenter: userId, post_id: postId }
          });
        } catch { /* ignore notification errors */ }
      }

      res.json({ data: comment });
    } catch (err) { next(err); }
  }

  async function getPostComments(req, res, next) {
    try {
      const postId = parseInt(req.params.id, 10);
      if (!postId) return res.status(400).json({ error: 'Invalid post id' });

      const rows = await postsService.getPostComments(postId);
      const mapped = rows.map(r => ({
        ...r,
        profile_picture: r.profile_picture ? makeFileUrl(r.profile_picture) : null
      }));

      res.json({ data: mapped });
    } catch (err) { next(err); }
  }

  async function saveUnsave(req, res, next) {
    try {
      const pid = parseInt(req.params.pid, 10);
      const uid = req.user && req.user.id;
      if (!uid) return res.status(401).json({ error: 'Unauthorized' });

      try {
        const result = await postsService.toggleSave(pid, uid);
        return res.json({ data: result });
      } catch (err) {
        if (err && err.message && err.message.includes('relation "saved_posts"')) {
          return res.status(501).json({ error: 'Saved posts not enabled on server' });
        }
        throw err;
      }
    } catch (err) { next(err); }
  }

  async function deletePost(req, res, next) {
    try {
      const postId = req.params.id;
      const userId = req.user.id;

      const check = await postsService.getPostById(postId);
      if (!check) return res.status(404).json({ error: 'Post not found' });
      if (check.author_id !== userId) return res.status(403).json({ error: 'Not authorized to delete this post' });

      await postsService.deletePost(postId);
      res.json({ message: 'Post deleted successfully' });
    } catch (err) { next(err); }
  }

  async function deleteComment(req, res, next) {
    try {
      const commentId = parseInt(req.params.id, 10);
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!commentId) return res.status(400).json({ error: 'Invalid comment id' });

      // Delete comment (service should check ownership)
      await postsService.deleteComment(commentId, userId);
      res.json({ message: 'Comment deleted successfully' });
    } catch (err) { 
      if (err.message === 'Comment not found') return res.status(404).json({ error: err.message });
      if (err.message === 'Not authorized') return res.status(403).json({ error: err.message });
      next(err); 
    }
  }

  return {
    getPosts,
    getPostById,
    createPost,
    deletePost,
    deleteComment,
    listPostsByEmail,
    listSavedPostsByEmail,
    updatePost,
    likeUnlike,
    saveUnsave,
    commentOnPost,
    getPostComments
  };
};

module.exports = makeController;
