import axios from 'axios';

// Instância do Axios pré-configurada para apontar para nossa API Go
export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Interceptor para injetar o Token JWT em todas as requisições
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
