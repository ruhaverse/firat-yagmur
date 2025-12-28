module.exports = function makeHealthService(deps) {
  const db = deps.db;

  async function checkDb() {
    try {
      await db.query('SELECT 1');
      return true;
    } catch (_) {
      return false;
    }
  }

  return { checkDb };
};
