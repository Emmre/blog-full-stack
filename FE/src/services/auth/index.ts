import axiosInstance from '@/src/config/axios';

interface IValues {
  username: string;
  password: string;
}

export const login = async (values: IValues) => {
  try {
    const response = await axiosInstance.post('/auth/login', values);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// export const register = async (username, password) => {
//   try {
//     const response = await axiosInstance.post('/auth/register', { username, password });
//     const { accessToken, refreshToken } = response.data.data;

//     // Token'ları saklayın
//     localStorage.setItem('token', accessToken);
//     localStorage.setItem('refreshToken', refreshToken);

//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// // Forgot Password İşlevi
// export const forgotPassword = async (username) => {
//   try {
//     const response = await axiosInstance.post('/auth/forgot-password', { username });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// // Refresh Token İşlevi
// export const refreshToken = async (refreshToken) => {
//   try {
//     const response = await axiosInstance.post('/auth/refresh-token', { token: refreshToken });
//     const { accessToken } = response.data.data;

//     localStorage.setItem('token', accessToken);

//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// // Logout İşlevi
// export const logout = async (token) => {
//   try {
//     await axiosInstance.post('/auth/logout', { token });
//     // Token'ları temizleyin
//     localStorage.removeItem('token');
//     localStorage.removeItem('refreshToken');
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// export const verifyToken = async () => {
//   try {
//     const token = getToken();

//     if (!token) {
//       throw new Error('No token found');
//     }

//     const response = await axiosInstance.post(
//       '/auth/verify-token',
//       { token: token },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.status === 200;
//   } catch (error) {
//     console.error('Token verification failed', error);
//   }
// };
