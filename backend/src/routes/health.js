const express = require('express');
const router = express.Router();
const db = require('../config/db');
// const { getConfig } = require('../config/env');

// GET /api/v1/health
// Returns { sentry: boolean, db: boolean }
router.get('/', async (req, res, next) => {
  try {
    // Sentry removed; report false
    const sentryOk = false;
    let dbOk = false;
    try {
      await db.query('SELECT 1');
      dbOk = true;
    } catch (e) {
      dbOk = false;
    }

    res.json({ sentry: sentryOk, db: dbOk });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
