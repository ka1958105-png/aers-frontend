import axios from 'axios';

const api = axios.create({
  baseURL: '', // Uses Vite proxy to forward /api to http://localhost:8080
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agrirent_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('agrirent_token');
        localStorage.removeItem('agrirent_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
