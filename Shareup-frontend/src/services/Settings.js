const settings = {
  dev: {
    apiUrl: "http://localhost:8080", // Local development (if running backend locally)
  },
  staging: {
    apiUrl: "https://staging.shareuptime.com", // Staging environment
  },
  prod: {
    apiUrl: "https://www.shareuptime.com", // Production - Mobile App Backend (60+ endpoints)
  },
};

const getCurrentSettings = () => {
  // Use production (shareuptime.com) - same backend as mobile app
  // return settings.prod;
   if (process.env.NODE_ENV === "development") {
    return settings.dev;
  } else if (process.env.NODE_ENV === "staging") {
    return settings.staging;
  } else {
    return settings.prod;
  }

};

export default getCurrentSettings();
