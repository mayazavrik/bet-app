import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../api";
import { api } from "@/shared/api/base-api";
import { loginStart, loginSuccess, loginFailure, logout } from "@/entities/user/model/slice";
import { resetBalance } from "@/entities/balance/model/slice";
import { User } from "@/shared/types/common";

export const loginUser = createAsyncThunk(
	"auth/login",
	async (userId: string, { dispatch, rejectWithValue }) => {
		try {
			dispatch(loginStart());

			const userData = await authApi.login(userId);

			const user: User = {
				userId: userData.userId,
				secretKey: userData.secretKey,
			};

			api.setUser(user);

			dispatch(loginSuccess(user));

			return user;
		} catch (error: any) {
			const errorMessage =
				error.message || "Ошибка аутентификации. Пожалуйста, проверьте введенные данные.";
			dispatch(loginFailure(errorMessage));

			return rejectWithValue({
				message: errorMessage,
			});
		}
	},
);

/**
 * Действие для выхода из системы
 */
export const logoutUser = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
	// Очищаем пользователя в API клиенте
	api.setUser(null);

	// Обновляем состояние
	dispatch(logout());
	dispatch(resetBalance());

	return true;
});
