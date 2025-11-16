import axios from "axios";
import settings from "./Settings";

const my_api = `${settings.apiUrl}/api/v1/users`;
let authAxios = null;

class AuthService {
  login = async (username, password) => {
    return await axios
      .post(my_api + "/authenticate", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.jwt) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response;
      });
  };

  logout() {
    localStorage.removeItem("user");
  }

  // register(username, email, password){
  //     return axios.post()
  // }

  // const getCurrentUser = () => sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("jwtUser")) : null

  getCurrentUser = () =>
    localStorage.getItem("user") != "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : "";

  isLoggedIn = () => (this.getCurrentUser() ? true : false);

  setCurrentUser(data) {
    localStorage.setItem("user", JSON.stringify(data));
  }
}

export default new AuthService();
