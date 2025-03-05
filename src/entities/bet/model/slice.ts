import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bet, BetStatus } from '@/shared/types/common';

interface BetState {
  recommendedBet: number | null;
  currentBet: number | null;
  currentBetId: string | null;
  bets: Bet[];
  loading: boolean;
  error: string | null;
  showBetAnimation: boolean;
  winAnimation: boolean;
  loseAnimation: boolean;
}

const initialState: BetState = {
  recommendedBet: null,
  currentBet: null,
  currentBetId: null,
  bets: [],
  loading: false,
  error: null,
  showBetAnimation: false,
  winAnimation: false,
  loseAnimation: false,
};

// Загружаем историю ставок из localStorage при инициализации
if (typeof window !== 'undefined') {
  const savedBets = localStorage.getItem('bets');
  if (savedBets) {
    try {
      initialState.bets = JSON.parse(savedBets);
    } catch (e) {
      console.error('Failed to parse bets from localStorage', e);
    }
  }
}

export const betSlice = createSlice({
  name: 'bet',
  initialState,
  reducers: {
    fetchRecommendedBetStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRecommendedBetSuccess: (state, action: PayloadAction<number>) => {
      state.recommendedBet = action.payload;
      state.loading = false;
    },
    fetchRecommendedBetFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentBet: (state, action: PayloadAction<number>) => {
      state.currentBet = action.payload;
    },
    placeBetStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    placeBetSuccess: (state, action: PayloadAction<{ betId: string; amount: number }>) => {
      state.currentBetId = action.payload.betId;
      state.loading = false;
      state.showBetAnimation = true;
      
      // Добавляем ставку в историю
      const newBet: Bet = {
        id: action.payload.betId,
        amount: action.payload.amount,
        timestamp: Date.now(),
        status: BetStatus.PENDING,
      };
      
      state.bets = [newBet, ...state.bets];
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('bets', JSON.stringify(state.bets));
      }
    },
    placeBetFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchWinStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchWinSuccess: (state, action: PayloadAction<{ 
      betId: string; 
      win: boolean; 
      amount: number 
    }>) => {
      state.loading = false;
      
      // Обновляем статус ставки в истории
      const betIndex = state.bets.findIndex(bet => bet.id === action.payload.betId);
      if (betIndex !== -1) {
        state.bets[betIndex] = {
          ...state.bets[betIndex],
          status: BetStatus.COMPLETED,
          result: {
            win: action.payload.win,
            amount: action.payload.amount,
            timestamp: Date.now(),
          },
        };
      }
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('bets', JSON.stringify(state.bets));
      }
      
      // Активируем анимацию выигрыша/проигрыша
      if (action.payload.win) {
        state.winAnimation = true;
      } else {
        state.loseAnimation = true;
      }
    },
    fetchWinFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetBetAnimation: (state) => {
      state.showBetAnimation = false;
    },
    resetWinAnimation: (state) => {
      state.winAnimation = false;
    },
    resetLoseAnimation: (state) => {
      state.loseAnimation = false;
    },
    clearCurrentBet: (state) => {
      state.currentBet = null;
      state.currentBetId = null;
    },
    clearBetError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchRecommendedBetStart,
  fetchRecommendedBetSuccess,
  fetchRecommendedBetFailure,
  setCurrentBet,
  placeBetStart,
  placeBetSuccess,
  placeBetFailure,
  fetchWinStart,
  fetchWinSuccess,
  fetchWinFailure,
  resetBetAnimation,
  resetWinAnimation,
  resetLoseAnimation,
  clearCurrentBet,
  clearBetError,
} = betSlice.actions;

export const betReducer = betSlice.reducer;