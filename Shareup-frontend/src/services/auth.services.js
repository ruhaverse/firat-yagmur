import axios from "axios";
import settings from "./Settings";

const my_api = `${settings.apiUrl}/api/v1/users`;

class AuthService {
  /**
   * Login user and store JWT token
   * @param {string} username - User email
   * @param {string} password - User password
   * @returns {Promise} API response
   */
  login = async (username, password) => {
    const response = await axios.post(my_api + "/authenticate", {
      username,
      password,
    });
    
    if (response.data.jwt) {
      // Store token with metadata for validation
      const tokenData = {
        ...response.data,
        timestamp: Date.now(),
        expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      };
      
      try {
        localStorage.setItem("user", JSON.stringify(tokenData));
      } catch (error) {
        console.error("Failed to store auth data:", error);
        throw new Error("Authentication storage failed");
      }
    }
    
    return response;
  };

  /**
   * Logout user and clear stored data
   */
  logout() {
    try {
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  }

  /**
   * Get current user from localStorage with validation
   * @returns {Object|null} User data or null if invalid/expired
   */
  getCurrentUser = () => {
    try {
      const userData = localStorage.getItem("user");
      
      if (!userData || userData === "undefined") {
        return null;
      }

      const parsed = JSON.parse(userData);
      
      // Validate token expiry if metadata exists
      if (parsed.timestamp && parsed.expiresIn) {
        const now = Date.now();
        const tokenAge = now - parsed.timestamp;
        
        if (tokenAge > parsed.expiresIn) {
          // Token expired, clear it
          this.logout();
          return null;
        }
      }
      
      return parsed;
    } catch (error) {
      // Handle corrupted localStorage data
      console.error("Error parsing user from localStorage:", error);
      this.logout(); // Clear corrupted data
      return null;
    }
  };

  /**
   * Check if user is logged in
   * @returns {boolean}
   */
  isLoggedIn = () => {
    const user = this.getCurrentUser();
    return user !== null && user.jwt !== undefined;
  };

  /**
   * Update current user data in localStorage
   * @param {Object} data - User data to store
   */
  setCurrentUser(data) {
    try {
      const tokenData = {
        ...data,
        timestamp: Date.now(),
        expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
      };
      localStorage.setItem("user", JSON.stringify(tokenData));
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  }
}

export default new AuthService();
