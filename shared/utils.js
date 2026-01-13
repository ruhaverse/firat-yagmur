/**
 * 🔗 Shared Utility Functions
 * Used by both Web and Mobile frontends
 */

// Date formatting
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

// Full name
export const getFullName = (user) => {
  if (!user) return 'Unknown User';
  return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous';
};

// Initials
export const getInitials = (user) => {
  if (!user) return '??';
  const first = (user.first_name || '').charAt(0).toUpperCase();
  const last = (user.last_name || '').charAt(0).toUpperCase();
  return `${first}${last}` || 'AN';
};

// Image URL builder
export const buildImageUrl = (path, size = 'medium') => {
  if (!path) return null;
  
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Add size parameter
  const baseUrl = process.env.REACT_APP_API_URL || process.env.EXPO_PUBLIC_API_URL || '';
  const separator = path.includes('?') ? '&' : '?';
  
  return `${baseUrl.replace('/api/v1', '')}${path}${separator}size=${size}`;
};

// Format count (1K, 1M, etc.)
export const formatCount = (count) => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password
export const isValidPassword = (password) => {
  // At least 8 characters
  return password && password.length >= 8;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Generate avatar color
export const getAvatarColor = (userId) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#FF9AA2', '#C7CEEA'
  ];
  return colors[userId % colors.length];
};

// Privacy labels
export const getPrivacyLabel = (privacy) => {
  const labels = {
    public: '🌐 Public',
    friends: '👥 Friends',
    private: '🔒 Only Me',
  };
  return labels[privacy] || labels.public;
};

// Error message extractor
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  
  if (error.response) {
    return error.response.data?.message || 
           error.response.data?.error || 
           'An error occurred';
  }
  
  if (error.message) return error.message;
  
  return 'An unexpected error occurred';
};

// Deep clone
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Check if mobile device
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Get platform
export const getPlatform = () => {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  return 'web';
};

// Sort by date
export const sortByDate = (items, key = 'created_at', order = 'desc') => {
  return items.sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

// Group by date
export const groupByDate = (items, key = 'created_at') => {
  const grouped = {};
  
  items.forEach((item) => {
    const date = new Date(item[key]).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    
    if (!grouped[date]) {
      grouped[date] = [];
    }
    
    grouped[date].push(item);
  });
  
  return grouped;
};

// Remove duplicates
export const removeDuplicates = (items, key = 'id') => {
  const seen = new Set();
  return items.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// Chunk array
export const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Safe JSON parse
export const safeJSONParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

// Export all
export default {
  formatDate,
  getFullName,
  getInitials,
  buildImageUrl,
  formatCount,
  isValidEmail,
  isValidPassword,
  truncateText,
  getAvatarColor,
  getPrivacyLabel,
  getErrorMessage,
  deepClone,
  debounce,
  throttle,
  generateId,
  isMobileDevice,
  getPlatform,
  sortByDate,
  groupByDate,
  removeDuplicates,
  chunkArray,
  safeJSONParse,
};
