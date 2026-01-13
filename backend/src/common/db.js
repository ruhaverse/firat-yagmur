const { Pool } = require('pg');
const logger = require('./logger');
const { getConfig } = require('./env');

const config = getConfig();

// Pool options
const poolOptions = {
  connectionString: config.databaseUrl,
};

// Enable SSL **only in production**
if (config.nodeEnv === 'production') {
  poolOptions.ssl = {
    rejectUnauthorized: false, // Railway requires this for managed Postgres
  };
}

const pool = new Pool(poolOptions);

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  // Throw to terminate process (better than process.exit)
  throw err;
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
