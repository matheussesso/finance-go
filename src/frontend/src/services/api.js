/**
 * @file api.js
 * @description Configures the Axios HTTP client used to communicate with the Go backend API.
 * Contains interceptors that automatically inject authentication tokens and language preferences.
 */

import axios from 'axios';

/**
 * Pre-configured Axios instance to point to our Go API.
 * Base URL is set to the local backend port.
 * @type {import('axios').AxiosInstance}
 */
export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Interceptor to inject the JWT Token into all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@FinanceGo:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Send language to backend
  const lang = localStorage.getItem('i18nextLng') || 'pt';
  config.headers['Accept-Language'] = lang;
  
  return config;
});
