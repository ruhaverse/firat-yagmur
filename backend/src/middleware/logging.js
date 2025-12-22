const { v4: uuidv4 } = require('uuid');

function requestLogger(req, res, next) {
  // Correlation id
  const headerId = req.headers['x-request-id'];
  const id = headerId || uuidv4();
  res.setHeader('X-Request-Id', id);
  req.requestId = id;

  next();
}

module.exports = requestLogger;
