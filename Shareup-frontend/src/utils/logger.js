/**
 * Logger utility for frontend development
 * Console logs are disabled in production builds
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log('[LOG]', ...args);
    }
  },

  info: (...args) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },

  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },

  error: (...args) => {
    console.error('[ERROR]', ...args);
  },

  debug: (...args) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  }
};

export default logger;
