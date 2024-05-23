import axios from "axios";
import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";

class AuthService {
  userId;

  isLoggedIn(): boolean {
    const token = secureLocalStorage.getItem("accessToken");

    if (!token) {
      return false;
    }
    const decoded = jwtDecode(token as string);
    if (decoded.exp > Date.now()) {
      return false;
    }
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    } else {
      return false;
    }
  }

  getUserType() {}

  isManager() {
    if (this.isLoggedIn()) {
      const user_type = secureLocalStorage.getItem("user_type");

      if (user_type === 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getUserId() {
    const user_id = secureLocalStorage.getItem("user_id");

    return user_id;
  }
}

export default new AuthService();
