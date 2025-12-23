const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

function requestLogger(req, res, next) {
  // Correlation id
  const headerId = req.headers['x-request-id'];
  const id = headerId || uuidv4();
  res.setHeader('X-Request-Id', id);
  req.requestId = id;

  // Attach a minimal per-request logger early so other middleware can use it
  try {
    req.log = logger.child({ requestId: id });
  } catch (e) {
    // noop if child creation fails
  }

  next();
}

module.exports = requestLogger;
