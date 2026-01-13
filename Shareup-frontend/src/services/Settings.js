const settings = {
  dev: {
    apiUrl: "http://localhost:4001", // Local development (if running backend locally)
  },
  staging: {
    apiUrl: "https://staging.shareuptime.com", // Staging environment
  },
  prod: {
    apiUrl: "https://www.shareuptime.com", // Production - Mobile App Backend (60+ endpoints)
  },
};

const getCurrentSettings = () => {
  // Check environment - use REACT_APP_API_URL if available, otherwise detect from hostname
  if (process.env.REACT_APP_API_URL) {
    return {
      apiUrl: process.env.REACT_APP_API_URL
    };
  }
  
  // Auto-detect environment based on hostname
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return settings.dev;
  } else if (hostname.includes('staging')) {
    return settings.staging;
  } else {
    return settings.prod;
  }
};

export default getCurrentSettings();
