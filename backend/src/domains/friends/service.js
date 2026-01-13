module.exports = function createService(deps) {
  const db = deps.db;

  const findUserIdByEmail = async (email) => {
    const res = await db.query('SELECT id FROM users WHERE email=$1', [email]);
    if (!res.rows.length) return null;
    return res.rows[0].id;
  };

  const listByEmail = async (email) => {
    const res = await db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, f.status, f.created_at
       FROM friendships f
       JOIN users u ON f.friend_id = u.id
       JOIN users me ON f.user_id = me.id
       WHERE me.email = $1`,
      [email]
    );
    return res.rows;
  };

  const listRequestsSent = async (email) => {
    const res = await db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, f.status, f.created_at
       FROM friendships f
       JOIN users u ON f.friend_id = u.id
       JOIN users me ON f.user_id = me.id
       WHERE me.email = $1 AND f.status = 'pending'`,
      [email]
    );
    return res.rows;
  };

  const listRequestsReceived = async (email) => {
    const res = await db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, f.status, f.created_at
       FROM friendships f
       JOIN users u ON f.user_id = u.id
       JOIN users me ON f.friend_id = me.id
       WHERE me.email = $1 AND f.status = 'pending'`,
      [email]
    );
    return res.rows;
  };

  const addFriend = async (uid, fid) => {
    // create pending request from uid -> fid if not exists
    await db.query(
      `INSERT INTO friendships (user_id, friend_id, status, created_at, updated_at)
       VALUES ($1,$2,'pending',now(),now()) ON CONFLICT (user_id, friend_id) DO UPDATE SET status=EXCLUDED.status, updated_at=now()`,
      [uid, fid]
    );
    return { ok: true };
  };

  const removeFriend = async (uid, fid) => {
    await db.query(`DELETE FROM friendships WHERE (user_id=$1 AND friend_id=$2) OR (user_id=$2 AND friend_id=$1)`, [uid, fid]);
    return { ok: true };
  };

  const sendRequest = async (uid, fid) => {
    return addFriend(uid, fid);
  };

  const acceptRequest = async (uid, fid) => {
    // uid is the user accepting (i.e., the recipient), fid is the requester
    // Update existing pending row friend_id = uid, user_id = fid to accepted;
    await db.query(
      `UPDATE friendships SET status='accepted', updated_at=now() WHERE user_id=$1 AND friend_id=$2`,
      [fid, uid]
    );
    // Ensure reciprocal accepted row exists
    await db.query(
      `INSERT INTO friendships (user_id, friend_id, status, created_at, updated_at)
       VALUES ($1,$2,'accepted',now(),now()) ON CONFLICT (user_id, friend_id) DO UPDATE SET status='accepted', updated_at=now()`,
      [uid, fid]
    );
    return { ok: true };
  };

  const declineRequest = async (uid, fid) => {
    // uid is user declining (recipient), fid is requester
    await db.query(`DELETE FROM friendships WHERE user_id=$1 AND friend_id=$2`, [fid, uid]);
    return { ok: true };
  };

  return {
    findUserIdByEmail,
    listByEmail,
      listRequestsSent,
      listRequestsReceived,
    addFriend,
    removeFriend,
    sendRequest,
    acceptRequest,
    declineRequest,
  };
};
