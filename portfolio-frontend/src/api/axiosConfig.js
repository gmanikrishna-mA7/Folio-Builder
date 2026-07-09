import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://folio-backend-k6qf.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // To support sessions/cookies if needed for Google OAuth2
});

// Outbound request interceptor for appending JWT token
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

// Inbound response interceptor for catching auth errors (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && !currentPath.startsWith('/public/')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
