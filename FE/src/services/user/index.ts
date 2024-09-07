import axiosInstance from '../../config/axios';

// export const addUser = async (userData) => {
//   try {
//     const response = await axiosInstance.post('/api/users/', userData);
//     return response.data;
//   } catch (error) {
//     console.error('Error adding user:', error.response?.data);
//   }
// };

// export const fetchUsers = async (post = false) => {
//   try {
//     const response = await axiosInstance.get('/api/users', {
//       params: { post },
//     });
//     return response.data.data;
//   } catch (error) {
//     console.error('Error fetching users:', error.response?.data || error.message);
//     throw error;
//   }
// };

export const updateUserById = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/api/users/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response?.data);
    throw error; // Hata fırlatarak üst katmanlarda işlenmesini sağlayın
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error.response?.data);
  }
};
