import api from "@/lib/axios";

const Login = async (email: string, password: string) => {
  try {
    const response = await api.post("/authenticate", {
      email,
      password
    });
    console.log(response.data);
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    return response;
  } catch (error) {
    return
  }
}

const Register = async (email: string, username: string, password: string) => {
  try {
    const response = await api.post("/register", {
      email,
      username,
      password
    });
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    return response;
  } catch (error) {
    return
  }

}

const Logout = () => {

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

}

export const useAuth = () => {
  return {
    Login,
    Register,
    Logout
  }
}