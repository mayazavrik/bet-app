import { api } from '@/shared/api/base-api';
import { 
  RecommendedBetResponse, 
  PlaceBetRequest, 
  PlaceBetResponse, 
  WinRequest, 
  WinResponse,
  ApiResponse
} from '@/shared/types/api';

/**
 * API сервис для работы со ставками
 */
// export const betApi = {
//   /**
//    * Получает рекомендуемую ставку
//    * @returns Promise с рекомендуемой ставкой
//    */
//   getRecommendedBet: async (): Promise<number> => {
//     try {
//       const response = await api.get<ApiResponse<RecommendedBetResponse>>('/bet');
      
//       if (!response.data.success) {
//         throw new Error(response.data.error || 'Failed to get recommended bet');
//       }
      
//       return response.data.data.recommendedBet;
//     } catch (error) {
//       console.error('Bet API error:', error);
//       throw error;
//     }
//   },
  
//   /**
//    * Размещает ставку
//    * @param bet - сумма ставки
//    * @returns Promise с идентификатором ставки и обновленным балансом
//    */
//   placeBet: async (bet: number): Promise<PlaceBetResponse> => {
//     const payload: PlaceBetRequest = { bet };
    
//     try {
//       const response = await api.post<ApiResponse<PlaceBetResponse>>('/bet', payload);
      
//       if (!response.data.success) {
//         throw new Error(response.data.error || 'Failed to place bet');
//       }
      
//       return response.data.data;
//     } catch (error) {
//       console.error('Bet API error:', error);
//       throw error;
//     }
//   },
  
//   /**
//    * Получает результат ставки
//    * @param betId - идентификатор ставки
//    * @returns Promise с результатом ставки и обновленным балансом
//    */
//   getWin: async (betId: string): Promise<WinResponse> => {
//     const payload: WinRequest = { betId };
    
//     try {
//       const response = await api.post<ApiResponse<WinResponse>>('/win', payload);
      
//       if (!response.data.success) {
//         throw new Error(response.data.error || 'Failed to get win result');
//       }
      
//       return response.data.data;
//     } catch (error) {
//       console.error('Bet API error:', error);
//       throw error;
//     }
//   }
// };
import HmacSHA512 from 'crypto-js/hmac-sha512';

const userId = '6'; // Используем фиксированный ID пользователя из route.js
const secretKey = '218dd27aebeccecae69ad8408d9a36bf'; // Секретный ключ пользователя

// Функция для формирования заголовков с подписью
const getAuthHeaders = (method, path, body = {}) => {
  const timestamp = Date.now().toString();
  const payload = `${method}:${path}:${JSON.stringify(body)}`;
  const signature = HmacSHA512(payload, secretKey).toString();
  
  return {
    'user-id': userId,
    'x-timestamp': timestamp,
    'x-signature': signature,
    'Content-Type': 'application/json'
  };
};

export const betApi = {
  getRecommendedBet: async () => {
    try {
      const response = await fetch('/api/recommended-bet', {
        method: 'GET',
        headers: getAuthHeaders('GET', '/api/recommended-bet')
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении рекомендуемой ставки:', error);
      throw error;
    }
  },
  
  placeBet: async (betAmount) => {
    try {
      // Формируем правильный объект запроса для размещения ставки
      const betData = {
        betId: `bet-${Date.now()}`, // Генерируем ID ставки
        option: 'win', // Фиксированная опция для примера
        amount: betAmount // Сумма ставки
      };
      
      const response = await fetch('/api/bet', {
        method: 'POST',
        headers: getAuthHeaders('POST', '/api/bet', betData),
        body: JSON.stringify(betData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Ошибка: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при размещении ставки:', error);
      throw error;
    }
  },
  
  getWin: async (betId) => {
    try {
      const response = await fetch(`/api/win?betId=${betId}`, {
        method: 'GET',
        headers: getAuthHeaders('GET', `/api/win?betId=${betId}`)
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении результата ставки:', error);
      throw error;
    }
  }
};