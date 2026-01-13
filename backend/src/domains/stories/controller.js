module.exports = function makeController() {
  return {
    listStories: async (req, res) => res.json({ data: [] }),
    listByUser: async (req, res) => res.json({ data: [] }),
    createStory: async (req, res) => res.json({ data: { ok: true } }),
  };
};
