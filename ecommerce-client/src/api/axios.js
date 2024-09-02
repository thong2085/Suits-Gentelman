import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
    }
    return config;
  },
  (error) => {
    console.error("Axios request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can add global error handling logic here
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      // For example, redirect to login page or refresh token
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
