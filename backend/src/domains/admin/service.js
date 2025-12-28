module.exports = function makeAdminService(deps) {
  const db = deps.db;

  async function getMetrics() {
    const counts = await Promise.all([
      db.query('SELECT COUNT(*)::int AS count FROM users'),
      db.query('SELECT COUNT(*)::int AS count FROM posts'),
      db.query('SELECT COUNT(*)::int AS count FROM reels'),
      db.query('SELECT COUNT(*)::int AS count FROM swaps'),
      db.query('SELECT COUNT(*)::int AS count FROM notifications')
    ]);
    return {
      users: counts[0].rows[0].count,
      posts: counts[1].rows[0].count,
      reels: counts[2].rows[0].count,
      swaps: counts[3].rows[0].count,
      notifications: counts[4].rows[0].count
    };
  }

  return {
    getMetrics,
  };
};
