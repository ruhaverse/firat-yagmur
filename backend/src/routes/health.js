const express = require('express');
const router = express.Router();
// GET /api/v1/health
// Returns { sentry: boolean, db: boolean }
router.get('/', async (req, res, next) => {
  try {
    const sentryOk = false;
    const common = require('../common');
    const healthService = common && common.services && common.services.healthService;
    if (!healthService) return res.json({ sentry: sentryOk, db: false });
    const dbOk = await healthService.checkDb();
    res.json({ sentry: sentryOk, db: dbOk });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
