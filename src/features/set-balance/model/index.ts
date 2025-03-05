import { createAsyncThunk } from '@reduxjs/toolkit';
import { balanceApi } from '@/entities/balance/api';
import { 
  fetchBalanceStart, 
  fetchBalanceSuccess, 
  fetchBalanceFailure,
  setBalanceStart,
  setBalanceSuccess,
  setBalanceFailure,
  checkBalanceStart,
  checkBalanceSuccess,
  checkBalanceFailure,
  resetBalanceAnimation
} from '@/entities/balance/model/slice';


export const getBalance = createAsyncThunk(
  'balance/get',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchBalanceStart());
      
      const balance = await balanceApi.getBalance();
      
      dispatch(fetchBalanceSuccess(balance));

      setTimeout(() => {
        dispatch(resetBalanceAnimation());
      }, 1000);
      
      return balance;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to get balance';
      dispatch(fetchBalanceFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);


export const setInitialBalance = createAsyncThunk(
  'balance/set',
  async (balance: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setBalanceStart());
      
      const newBalance = await balanceApi.setBalance(balance);
      console.log(`Balance set successfully: ${newBalance}`);
      
      dispatch(setBalanceSuccess(newBalance));
      return newBalance;
    } catch (error: any) {
      console.error('Error setting balance:', error);
      const errorMessage = error.message || 'Failed to set balance';
      dispatch(setBalanceFailure(errorMessage));
      return rejectWithValue({
        message: errorMessage
      });
    }
  }
);

export const checkBalance = createAsyncThunk(
  'balance/check',
  async (expectedBalance: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(checkBalanceStart());
      
      const result = await balanceApi.checkBalance(expectedBalance);
      
      dispatch(checkBalanceSuccess({
        matched: result.matched,
        actualBalance: result.actualBalance,
        difference: result.difference,
      }));
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to check balance';
      dispatch(checkBalanceFailure(errorMessage));
      return rejectWithValue({
        message: errorMessage
      });
    }
  }
);