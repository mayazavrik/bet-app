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


export const getRecommendedBet = createAsyncThunk(
  'bet/getRecommended',
  async (_, { dispatch }) => {
    try {
      dispatch(fetchRecommendedBetStart());
      
      const response = await betApi.getRecommendedBet();
      
     
      dispatch(fetchRecommendedBetSuccess(response));
      return response;
    } catch (error: any) {
      dispatch(fetchRecommendedBetFailure(error.message || 'Failed to get recommended bet'));
      throw error;
    }
  }
);


export const placeBet = createAsyncThunk(
  'bet/place',
  async (betData: { betId: string; option: string; amount: number }, { dispatch }) => {
    try {
      dispatch(placeBetStart());
      
    
      const result = await betApi.placeBet(betData);
      
     
      dispatch(placeBetSuccess({
        betId: result.bet?.id || betData.betId,
        amount: betData.amount
      }));
      

      if (typeof result.balance === 'number') {
        dispatch(updateBalanceAfterBet(result.balance));
      }
      
   
      setTimeout(() => {
        dispatch(resetBetAnimation());
      }, 1000);
      
      return result;
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
т      
   
      const win = !!result.win; // Преобразуем в булево
      const amount = typeof result.amount === 'number' ? result.amount : 0;
      const balance = typeof result.balance === 'number' ? result.balance : undefined;
      
      dispatch(fetchWinSuccess({ 
        betId, 
        win, 
        amount 
      }));
      
    
      if (balance !== undefined) {
        dispatch(updateBalanceAfterWin(balance));
      }
      
  
      setTimeout(() => {
        dispatch(resetWinAnimation());
        dispatch(resetLoseAnimation());
      }, 2000);
      
      return result;
    } catch (error: any) {
      dispatch(fetchWinFailure(error.message || 'Failed to get win result'));
      throw error;
    }
  }
);