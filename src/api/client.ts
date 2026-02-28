import axios from 'axios';
import { API_URL } from '../config';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling logic can be added here
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
