import { api } from "@/shared/api/base-api";
import { AuthRequest, AuthResponse, ApiResponse } from "@/shared/types/api";

export const authApi = {
	/**
	 * Авторизует пользователя по userId
	 * @param userId - идентификатор пользователя
	 * @returns Promise с данными пользователя
	 */
	login: async (userId: string): Promise<AuthResponse> => {
		const payload: AuthRequest = { userId };

		try {
			const response = await api.post<ApiResponse<AuthResponse>>("/auth", payload);

			if (!response.data.success) {
				throw new Error(response.data.error || "Ошибка аутентификации");
			}

			return response.data.data;
		} catch (error: any) {
			console.error("Auth API error:", error);

			if (error.response) {
				const status = error.response.status;
				const errorMessage = error.response.data?.error || "";

				if (status === 401) {
					throw new Error(
						`Неверные учетные данные. Пожалуйста, проверьте User ID. ${errorMessage}`,
					);
				} else if (status === 404) {
					throw new Error(`Пользователь не найден. ${errorMessage}`);
				} else if (status >= 500) {
					throw new Error(`Ошибка сервера. Пожалуйста, попробуйте позже. ${errorMessage}`);
				} else {
					throw new Error(`Ошибка аутентификации (${status}). ${errorMessage}`);
				}
			} else if (error.request) {
				throw new Error("Нет ответа от сервера. Проверьте подключение к интернету.");
			} else {
				throw new Error(`Ошибка при выполнении запроса: ${error.message || "Неизвестная ошибка"}`);
			}
		}
	},
};
