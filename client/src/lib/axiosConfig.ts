import axios from "axios";

// Set up Axios instance
const api = axios.create({
    baseURL: 'https://photo-challenge-practicum-1.onrender.com/api', // Backend API base URL
  });
  
  // Add an interceptor to include the token in all requests
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  export default api;
