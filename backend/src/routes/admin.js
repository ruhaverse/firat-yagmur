const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
// const { getConfig } = require('../config/env');

// GET /api/v1/admin/metrics - basic system metrics (admin only)
router.get('/metrics', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const common = require('../common');
    const adminService = common && common.services && common.services.adminService;
    if (!adminService) return res.status(500).json({ error: 'Admin service unavailable' });
    const metrics = await adminService.getMetrics();
    res.json({ data: metrics });
  } catch (err) { next(err); }
});

module.exports = router;
