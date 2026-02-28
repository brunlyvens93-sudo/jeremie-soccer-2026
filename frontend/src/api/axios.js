import axios from 'axios';

// UTILISER L'URL DE PRODUCTION SUR RENDER
const API_URL = 'https://jeremie-soccer-2026.onrender.com/api';

console.log('🌐 API URL utilisée:', API_URL); // Pour vérifier

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Requête vers:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;