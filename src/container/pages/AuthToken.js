import axios from "axios";

const AuthToken = axios.create({
  baseURL: "http://3.39.190.90/api",
  headers: { "Content-Type": "application/json" },
});

AuthToken.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AuthToken.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.response &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      //const refreshtoken = cookies.get("RefreshToken");
      //originalRequest.headers.RefreshToken = `${refreshtoken}`;
      try {
        const response = await axios.post("http://3.39.190.90/api/auth/token", {
          headers: {
            //RefreshToken: `${refreshtoken}`,
            "Content-Type": "application/json",
            withCredentials: true,
          },
        });
        /*const response = await axios.post("http://3.39.190.90/api/auth/token?RefreshToken={$RefreshToken}"*/
        if (response.status === 200 && response.data.accessToken) {
          //cookies.save("Authorization", response.data.accessToken, {});
          //const accessToken = cookies.load("Authorization");
          //const newAccessToken = response.headers.authorization;
          //localStorage.setItem("accessToken", newAccessToken);
          //originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        }
      } catch (error) {
        console.error("토큰 갱신에 실패했습니다.", error);
      }
    }

    return Promise.reject(error);
  }
);

export default AuthToken;
