import { api } from '@/shared/api/base-api';
import { 
  BalanceRequest, 
  BalanceResponse, 
  CheckBalanceRequest, 
  CheckBalanceResponse,
  ApiResponse
} from '@/shared/types/api';

/**
 * API сервис для работы с балансом
 */
export const balanceApi = {
  /**
   * Получает текущий баланс пользователя
   * @returns Promise с балансом пользователя
   */
  getBalance: async (): Promise<number> => {
    try {
      const response = await api.post<any>('/balance', {}); 
      
      console.log('Get balance response:', response);
      
      // API не возвращает стандартную структуру ApiResponse для баланса,
      // а возвращает просто { balance: number }
      if (response.data.balance !== undefined) {
        return response.data.balance;
      }
      
      throw new Error('Failed to get balance: Invalid response format');
    } catch (error: any) {
      console.error('Balance API error:', error);
      
      // Улучшенная обработка ошибок
      if (error.response) {
        if (error.response.data && error.response.data.balance !== undefined) {
          // Если в ответе есть баланс, вернем его даже при ошибке
          return error.response.data.balance;
        }
        const errorMessage = error.response.data?.error || 'Failed to get balance';
        throw new Error(errorMessage);
      }
      
      throw error;
    }
  },
  
  /**
   * Устанавливает начальный баланс пользователя
   * @param balance - начальный баланс
   * @returns Promise с установленным балансом
   */
  setBalance: async (balance: number): Promise<number> => {
    const payload: BalanceRequest = { amount: balance };
    
    try {
      console.log('Setting balance with payload:', payload);
      const response = await api.post<any>('/balance', payload);
      
      console.log('Balance response:', response.data);
      
      // Напрямую проверяем наличие баланса в ответе
      if (response.data && response.data.balance !== undefined) {
        return response.data.balance;
      }
      
      // Если получили ответ 200, но без данных о балансе, просто возвращаем запрошенный баланс
      if (response.status === 200) {
        return balance;
      }
      
      throw new Error('Failed to set balance: Invalid response format');
    } catch (error: any) {
      console.error('Balance API error:', error);
      
      // Если получили ответ с кодом 200, считаем операцию успешной
      if (error.response && error.response.status === 200) {
        if (error.response.data && error.response.data.balance !== undefined) {
          return error.response.data.balance;
        }
        // Если баланс не вернулся, возвращаем тот, что запрашивали
        return balance;
      }
      
      // Улучшенная обработка ошибок
      if (error.response) {
        console.error('Error response:', error.response.data);
        const errorMessage = error.response.data?.error || 'Failed to set balance';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response received from server. Please check your connection.');
      }
      
      throw error;
    }
  },
  
  /**
   * Проверяет соответствие ожидаемого и фактического баланса
   * @param expectedBalance - ожидаемый баланс
   * @returns Promise с результатом проверки
   */
  checkBalance: async (expectedBalance: number): Promise<CheckBalanceResponse> => {
    const payload: CheckBalanceRequest = { expectedBalance };
    
    try {
      const response = await api.post<ApiResponse<CheckBalanceResponse>>('/check-balance', payload);
      
      // Проверяем, есть ли в ответе ожидаемая структура
      if (response.data && (response.data.success !== undefined || response.data.data !== undefined)) {
        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to check balance');
        }
        return response.data.data;
      }
      
      // Проверяем другой возможный формат ответа
      if (response.data && response.data.matched !== undefined) {
        return response.data as unknown as CheckBalanceResponse;
      }
      
      throw new Error('Failed to check balance: Invalid response format');
    } catch (error: any) {
      console.error('Balance API error:', error);
      
      // Улучшенная обработка ошибок
      if (error.response) {
        const errorMessage = error.response.data?.error || 'Failed to check balance';
        throw new Error(errorMessage);
      }
      
      throw error;
    }
  }
};