import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BalanceState {
	balance: number | null;
	expectedBalance: number | null;
	balanceDifference: number | null;
	isBalanceMatched: boolean | null;
	loading: boolean;
	error: string | null;
	showBalanceAnimation: boolean;
}

const initialState: BalanceState = {
	balance: null,
	expectedBalance: null,
	balanceDifference: null,
	isBalanceMatched: null,
	loading: false,
	error: null,
	showBalanceAnimation: false,
};

export const balanceSlice = createSlice({
	name: "balance",
	initialState,
	reducers: {
		fetchBalanceStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		fetchBalanceSuccess: (state, action: PayloadAction<number>) => {
			const previousBalance = state.balance;
			state.balance = action.payload;
			state.loading = false;

			if (previousBalance !== null && previousBalance !== action.payload) {
				state.showBalanceAnimation = true;
			}
		},
		fetchBalanceFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},
		setBalanceStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		setBalanceSuccess: (state, action: PayloadAction<number>) => {
			state.balance = action.payload;
			state.loading = false;
		},
		setBalanceFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},
		checkBalanceStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		checkBalanceSuccess: (
			state,
			action: PayloadAction<{
				matched: boolean;
				actualBalance: number;
				difference: number;
			}>,
		) => {
			state.isBalanceMatched = action.payload.matched;
			state.balance = action.payload.actualBalance;
			state.balanceDifference = action.payload.difference;
			state.loading = false;
		},
		checkBalanceFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},
		updateBalanceAfterBet: (state, action: PayloadAction<number>) => {
			const previousBalance = state.balance;
			state.balance = action.payload;

			if (previousBalance !== action.payload) {
				state.showBalanceAnimation = true;
			}
		},
		updateBalanceAfterWin: (state, action: PayloadAction<number>) => {
			const previousBalance = state.balance;
			state.balance = action.payload;

			if (previousBalance !== action.payload) {
				state.showBalanceAnimation = true;
			}
		},
		resetBalanceAnimation: (state) => {
			state.showBalanceAnimation = false;
		},
		resetBalance: (state) => {
			state.balance = null;
			state.expectedBalance = null;
			state.balanceDifference = null;
			state.isBalanceMatched = null;
		},
	},
});

export const {
	fetchBalanceStart,
	fetchBalanceSuccess,
	fetchBalanceFailure,
	setBalanceStart,
	setBalanceSuccess,
	setBalanceFailure,
	checkBalanceStart,
	checkBalanceSuccess,
	checkBalanceFailure,
	updateBalanceAfterBet,
	updateBalanceAfterWin,
	resetBalanceAnimation,
	resetBalance,
} = balanceSlice.actions;

export const balanceReducer = balanceSlice.reducer;
