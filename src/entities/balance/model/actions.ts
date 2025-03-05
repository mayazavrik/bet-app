import { createAsyncThunk } from "@reduxjs/toolkit";
import { balanceApi } from "@/entities/balance/api";

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
	updateBalanceAfterBet,
	updateBalanceAfterWin,
	resetBalanceAnimation,
} from "./slice";
import { message } from "antd";
import { betApi } from "@/entities/bet/api";

export const getBalance = createAsyncThunk(
	"balance/get",
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
			const errorMessage = error.message || "Не удалось получить баланс";
			dispatch(fetchBalanceFailure(errorMessage));
			return rejectWithValue(errorMessage);
		}
	},
);

export const setInitialBalance = createAsyncThunk(
	"balance/set",
	async (balance: number, { dispatch, rejectWithValue }) => {
		try {
			dispatch(setBalanceStart());

			const newBalance = await balanceApi.setBalance(balance);

			dispatch(setBalanceSuccess(newBalance));

			return newBalance;
		} catch (error: any) {
			console.error("Ошибка установки баланса:", error);
			const errorMessage = error.message || "Не удалось установить баланс";
			dispatch(setBalanceFailure(errorMessage));
			return rejectWithValue({
				message: errorMessage,
			});
		}
	},
);

export const checkBalance = createAsyncThunk(
	"balance/check",
	async (expectedBalance: number, { dispatch, rejectWithValue }) => {
		try {
			dispatch(checkBalanceStart());

			const result = await balanceApi.checkBalance(expectedBalance);

			dispatch(
				checkBalanceSuccess({
					matched: result.matched,
					actualBalance: result.actualBalance,
					difference: result.difference,
				}),
			);

			return result;
		} catch (error: any) {
			const errorMessage = error.message || "Не удалось проверить баланс";
			dispatch(checkBalanceFailure(errorMessage));
			return rejectWithValue({
				message: errorMessage,
			});
		}
	},
);
export const initializeBalance = createAsyncThunk(
	"balance/initialize",
	async (_, { rejectWithValue }) => {
		try {
			const response = await balanceApi.getBalance();
			return response;
		} catch (error) {
			return rejectWithValue(200); // Возвращаем дефолтный баланс в случае ошибки
		}
	},
);

export const placeBet = createAsyncThunk(
	"bet/place",
	async (betAmount: number, { dispatch, rejectWithValue, getState }) => {
		try {
			const currentBalance = (getState() as any).balance.balance;

			if (betAmount > currentBalance) {
				message.error("Недостаточно средств для ставки");
				return rejectWithValue("Недостаточно средств");
			}

			const betResult = await betApi.placeBet(betAmount);

			dispatch(updateBalanceAfterBet(currentBalance - betAmount));

			return betResult;
		} catch (error: any) {
			message.error("Не удалось разместить ставку");
			return rejectWithValue(error);
		}
	},
);

export const processBetResult = createAsyncThunk(
	"bet/processResult",
	async (betId: string, { dispatch, rejectWithValue }) => {
		try {
			const result = await betApi.getWin(betId);

			if (result.win) {
				dispatch(updateBalanceAfterWin(result.balance));
				message.success(`Поздравляем! Вы выиграли ${result.amount} ₽`);
			} else {
				message.warning("К сожалению, ставка проиграна");
			}

			return result;
		} catch (error: any) {
			message.error("Не удалось обработать результат ставки");
			return rejectWithValue(error);
		}
	},
);

export const getBetResult = createAsyncThunk(
	"bet/getResult",
	async (betId: string, { dispatch, rejectWithValue }) => {
		try {
			const result = await betApi.getWin(betId);

			if (result.win) {
				dispatch(updateBalanceAfterWin(result.balance));
				message.success(`Поздравляем! Вы выиграли ${result.amount} ₽`);
			} else {
				message.warning("К сожалению, ставка проиграна");
			}

			return result;
		} catch (error: any) {
			message.error("Не удалось получить результат ставки");
			return rejectWithValue(error);
		}
	},
);
