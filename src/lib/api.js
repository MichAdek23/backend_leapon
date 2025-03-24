import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://leapon.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API methods for user accounts
export const userApi = {
  login: (email, password) => api.post('/users/login', { email, password }),
  register: (data) => api.post('/users/register', data),
  getMentors: () => api.get('/users/mentors'),
  getMentees: () => api.get('/users/mentees'),
  getProfile: () => api.get('/users/me'),
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  updatePassword: (data) => api.put('/users/password', data),
  completeProfile: (data) => api.put('/users/complete-profile', data),
  uploadProfilePicture: (formData) => {
    // Override the default Content-Type for file upload
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    return api.post('/users/profile-picture', formData, config);
  }
};

// API methods for sessions
export const sessionApi = {
  getAll: () => api.get('/sessions/pending'),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post('/sessions', data),
  update: (id, data) => api.put(`/sessions/${id}/status`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
  join: (id) => api.post(`/sessions/${id}/join`),
  leave: (id) => api.post(`/sessions/${id}/leave`),
  getHistory: () => api.get('/sessions/history'),
  getUpcoming: () => api.get('/sessions/upcoming')
};

// API methods for messages
export const messageApi = {
  getAll: () => api.get('/messages'),
  getByUserId: (userId) => api.get(`/messages/${userId}`),
  send: (data) => api.post('/messages', data),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  getUnreadCount: () => api.get('/messages/unread/count')
};

// API methods for conversations
export const conversationApi = {
  getAll: () => api.get('/conversations'),
  getById: (id) => api.get(`/conversations/${id}`),
  create: (data) => api.post('/conversations', data),
  getMessages: (id) => api.get(`/conversations/${id}/messages`),
  sendMessage: (id, data) => api.post(`/conversations/${id}/messages`, data),
  markAsRead: (id) => api.put(`/conversations/${id}/read`)
};

// API methods for resources
export const resourceApi = {
  getAll: () => api.get('/resources'),
  getById: (id) => api.get(`/resources/${id}`),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
  download: (id) => api.get(`/resources/${id}/download`)
};

// API methods for progress
export const progressApi = {
  getProgress: () => api.get('/progress'),
  updateProgress: (data) => api.put('/progress', data),
  getAchievements: () => api.get('/progress/achievements'),
  getGoals: () => api.get('/progress/goals')
};

export default api;
