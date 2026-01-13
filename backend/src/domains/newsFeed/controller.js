module.exports = function makeController() {
  return {
    getFeedForUser: async (req, res) => res.json({ data: [] }),
    listFeeds: async (req, res) => res.json({ data: [] }),
  };
};
