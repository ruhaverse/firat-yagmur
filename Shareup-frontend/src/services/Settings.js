const settings = {
  dev: {
    apiUrl: "http://localhost:4001", // Local development (if running backend locally)
  },
  staging: {
    apiUrl: "https://staging-api.shareuptime.com", // Staging environment - Backend API
  },
  prod: {
    apiUrl: "https://api.shareuptime.com", // Production - Backend API (60+ endpoints)
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
  } else if (hostname.includes('github.dev')) {
    // GitHub Codespaces - port forward 3000→3000, 4001→4001
    const port = window.location.port || '3000';
    const backendPort = port === '3000' ? '4001' : port;
    const backendUrl = `http://${hostname}:${backendPort}`;
    return {
      apiUrl: backendUrl
    };
  } else if (hostname.includes('staging')) {
    return settings.staging;
  } else {
    return settings.prod;
  }
};

export default getCurrentSettings();
