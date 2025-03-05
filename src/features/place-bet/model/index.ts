import { createAsyncThunk } from '@reduxjs/toolkit';
import { betApi } from '@/entities/bet/api';
import {
  fetchRecommendedBetStart,
  fetchRecommendedBetSuccess,
  fetchRecommendedBetFailure,
  placeBetStart,
  placeBetSuccess,
  placeBetFailure,
  fetchWinStart,
  fetchWinSuccess,
  fetchWinFailure,
  resetBetAnimation,
  resetWinAnimation,
  resetLoseAnimation,
} from '@/entities/bet/model/slice';
import { updateBalanceAfterBet, updateBalanceAfterWin } from '@/entities/balance/model/slice';

/**
 * Асинхронное действие для получения рекомендуемой ставки
 */
export const getRecommendedBet = createAsyncThunk(
  'bet/getRecommended',
  async (_, { dispatch }) => {
    try {
      dispatch(fetchRecommendedBetStart());
      
      const response = await betApi.getRecommendedBet();
      
      // Извлекаем только recommendedAmount из ответа API
      const recommendedAmount = response.recommendedAmount;
      
      dispatch(fetchRecommendedBetSuccess(recommendedAmount));
      return recommendedAmount;
    } catch (error: any) {
      dispatch(fetchRecommendedBetFailure(error.message || 'Failed to get recommended bet'));
      throw error;
    }
  }
);




/**
 * Асинхронное действие для получения результата ставки
 */
// export const getWinResult = createAsyncThunk(
//   'bet/getWin',
//   async (betId: string, { dispatch }) => {
//     try {
//       dispatch(fetchWinStart());
      
//       const result = await betApi.getWin(betId);
      
//       dispatch(fetchWinSuccess({ 
//         betId, 
//         win: result.win, 
//         amount: result.amount 
//       }));
      
//       // Обновляем баланс
//       dispatch(updateBalanceAfterWin(result.balance));
      
//       // Сбрасываем анимации через небольшую задержку
//       setTimeout(() => {
//         dispatch(resetWinAnimation());
//         dispatch(resetLoseAnimation());
//       }, 2000);
      
//       return result;
//     } catch (error: any) {
//       dispatch(fetchWinFailure(error.message || 'Failed to get win result'));
//       throw error;
//     }
//   }
// );
// export const getWinResult = createAsyncThunk(
//   'bet/getWin',
//   async (betId: string, { dispatch }) => {
//     try {
//       dispatch(fetchWinStart());
      
//       const result = await betApi.getWin(betId);
//       console.log('Win result:', result); // Добавьте для отладки
      
//       // Проверяем наличие необходимых полей
//       const win = result.result === 'win' || result.win === true;
//       const amount = typeof result.amount === 'number' ? result.amount : 0;
//       const balance = typeof result.balance === 'number' ? result.balance : undefined;
      
//       dispatch(fetchWinSuccess({ 
//         betId, 
//         win, 
//         amount 
//       }));
      
//       if (result.balance === undefined) {
//         try {
//           const balanceResponse = await fetch('/api/balance');
//           const balanceData = await balanceResponse.json();
          
//           if (balanceData.balance !== undefined) {
//             dispatch(updateBalanceAfterWin(balanceData.balance));
//           }
//         } catch (balanceError) {
//           console.error('Failed to fetch balance:', balanceError);
//         }
//       } else {
//         dispatch(updateBalanceAfterWin(result.balance));
//       }
      
//       // Обновляем баланс только если он определен
//       if (balance !== undefined) {
//         dispatch(updateBalanceAfterWin(balance));
//       }
      
//       // Сбрасываем анимации через небольшую задержку
//       setTimeout(() => {
//         dispatch(resetWinAnimation());
//         dispatch(resetLoseAnimation());
//       }, 2000);
      
//       return result;
//     } catch (error: any) {
//       dispatch(fetchWinFailure(error.message || 'Failed to get win result'));
//       throw error;
//     }
//   }
// );
export const placeBet = createAsyncThunk(
  'bet/place',
  async (betAmount: number, { dispatch }) => {
    try {
      dispatch(placeBetStart());
      
      const betData = {
        betId: `bet-${Date.now()}`,
        option: 'win',
        amount: betAmount
      };
      
      // Вызов API (остается без изменений)
      const result = await betApi.placeBet(betData);
      console.log('API response:', result);
      
      // Используем только безопасные примитивные значения
      dispatch(placeBetSuccess({
        betId: result.bet?.id || `bet-${Date.now()}`,
        amount: typeof result.bet?.amount === 'number' 
          ? result.bet.amount 
          : betAmount
      }));
      
      // Сбрасываем анимацию
      setTimeout(() => {
        dispatch(resetBetAnimation());
      }, 1000);
      
      // Возвращаем безопасную версию результата
      return {
        ...result,
        // Убедимся, что bet содержит только примитивные значения
        bet: result.bet 
          ? {
              id: result.bet.id,
              amount: typeof result.bet.amount === 'number' 
                ? result.bet.amount 
                : betAmount,
              option: result.bet.option,
              timestamp: result.bet.timestamp
            }
          : null
      };
    } catch (error: any) {
      dispatch(placeBetFailure(error.message || 'Ошибка размещения ставки'));
      throw error;
    }
  }
);

export const getWinResult = createAsyncThunk(
  'bet/getWin',
  async (betId: string, { dispatch }) => {
    try {
      dispatch(fetchWinStart());
      
      const result = await betApi.getWin(betId);
      console.log('Win result:', result);
      
      // Преобразуем значения в безопасный формат
      const win = !!result.win; // Преобразуем в булево
      const amount = typeof result.amount === 'number' ? result.amount : 0;
      const balance = typeof result.balance === 'number' ? result.balance : undefined;
      
      dispatch(fetchWinSuccess({ 
        betId, 
        win, 
        amount 
      }));
      
      // Обновляем баланс, только если значение определено
      if (balance !== undefined) {
        dispatch(updateBalanceAfterWin(balance));
      }
      
      // Сбрасываем анимации
      setTimeout(() => {
        dispatch(resetWinAnimation());
        dispatch(resetLoseAnimation());
      }, 2000);
      
      // Возвращаем безопасный результат
      return {
        win,
        amount,
        balance,
        timestamp: result.timestamp
      };
    } catch (error: any) {
      dispatch(fetchWinFailure(error.message || 'Failed to get win result'));
      throw error;
    }
  }
);