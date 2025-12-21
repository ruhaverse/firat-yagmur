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
