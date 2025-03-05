import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from '@/entities/user/model/slice';
import { balanceReducer } from '@/entities/balance/model/slice';
import { betReducer } from '@/entities/bet/model/slice';

export const rootReducer = combineReducers({
  user: userReducer,
  balance: balanceReducer,
  bet: betReducer,
});