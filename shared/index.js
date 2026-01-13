/**
 * 🔗 Shared Code Index
 * Export all shared modules
 */

export * from './api-config';
export * from './types';
export * as utils from './utils';

// Re-export for convenience
import * as apiConfig from './api-config';
import * as types from './types';
import * as utils from './utils';

export default {
  ...apiConfig,
  types,
  utils,
};
