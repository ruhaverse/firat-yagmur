import axios from "axios";
import settings from "./Settings";

const my_api = `${settings.apiUrl}/api/v1/users`;
let authAxios = null;

class AuthService {
  login = async (username, password) => {
    const response = await axios.post(my_api + "/authenticate", {
      username,
      password,
    });
    
    if (response.data.jwt) {
      // Note: localStorage can be vulnerable to XSS attacks
      // Consider using httpOnly cookies for production
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    
    return response;
  };

  logout() {
    localStorage.removeItem("user");
  }

  // register(username, email, password){
  //     return axios.post()
  // }

  // const getCurrentUser = () => sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("jwtUser")) : null

  getCurrentUser = () => {
    try {
      const user = localStorage.getItem("user");
      return user && user !== "undefined" ? JSON.parse(user) : null;
    } catch (error) {
      // Handle corrupted localStorage data
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };

  isLoggedIn = () => (this.getCurrentUser() ? true : false);

  setCurrentUser(data) {
    localStorage.setItem("user", JSON.stringify(data));
  }
}

export default new AuthService();
