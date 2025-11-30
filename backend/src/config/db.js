const { Pool } = require('pg');
const logger = require('../utils/logger');
const { getConfig } = require('./env');

const config = getConfig();

const pool = new Pool({
  connectionString: config.databaseUrl,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
