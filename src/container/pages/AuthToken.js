import axios from "axios";

const AuthToken = axios.create({
  baseURL: "http://54.180.237.99:8080/api",
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
      try {
        const response = await axios.post(
          "http://54.180.237.99/api/auth/token",
          {
            headers: {
              //RefreshToken: `${refreshtoken}`,
              "Content-Type": "application/json",
              withCredentials: true,
            },
          }
        );
        /*const response = await axios.post("http://54.180.237.99/api/auth/token?RefreshToken={$RefreshToken}"*/
        if (response.status === 200 && response.data.accessToken) {
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
