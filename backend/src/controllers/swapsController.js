const swapService = require('../services/swapService');

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

module.exports = {
  saveSwap,
  unsaveSwap,
  listSaved,
};

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

// append new exports
module.exports.listAll = listAll;
module.exports.listByUser = listByUser;
module.exports.listByFriends = listByFriends;

const { makeFileUrl } = require('../services/storage');

// Create a new swap (expects body with fields used by swapService.createSwap)
async function createSwap(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const payload = req.body || {};
    // ensure user_id uses authenticated user only (prevent impersonation)
    payload.user_id = userId;

    // handle uploaded files (multer) - convert to media_files array
    if (req.files && Array.isArray(req.files) && req.files.length) {
      payload.media_files = req.files.map(f => ({ media_url: makeFileUrl(f.filename), media_type: f.mimetype }));
      // set legacy media_url to first file for backward compatibility
      payload.media_url = payload.media_files[0].media_url;
    }

    const created = await swapService.createSwap(payload);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

// Get swap by id
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

// Update swap
async function updateSwap(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    // Optionally verify ownership
    const existing = await swapService.getSwapById(id);
    if (!existing) return res.status(404).json({ error: 'Swap not found' });
    if (existing.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });
    const updated = await swapService.updateSwap(id, req.body || {});
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

// Delete swap
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

// List saved swaps for a specific email (frontend expects /:email/saved_swaps)
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

// append to exports
module.exports.createSwap = createSwap;
module.exports.getSwapById = getSwapById;
module.exports.updateSwap = updateSwap;
module.exports.deleteSwap = deleteSwap;
module.exports.listSavedByEmail = listSavedByEmail;
