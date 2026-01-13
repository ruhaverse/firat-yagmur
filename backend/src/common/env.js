/**
 * Environment variable validation and configuration (common/env.js)
 */
const dotenv = require('dotenv');
const path = require('path');

// Load .env only in development, Railway injects env automatically
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const required = [
  'DATABASE_URL',
  'JWT_SECRET',
];

const defaults = {
  PORT: '4001',               // Local fallback port
  API_BASE: '/api/v1',
  NODE_ENV: 'development',
  BCRYPT_SALT_ROUNDS: '10',
  CORS_ORIGIN: '*',
  RELEASE: '',
};

function validateEnv() {
  const missing = [];
  for (const key of required) {
    if (!process.env[key]) missing.push(key);
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file or set these variables.`
    );
  }

  if (process.env.JWT_SECRET === 'secret' || process.env.JWT_SECRET === 'change_this_to_a_strong_secret') {
    console.warn('⚠️ WARNING: Using default JWT_SECRET is insecure! Please set a strong JWT_SECRET in your .env file.');
  }

  // Set default values for optional envs
  for (const [key, value] of Object.entries(defaults)) {
    if (!process.env[key]) process.env[key] = value;
  }
}

function getConfig() {
  validateEnv();

  return {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4001, // Railway dynamic port
    apiBase: process.env.API_BASE,
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10),
    corsOrigin: process.env.CORS_ORIGIN,
    spacesEndpoint: process.env.SPACES_ENDPOINT,
    spacesKey: process.env.SPACES_KEY,
    spacesSecret: process.env.SPACES_SECRET,
    spacesBucket: process.env.SPACES_BUCKET,
    release: process.env.RELEASE || '',
  };
}

module.exports = { validateEnv, getConfig };
