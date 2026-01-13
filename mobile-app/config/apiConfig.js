/**
 * API Configuration - Shared between Web and Mobile
 * Desktop: Port 3000
 * Mobile: Same backend port 4001
 * One API, Multiple Clients
 */

export const API_BASE_URLS = {
  development: 'http://localhost:4001/api/v1',
  staging: 'https://staging-api.shareuptime.com/api/v1',
  production: 'https://api.shareuptime.com/api/v1',
};

export const getApiUrl = () => {
  const env = process.env.REACT_APP_ENV || 'development';
  return API_BASE_URLS[env];
};

// Authentication
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  VERIFY_EMAIL: '/auth/verify-email',
};

// Users
export const USER_ENDPOINTS = {
  PROFILE: (id) => `/users/${id}`,
  UPDATE_PROFILE: (id) => `/users/${id}`,
  SEARCH: '/users/search',
  FOLLOW: (id) => `/users/${id}/follow`,
  UNFOLLOW: (id) => `/users/${id}/unfollow`,
};

// Posts
export const POST_ENDPOINTS = {
  FEED: '/posts',
  CREATE: '/posts',
  GET: (id) => `/posts/${id}`,
  UPDATE: (id) => `/posts/${id}`,
  DELETE: (id) => `/posts/${id}`,
  LIKE: (id) => `/posts/${id}/like`,
  UNLIKE: (id) => `/posts/${id}/unlike`,
  COMMENT: (id) => `/posts/${id}/comments`,
  DELETE_COMMENT: (postId, commentId) => `/posts/${postId}/comments/${commentId}`,
};

// Reels
export const REELS_ENDPOINTS = {
  FEED: '/reels',
  CREATE: '/reels',
  GET: (id) => `/reels/${id}`,
  DELETE: (id) => `/reels/${id}`,
  LIKE: (id) => `/reels/${id}/like`,
};

// Messages
export const MESSAGE_ENDPOINTS = {
  CONVERSATIONS: '/messages/conversations',
  MESSAGES: (conversationId) => `/messages/conversations/${conversationId}`,
  SEND: '/messages/send',
};

// Notifications
export const NOTIFICATION_ENDPOINTS = {
  GET: '/notifications',
  MARK_READ: '/notifications/mark-read',
};

// Stories
export const STORY_ENDPOINTS = {
  GET: '/stories',
  CREATE: '/stories',
  DELETE: (id) => `/stories/${id}`,
};

// Groups
export const GROUP_ENDPOINTS = {
  LIST: '/groups',
  CREATE: '/groups',
  GET: (id) => `/groups/${id}`,
  UPDATE: (id) => `/groups/${id}`,
  DELETE: (id) => `/groups/${id}`,
  JOIN: (id) => `/groups/${id}/join`,
  LEAVE: (id) => `/groups/${id}/leave`,
};
