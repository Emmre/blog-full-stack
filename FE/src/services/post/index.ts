import axiosInstance from '../../config/axios';

// Handle API errors
const handleError = (error) => {
  console.error(error.response?.data || error.message);
  throw error;
};

// Fetch all posts
export const fetchAllPosts = async () => {
  try {
    const response = await axiosInstance.get('/api/posts');
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

// Create a new post
export const createNewPost = async (formData) => {
  try {
    const response = await axiosInstance.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch post by ID
export const fetchPostById = async (postId) => {
  try {
    const response = await axiosInstance.get(`/api/posts/${postId}`);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch post by slug
export const fetchPostBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/api/posts/slug/${slug}`);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch post by category
export const fetchPostsByCategory = async (category: string) => {
  try {
    const response = await axiosInstance.get(`/api/posts/category/${category}`);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

// Create a new category
export const createCategory = async (name) => {
  try {
    const response = await axiosInstance.post('/api/categories', { name });
    return response.data.data; // API'den dönen veriyi döndürün
  } catch (error) {
    handleError(error); // Use your error handling method
  }
};

// Fetch all categories
export const fetchAllCategories = async (hasPost: boolean = false) => {
  try {
    const response = await axiosInstance.get('/api/categories', {
      params: {
        hasPost,
      },
    });
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

// // Fetch category by ID
// export const fetchCategoryById = async (id) => {
//   try {
//     const response = await axiosInstance.get(`/api/categories/${id}`);
//     return response.data.data; // API'den dönen kategori
//   } catch (error) {
//     handleError(error);
//   }
// };

// Delete category by ID
export const deleteCategoryById = async (id) => {
  try {
    await axiosInstance.delete(`/api/categories/${id}`);
    console.log(`Category with ID ${id} deleted successfully.`);
    // Başarı mesajı veya UI'de bir güncelleme yapabilirsiniz
  } catch (error) {
    handleError(error);
  }
};

// Delete all posts
export const deleteAllPosts = async () => {
  try {
    const response = await axiosInstance.delete('/api/posts/all');
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete post by ID
export const deletePostById = async (postId) => {
  try {
    const response = await axiosInstance.delete(`/api/posts/${postId}`);
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch favorite posts
export const fetchFavoritePosts = async () => {
  try {
    const response = await axiosInstance.get('/api/posts/favorites');
    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

// Add or remove post from favorites
export const addPostToFavorites = async (values) => {
  try {
    const response = await axiosInstance.post('/api/posts/favorites', values);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Edit a post
export const editPost = async (id, postData) => {
  try {
    const response = await axiosInstance.put(`/api/posts/${id}`, postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
