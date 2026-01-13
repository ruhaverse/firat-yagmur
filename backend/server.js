#!/usr/bin/env node
require('dotenv').config();
const app = require('./src/index');
const logger = require('./src/common/logger');

const PORT = process.env.PORT || 4001;
const API_BASE = process.env.API_BASE || '/api/v1';

app.listen(PORT, () => {
  logger.info(`🚀 ShareUp Backend running on port ${PORT}`);
  logger.info(`📡 API Base: ${API_BASE}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`✅ Server ready at http://localhost:${PORT}${API_BASE}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
