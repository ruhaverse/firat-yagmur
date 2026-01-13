/**
 * 🔗 Shared API Configuration
 * Used by both Web and Mobile frontends
 */

// API Base URLs
export const API_BASE_URLS = {
  development: 'http://localhost:4001/api/v1',
  staging: 'https://staging-api.shareuptime.com/api/v1',
  production: 'https://api.shareuptime.com/api/v1',
};

// API Endpoints (shared between web and mobile)
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Users
  USERS: {
    PROFILE: (id) => `/users/${id}`,
    UPDATE_PROFILE: (id) => `/users/${id}`,
    UPDATE_PASSWORD: (id) => `/users/${id}/password`,
    UPLOAD_AVATAR: (id) => `/users/${id}/avatar`,
    UPLOAD_COVER: (id) => `/users/${id}/cover`,
    SEARCH: '/users/search',
    FRIENDS: (id) => `/users/${id}/friends`,
    FOLLOW: (id) => `/users/${id}/follow`,
    UNFOLLOW: (id) => `/users/${id}/unfollow`,
  },

  // Posts
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    GET: (id) => `/posts/${id}`,
    UPDATE: (id) => `/posts/${id}`,
    DELETE: (id) => `/posts/${id}`,
    LIKE: (id) => `/posts/${id}/like`,
    UNLIKE: (id) => `/posts/${id}/unlike`,
    COMMENT: (id) => `/posts/${id}/comments`,
    SHARE: (id) => `/posts/${id}/share`,
  },

  // News Feed
  NEWSFEED: {
    LIST: '/newsfeed',
    TRENDING: '/newsfeed/trending',
  },

  // Reels
  REELS: {
    LIST: '/reels',
    CREATE: '/reels',
    GET: (id) => `/reels/${id}`,
    DELETE: (id) => `/reels/${id}`,
    LIKE: (id) => `/reels/${id}/like`,
    COMMENT: (id) => `/reels/${id}/comments`,
  },

  // Stories
  STORIES: {
    LIST: '/stories',
    CREATE: '/stories',
    DELETE: (id) => `/stories/${id}`,
    VIEW: (id) => `/stories/${id}/view`,
  },

  // Groups
  GROUPS: {
    LIST: '/groups',
    CREATE: '/groups',
    GET: (id) => `/groups/${id}`,
    UPDATE: (id) => `/groups/${id}`,
    DELETE: (id) => `/groups/${id}`,
    JOIN: (id) => `/groups/${id}/join`,
    LEAVE: (id) => `/groups/${id}/leave`,
    POSTS: (id) => `/groups/${id}/posts`,
  },

  // Hangs
  HANGS: {
    LIST: '/hangs',
    CREATE: '/hangs',
    GET: (id) => `/hangs/${id}`,
    UPDATE: (id) => `/hangs/${id}`,
    DELETE: (id) => `/hangs/${id}`,
    JOIN: (id) => `/hangs/${id}/join`,
    LEAVE: (id) => `/hangs/${id}/leave`,
  },

  // SwapPoints
  SWAPS: {
    LIST: '/swaps',
    CREATE: '/swaps',
    GET: (id) => `/swaps/${id}`,
    UPDATE: (id) => `/swaps/${id}`,
    DELETE: (id) => `/swaps/${id}`,
    ACCEPT: (id) => `/swaps/${id}/accept`,
    REJECT: (id) => `/swaps/${id}/reject`,
  },

  // Messages
  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    GET_CONVERSATION: (id) => `/messages/conversations/${id}`,
    SEND: '/messages',
    DELETE: (id) => `/messages/${id}`,
    MARK_READ: (id) => `/messages/${id}/read`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id) => `/notifications/${id}`,
  },

  // Search
  SEARCH: {
    GLOBAL: '/search',
    USERS: '/search/users',
    POSTS: '/search/posts',
    GROUPS: '/search/groups',
  },

  // Media/Uploads
  UPLOADS: {
    IMAGE: '/uploads/image',
    VIDEO: '/uploads/video',
    FILE: '/uploads/file',
  },
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Image Sizes (backend supports these)
export const IMAGE_SIZES = {
  THUMBNAIL: 'thumbnail',  // 150px
  SMALL: 'small',          // 320px (mobile)
  MEDIUM: 'medium',        // 640px (tablet)
  LARGE: 'large',          // 1280px (desktop)
  ORIGINAL: null,          // Original size
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Request timeout (ms)
export const REQUEST_TIMEOUT = 10000; // 10 seconds

// Token storage keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
};

export default {
  API_BASE_URLS,
  API_ENDPOINTS,
  HTTP_METHODS,
  HTTP_STATUS,
  IMAGE_SIZES,
  PAGINATION,
  REQUEST_TIMEOUT,
  STORAGE_KEYS,
};
