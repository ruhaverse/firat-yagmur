const { Pool } = require('pg');
const logger = require('./logger');
const { getConfig } = require('./env');

const config = getConfig();

const pool = new Pool({
  connectionString: config.databaseUrl,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  // bubble up the error so the process terminates with an exception (preferred over process.exit)
  throw err;
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
