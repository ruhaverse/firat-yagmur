/**
 * Image Optimization Utilities for Mobile & Web
 * 
 * Provides helper functions for responsive image loading
 * across different device types and screen sizes.
 */

/**
 * Get optimal image size based on viewport width
 * @param {number} viewportWidth - Current viewport width in pixels
 * @returns {string} - Size parameter: 'thumbnail' | 'small' | 'medium' | 'large'
 */
export const getOptimalImageSize = (viewportWidth) => {
  if (viewportWidth <= 480) return 'small';      // Small mobile
  if (viewportWidth <= 768) return 'medium';     // Large mobile / small tablet
  if (viewportWidth <= 1024) return 'medium';    // Tablet
  if (viewportWidth <= 1440) return 'large';     // Desktop
  return 'large';                                 // Large desktop
};

/**
 * Get image size for thumbnails/avatars
 * @returns {string} - Always returns 'thumbnail' (150px)
 */
export const getThumbnailSize = () => 'thumbnail';

/**
 * Build optimized image URL with size parameter
 * @param {string} originalUrl - Original image URL
 * @param {string} size - Size parameter: 'thumbnail' | 'small' | 'medium' | 'large'
 * @returns {string} - Optimized image URL
 */
export const buildOptimizedImageUrl = (originalUrl, size = 'medium') => {
  if (!originalUrl || originalUrl.startsWith('data:')) return originalUrl;
  
  try {
    const url = new URL(originalUrl, window.location.origin);
    
    // Only add size param for backend uploads
    if (url.pathname.includes('/uploads/')) {
      url.searchParams.set('size', size);
    }
    
    return url.toString();
  } catch (error) {
    console.error('Invalid image URL:', originalUrl);
    return originalUrl;
  }
};

/**
 * Preload critical images for faster loading
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @param {string} size - Size to preload
 */
export const preloadImages = (imageUrls, size = 'medium') => {
  imageUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = buildOptimizedImageUrl(url, size);
    document.head.appendChild(link);
  });
};

/**
 * Get device pixel ratio for retina displays
 * @returns {number} - Device pixel ratio (1, 2, 3, etc.)
 */
export const getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1;
};

/**
 * Determine if device is mobile
 * @returns {boolean}
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Determine if device is iOS
 * @returns {boolean}
 */
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

/**
 * Determine if device is Android
 * @returns {boolean}
 */
export const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

/**
 * Get connection speed (if available)
 * @returns {string} - 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
 */
export const getConnectionSpeed = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) return 'unknown';
  
  return connection.effectiveType || 'unknown';
};

/**
 * Should load high quality images based on connection
 * @returns {boolean}
 */
export const shouldLoadHighQuality = () => {
  const speed = getConnectionSpeed();
  
  // Don't load high quality on slow connections
  if (speed === 'slow-2g' || speed === '2g') return false;
  
  // Load high quality on 4G and unknown (assume good connection)
  return true;
};

/**
 * Get recommended image size based on device and connection
 * @param {string} defaultSize - Default size preference
 * @returns {string} - Recommended size
 */
export const getRecommendedImageSize = (defaultSize = 'medium') => {
  const isMobile = isMobileDevice();
  const highQuality = shouldLoadHighQuality();
  const viewportWidth = window.innerWidth;
  
  // Mobile with slow connection: use small
  if (isMobile && !highQuality) return 'small';
  
  // Mobile with good connection: use medium
  if (isMobile && highQuality) return 'medium';
  
  // Desktop/tablet: use optimal based on viewport
  return getOptimalImageSize(viewportWidth);
};

export default {
  getOptimalImageSize,
  getThumbnailSize,
  buildOptimizedImageUrl,
  preloadImages,
  getDevicePixelRatio,
  isMobileDevice,
  isIOS,
  isAndroid,
  getConnectionSpeed,
  shouldLoadHighQuality,
  getRecommendedImageSize,
};
