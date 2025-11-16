/**
 * Simple logger utility for consistent logging across the application
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = {
  info: (...args) => {
    if (isDevelopment) {
      console.log('[INFO]', new Date().toISOString(), ...args);
    }
  },

  error: (...args) => {
    console.error('[ERROR]', new Date().toISOString(), ...args);
  },

  warn: (...args) => {
    console.warn('[WARN]', new Date().toISOString(), ...args);
  },

  debug: (...args) => {
    if (isDevelopment) {
      console.log('[DEBUG]', new Date().toISOString(), ...args);
    }
  }
};

module.exports = logger;
