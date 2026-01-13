/**
 * Mobile App API Configuration
 * Shared with Web Frontend - uses same backend API
 */

export const API_CONFIG = {
  development: {
    apiUrl: 'http://localhost:4001',
    apiBase: '/api/v1',
  },
  staging: {
    apiUrl: 'https://staging-api.shareuptime.com',
    apiBase: '/api/v1',
  },
  production: {
    apiUrl: 'https://api.shareuptime.com',
    apiBase: '/api/v1',
  },
};

export const getEnvironment = () => {
  // Default to production
  const env = process.env.EXPO_APP_ENVIRONMENT || 'production';
  return API_CONFIG[env] || API_CONFIG.production;
};

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // Users
  USERS: {
    PROFILE: (id) => `/users/${id}`,
    UPDATE_PROFILE: (id) => `/users/${id}`,
    SEARCH: '/users/search',
  },

  // Posts
  POSTS: {
    FEED: '/posts',
    CREATE: '/posts',
    DETAIL: (id) => `/posts/${id}`,
    DELETE: (id) => `/posts/${id}`,
    LIKE: (id) => `/posts/${id}/like`,
    UNLIKE: (id) => `/posts/${id}/unlike`,
  },

  // Reels
  REELS: {
    FEED: '/reels',
    CREATE: '/reels',
    LIKE: (id) => `/reels/${id}/like`,
  },

  // Messages
  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    SEND: '/messages/send',
    FETCH: (conversationId) => `/messages/conversations/${conversationId}`,
  },

  // Notifications
  NOTIFICATIONS: {
    FETCH: '/notifications',
    MARK_READ: '/notifications/mark-read',
  },
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  getEnvironment,
};
