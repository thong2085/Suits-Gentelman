import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // You can add logic here to attach tokens to requests
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
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

export default instance;
