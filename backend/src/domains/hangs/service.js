const model = require('./model');

module.exports = function createService(deps) {
  const db = deps.db;

  return {
    async createHang({ userId, title, description }) {
      // Basic business rules: ensure title or description present
      if (!userId) throw new Error('Authentication required');

      const row = await model.insert(db, { user_id: userId, title, description });
      return row;
    }
  };
};
