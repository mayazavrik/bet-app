import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

import { User } from "@/shared/types/common";
import { getAuthHeaders } from "./signature";

const API_BASE_URL = "/api";

let currentUser: User | null = null;

export const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		if (currentUser) {
			const method = config.method?.toUpperCase() || "GET";
			const url = config.url || "";

			const body = method === "GET" ? {} : config.data;

			const authHeaders = getAuthHeaders(currentUser, body, method, url);

			config.headers = {
				...config.headers,
				"user-id": authHeaders["user-id"],
				"x-timestamp": authHeaders["x-timestamp"],
				"x-signature": authHeaders["x-signature"],
			};

			console.log("Final request headers:", config.headers);
			console.log("Request body:", body);
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(error: AxiosError) => {
		if (error.response) {
			console.error("Request error:", error);

			console.error("Error response status:", error.response.status);

			if (error.response.data) {
				console.error("Error response data:", error.response.data);
			}

			if (error.response.status === 401 || error.response.status === 403) {
				if (typeof window !== "undefined" && window.location.pathname !== "/login") {
					localStorage.removeItem("user");
					currentUser = null;

					window.location.href = "/login";
				}
			}
		}

		return Promise.reject(error);
	},
);

const validateUser = (user: any): boolean => {
	return (
		user &&
		typeof user === "object" &&
		typeof user.userId === "string" &&
		typeof user.secretKey === "string"
	);
};

export const api = {
	setUser: (user: User): void => {
		if (!validateUser(user)) {
			console.error("Invalid user format. User must have userId and secretKey properties.");
			return;
		}

		currentUser = user;
		console.log("User set:", user);
	},


	clearUser: (): void => {
		currentUser = null;
		console.log("User cleared");
	},


	getUser: (): User | null => {
		return currentUser;
	},


	get: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
		return axiosInstance.get<T>(url, config);
	},

	post: async <T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>> => {
		return axiosInstance.post<T>(url, data, config);
	},


	put: async <T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>> => {
		return axiosInstance.put<T>(url, data, config);
	},


	delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
		return axiosInstance.delete<T>(url, config);
	},
};
