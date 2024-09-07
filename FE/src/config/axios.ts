import axios from 'axios';
import { refreshToken } from '@/src/services/auth';

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo && userInfo.id) {
        config.headers.userId = userInfo.id; // Başlık olarak userId ekle
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 403) {
//       const refreshTokenFromStorage = localStorage.getItem("refreshToken");

//       try {
//         const accessToken = await refreshToken(refreshTokenFromStorage);

//         originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Error refreshing token:", refreshError);
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
