const { v4: uuidv4 } = require('uuid');
const logger = require('../logger');

function requestLogger(req, res, next) {
  const headerId = req.headers['x-request-id'];
  const id = headerId || uuidv4();
  res.setHeader('X-Request-Id', id);
  req.requestId = id;

  try {
    req.log = logger.child({ requestId: id });
  } catch {
    // noop if child creation fails
  }

  next();
}

module.exports = requestLogger;
