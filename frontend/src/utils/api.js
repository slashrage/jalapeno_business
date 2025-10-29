import axios from 'axios';

const API_URL = '/api';

// Posts API
export const postsAPI = {
  // Get all posts (public)
  getAll: async (params = {}) => {
    const res = await axios.get(`${API_URL}/posts`, { params });
    return res.data;
  },

  // Get single post by slug (public)
  getBySlug: async (slug) => {
    const res = await axios.get(`${API_URL}/posts/slug/${slug}`);
    return res.data;
  },

  // Get single post by ID (admin)
  getById: async (id) => {
    const res = await axios.get(`${API_URL}/posts/${id}`);
    return res.data;
  },

  // Create post (admin)
  create: async (formData) => {
    const res = await axios.post(`${API_URL}/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  // Update post (admin)
  update: async (id, formData) => {
    const res = await axios.put(`${API_URL}/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  // Delete post (admin)
  delete: async (id) => {
    const res = await axios.delete(`${API_URL}/posts/${id}`);
    return res.data;
  },

  // Get categories
  getCategories: async () => {
    const res = await axios.get(`${API_URL}/posts/categories`);
    return res.data;
  },

  // Get tags
  getTags: async () => {
    const res = await axios.get(`${API_URL}/posts/tags`);
    return res.data;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return res.data;
  },

  register: async (name, email, password) => {
    const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    return res.data;
  },

  getMe: async () => {
    const res = await axios.get(`${API_URL}/auth/me`);
    return res.data;
  },

  updateUser: async (data) => {
    const res = await axios.put(`${API_URL}/auth/update`, data);
    return res.data;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const res = await axios.put(`${API_URL}/auth/updatepassword`, {
      currentPassword,
      newPassword
    });
    return res.data;
  }
};

export default { postsAPI, authAPI };
