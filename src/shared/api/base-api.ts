// base-api.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import { User } from '@/shared/types/common';
import { getAuthHeaders } from './signature';

// Базовый URL API
const API_BASE_URL = '/api';
//const API_BASE_URL = 'https://bet-provider.coolify.tgapps.cloud';

// Пользовательские данные для аутентификации
let currentUser: User | null = null;

// Создание экземпляра axios с базовым URL
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Интерцептор запросов - добавляет заголовки аутентификации
axiosInstance.interceptors.request.use(
  (config) => {
    // Если пользователь авторизован, добавляем заголовки аутентификации
    if (currentUser) {
      const method = config.method?.toUpperCase() || 'GET';
      const url = config.url || '';
      
      // Для GET запросов используем пустой объект
      const body = method === 'GET' ? {} : config.data;
      
      // Получаем заголовки аутентификации с методом и URL
      const authHeaders = getAuthHeaders(currentUser, body, method, url);
      
      // Устанавливаем заголовки явно
      config.headers = {
        ...config.headers,
        'user-id': authHeaders['user-id'],
        'x-timestamp': authHeaders['x-timestamp'],
        'x-signature': authHeaders['x-signature']
      };
      
      console.log('Final request headers:', config.headers);
      console.log('Request body:', body);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Интерцептор ответов - обрабатывает ошибки
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error('Request error:', error);
      
      // Подробная информация об ошибке
      console.error('Error response status:', error.response.status);
      
      if (error.response.data) {
        console.error('Error response data:', error.response.data);
      }
      
      // Если ошибка связана с аутентификацией (401) или авторизацией (403)
      if (error.response.status === 401 || error.response.status === 403) {
        // Логика перенаправления на страницу входа, если это не страница входа
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          // Очищаем данные пользователя
          localStorage.removeItem('user');
          currentUser = null;
          
          // Перенаправляем на страницу входа
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Функция для проверки правильного формата user
const validateUser = (user: any): boolean => {
  return (
    user &&
    typeof user === 'object' &&
    typeof user.userId === 'string' &&
    typeof user.secretKey === 'string'
  );
};

// API обертка с типизацией
export const api = {
  /**
   * Устанавливает данные пользователя для аутентификации
   */
  setUser: (user: User): void => {
    if (!validateUser(user)) {
      console.error('Invalid user format. User must have userId and secretKey properties.');
      return;
    }
    
    currentUser = user;
    console.log('User set:', user);
  },
  
  /**
   * Очищает данные пользователя
   */
  clearUser: (): void => {
    currentUser = null;
    console.log('User cleared');
  },
  
  /**
   * Возвращает текущего пользователя
   */
  getUser: (): User | null => {
    return currentUser;
  },
  
  /**
   * Выполняет GET запрос
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(url, config);
  },
  
  /**
   * Выполняет POST запрос
   */
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, data, config);
  },
  
  /**
   * Выполняет PUT запрос
   */
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.put<T>(url, data, config);
  },
  
  /**
   * Выполняет DELETE запрос
   */
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete<T>(url, config);
  },
};