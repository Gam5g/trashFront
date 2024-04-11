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

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log(refreshToken);
        const response = await axios.post(
          "http://3.39.190.90/api/auth/token",
          {
            refreshToken: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const newAccessToken = response.headers.authorization;
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
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
