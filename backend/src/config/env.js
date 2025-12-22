/**
 * Environment variable validation and configuration
 * Ensures all required environment variables are set before app starts
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Required environment variables
 * App will not start if these are missing
 */
const required = [
  'DATABASE_URL',
  'JWT_SECRET',
];

/**
 * Optional environment variables with defaults
 */
const defaults = {
  PORT: '8080',
  API_BASE: '/api/v1',
  NODE_ENV: 'development',
  BCRYPT_SALT_ROUNDS: '10',
  CORS_ORIGIN: '*',
  RELEASE: '',
};

/**
 * Validate environment variables
 */
function validateEnv() {
  const missing = [];

  // Check required variables
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file or set these variables.`
    );
  }

  // Validate JWT_SECRET is not default value
  if (process.env.JWT_SECRET === 'secret' || process.env.JWT_SECRET === 'change_this_to_a_strong_secret') {
    console.warn(
      '⚠️  WARNING: Using default JWT_SECRET is insecure!\n' +
      '   Please set a strong JWT_SECRET in your .env file.'
    );
  }

  // Set defaults for optional variables
  for (const [key, value] of Object.entries(defaults)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

/**
 * Get validated environment configuration
 */
function getConfig() {
  validateEnv();

  return {
    port: parseInt(process.env.PORT, 10),
    apiBase: process.env.API_BASE,
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10),
    corsOrigin: process.env.CORS_ORIGIN,
    // Storage (optional)
    spacesEndpoint: process.env.SPACES_ENDPOINT,
    spacesKey: process.env.SPACES_KEY,
    spacesSecret: process.env.SPACES_SECRET,
    spacesBucket: process.env.SPACES_BUCKET,
      // Release/version (optional)
      release: process.env.RELEASE || '',
  };
}

module.exports = { validateEnv, getConfig };
