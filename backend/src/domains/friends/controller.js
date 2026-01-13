module.exports = function makeController(deps) {
  const { service } = deps;

  return {
    listByEmail: async (req, res) => {
      try {
        const email = req.params.email;
        const rows = await service.listByEmail(email);
        return res.json({ data: rows });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    addFriend: async (req, res) => {
      try {
        const { uid, fid } = req.params;
        const result = await service.addFriend(uid, fid);
        return res.json({ data: result });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    removeFriend: async (req, res) => {
      try {
        const { uid, fid } = req.params;
        const result = await service.removeFriend(uid, fid);
        return res.json({ data: result });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    sendRequest: async (req, res) => {
      try {
        const { uid, fid } = req.params;
        const result = await service.sendRequest(uid, fid);
        return res.json({ data: result });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    acceptRequest: async (req, res) => {
      try {
        const { uid, fid } = req.params;
        const result = await service.acceptRequest(uid, fid);
        return res.json({ data: result });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    declineRequest: async (req, res) => {
      try {
        const { uid, fid } = req.params;
        const result = await service.declineRequest(uid, fid);
        return res.json({ data: result });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    listRequestsSent: async (req, res) => {
      try {
        const email = req.params.email;
        const rows = await service.listRequestsSent(email);
        return res.json({ data: rows });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    listRequestsReceived: async (req, res) => {
      try {
        const email = req.params.email;
        const rows = await service.listRequestsReceived(email);
        return res.json({ data: rows });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },
  };
};
