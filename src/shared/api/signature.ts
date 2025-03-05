
import HmacSHA512 from 'crypto-js/hmac-sha512';
import { User } from '@/shared/types/common';

// /**
//  * Создает HMAC SHA-512 подпись для запроса
//  * @param body - тело запроса
//  * @param secretKey - секретный ключ пользователя
//  * @param method - HTTP метод (GET, POST, etc.)
//  * @param url - URL запроса
//  * @returns hex-строка с подписью
//  */

// export const createSignature = (
//   body: any,
//   secretKey: string,
//   method?: string,
//   url?: string
// ): string => {
//   let payload = '';
  
//   if (body === undefined || body === null) {
//     payload = '{}'; // Пустой объект для отсутствующего тела
//   } else if (typeof body === 'string') {
//     payload = body;
//   } else {
//     try {
//       payload = JSON.stringify(body);
//     } catch (error) {
//       console.error('Error stringifying body:', error);
//       payload = '{}';
//     }
//   }
  
//   // Формируем данные для подписи
//   let signatureData = payload;
//   if (method && url) {
//     signatureData = `${method.toUpperCase()}:${url}:${payload}`;
//   }
  
//   console.log('Signature payload:', signatureData);
//   console.log('Signature secret key:', secretKey);
  
//   // Создаем HMAC SHA-512 подпись
//   const signature = HmacSHA512(signatureData, secretKey).toString();
  
//   console.log('Generated signature:', signature);
  
//   return signature;
// };


// /**
//  * Возвращает заголовки с аутентификацией для запроса
//  * @param user - данные пользователя
//  * @param body - тело запроса
//  * @param method - HTTP метод
//  * @param url - URL запроса
//  * @returns объект с заголовками
//  */
// export const getAuthHeaders = (
//   user: User,
//   body?: any,
//   method?: string,
//   url?: string
// ): Record<string, string> => {
//   const timestamp = Date.now().toString();
  
//   // Формируем заголовки согласно документации API
//   const headers = {
//     'user-id': user.userId,
//     'x-timestamp': timestamp,
//     'x-signature': createSignature(body, user.secretKey, method, url),
//   };
  
//   console.log('Auth headers:', headers);
  
//   return headers;
// };
export const createSignature = (
  body: any,
  secretKey: string,
  method?: string,
  url?: string
): string => {
  let payload = '';
  
  if (body === undefined || body === null) {
    payload = '{}'; // Пустой объект для отсутствующего тела
  } else if (typeof body === 'string') {
    payload = body;
  } else {
    try {
      payload = JSON.stringify(body);
    } catch (error) {
      console.error('Error stringifying body:', error);
      payload = '{}';
    }
  }
  
  // Формируем данные для подписи
  let signatureData = payload;
  if (method && url) {
    // Исправление: удаляем префикс /api и нормализуем путь
    const cleanUrl = url.replace(/^\/api\//, '/').replace(/\/+/g, '/');
    signatureData = `${method.toUpperCase()}:${cleanUrl}:${payload}`;
  }
  
  console.log('Signature payload:', signatureData);
  console.log('Signature secret key:', secretKey);
  
  // Создаем HMAC SHA-512 подпись
  const signature = HmacSHA512(signatureData, secretKey).toString();
  
  console.log('Generated signature:', signature);
  
  return signature;
};
/**
 * Возвращает заголовки с аутентификацией для запроса
 * @param user - данные пользователя
 * @param body - тело запроса
 * @param method - HTTP метод
 * @param url - URL запроса
 * @returns объект с заголовками
 */
export const getAuthHeaders = (
  user: User,
  body?: any,
  method?: string,
  url?: string
): Record<string, string> => {
  const timestamp = Date.now().toString();
  
  // Формируем заголовки согласно документации API
  const headers = {
    'user-id': user.userId,
    'x-timestamp': timestamp,
    'x-signature': createSignature(body, user.secretKey, method, url),
  };
  
  console.log('Auth headers:', headers);
  
  return headers;
};