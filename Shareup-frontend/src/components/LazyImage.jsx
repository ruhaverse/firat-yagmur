import React, { useEffect, useRef, useState } from 'react';

/**
 * LazyImage Component - Optimized image loading for mobile & web
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Responsive image sizes (thumbnail, small, medium, large)
 * - Automatic blur-up placeholder
 * - Fallback for browsers without IntersectionObserver
 * 
 * Usage:
 * <LazyImage 
 *   src="/uploads/photo.jpg"
 *   alt="Description"
 *   size="medium" // thumbnail | small | medium | large
 *   className="custom-class"
 * />
 */
const LazyImage = ({ 
  src, 
  alt = '', 
  size = 'medium', 
  className = '',
  placeholder = '/assets/img/placeholder.png',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  // Add size parameter to image URL if backend supports it
  const getOptimizedSrc = (originalSrc, imageSize) => {
    if (!originalSrc || originalSrc.startsWith('data:')) return originalSrc;
    
    // If it's an upload, add size query param
    if (originalSrc.includes('/uploads/')) {
      const url = new URL(originalSrc, window.location.origin);
      url.searchParams.set('size', imageSize);
      return url.toString();
    }
    
    return originalSrc;
  };

  useEffect(() => {
    // Check if browser supports IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately
      setImageSrc(getOptimizedSrc(src, size));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load the actual image when it enters viewport
            const optimizedSrc = getOptimizedSrc(src, size);
            setImageSrc(optimizedSrc);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // Start loading when image is 50px away from viewport
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, size]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    // Fallback to original src if optimized version fails
    if (imageSrc !== src) {
      setImageSrc(src);
    } else {
      // If original also fails, use placeholder
      setImageSrc(placeholder);
    }
    setImageLoaded(true);
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      loading="lazy"
      className={`${className} ${imageLoaded ? 'loaded' : ''}`}
      onLoad={handleImageLoad}
      onError={handleImageError}
      style={{
        opacity: imageLoaded ? 1 : 0.5,
        transition: 'opacity 0.3s ease-in-out',
      }}
      {...props}
    />
  );
};

export default LazyImage;
