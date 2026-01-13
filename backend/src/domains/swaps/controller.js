const makeController = (deps) => {
  const swapService = deps.services.swapService;
  const makeFileUrl = deps.services.storage.makeFileUrl;

  // --- Save / Unsave swaps ---
  async function saveSwap(req, res, next) {
    try {
      const swapId = parseInt(req.params.id, 10);
      if (!swapId) return res.status(400).json({ error: 'Invalid swap id' });

      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const saved = await swapService.saveSwap(userId, swapId);
      res.json({ data: saved });
    } catch (err) {
      next(err);
    }
  }

  async function unsaveSwap(req, res, next) {
    try {
      const swapId = parseInt(req.params.id, 10);
      if (!swapId) return res.status(400).json({ error: 'Invalid swap id' });

      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await swapService.unsaveSwap(userId, swapId);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  // --- List swaps ---
  async function listSaved(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
      const status = req.query.status;
      const location = req.query.location;

      const email = req.user && req.user.email;
      if (!email) return res.status(401).json({ error: 'Unauthorized' });

      const result = await swapService.listSavedSwaps(email, { page, limit, status, location });
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  async function listAll(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
      const status = req.query.status;
      const location = req.query.location;

      const result = await swapService.listSwaps({ page, limit, status, location });
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  async function listByUser(req, res, next) {
    try {
      const email = req.params.email;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
      const status = req.query.status;
      const location = req.query.location;

      const result = await swapService.listSwapsByUser(email, { page, limit, status, location });
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  async function listByFriends(req, res, next) {
    try {
      const email = req.params.email;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
      const status = req.query.status;
      const location = req.query.location;

      const result = await swapService.listSwapsByFriends(email, { page, limit, status, location });
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  // --- Create / Read / Update / Delete swaps ---
  async function createSwap(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const payload = req.body || {};
      payload.user_id = userId;

      if (req.files && Array.isArray(req.files) && req.files.length) {
        payload.media_files = req.files.map(f => ({
          media_url: makeFileUrl(f.filename),
          media_type: f.mimetype
        }));
        payload.media_url = payload.media_files[0].media_url;
      }

      const created = await swapService.createSwap(payload);
      res.status(201).json({ data: created });
    } catch (err) {
      next(err);
    }
  }

  async function getSwapById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (!id) return res.status(400).json({ error: 'Invalid id' });

      const s = await swapService.getSwapById(id);
      if (!s) return res.status(404).json({ error: 'Swap not found' });

      res.json({ data: s });
    } catch (err) {
      next(err);
    }
  }

  async function updateSwap(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (!id) return res.status(400).json({ error: 'Invalid id' });

      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const existing = await swapService.getSwapById(id);
      if (!existing) return res.status(404).json({ error: 'Swap not found' });
      if (existing.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

      const updated = await swapService.updateSwap(id, req.body || {});
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }

  async function deleteSwap(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (!id) return res.status(400).json({ error: 'Invalid id' });

      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const existing = await swapService.getSwapById(id);
      if (!existing) return res.status(404).json({ error: 'Swap not found' });
      if (existing.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

      await swapService.deleteSwap(id, userId);
      res.json({ data: { id, deleted: true } });
    } catch (err) {
      next(err);
    }
  }

  async function listSavedByEmail(req, res, next) {
    try {
      const email = req.params.email;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
      const status = req.query.status;
      const location = req.query.location;

      const result = await swapService.listSavedSwaps(email, { page, limit, status, location });
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  return {
    saveSwap,
    unsaveSwap,
    listSaved,
    listAll,
    listByUser,
    listByFriends,
    createSwap,
    getSwapById,
    updateSwap,
    deleteSwap,
    listSavedByEmail
  };
};

module.exports = makeController;
