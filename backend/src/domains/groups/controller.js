module.exports = function makeController() {
  return {
    // simple controller stubs
    listGroups: async (req, res) => res.json({ data: [] }),
    getGroupById: async (req, res) => res.json({ data: null }),
    getGroupsByEmail: async (req, res) => res.json({ data: [] }),
    getGroupPosts: async (req, res) => res.json({ data: [] }),
    createGroup: async (req, res) => res.json({ data: { ok: true } }),
    joinGroup: async (req, res) => res.json({ data: { ok: true } }),
    leaveGroup: async (req, res) => res.json({ data: { ok: true } }),
  };
};
