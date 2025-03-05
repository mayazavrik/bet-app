import HmacSHA512 from "crypto-js/hmac-sha512";
import { User } from "@/shared/types/common";

export const createSignature = (
	body: any,
	secretKey: string,
	method?: string,
	url?: string,
): string => {
	let payload = "";

	if (body === undefined || body === null) {
		payload = "{}";
	} else if (typeof body === "string") {
		payload = body;
	} else {
		try {
			payload = JSON.stringify(body);
		} catch (error) {
			console.error("Error stringifying body:", error);
			payload = "{}";
		}
	}

	let signatureData = payload;
	if (method && url) {
		const cleanUrl = url.replace(/^\/api\//, "/").replace(/\/+/g, "/");
		signatureData = `${method.toUpperCase()}:${cleanUrl}:${payload}`;
	}

	console.log("Signature payload:", signatureData);
	console.log("Signature secret key:", secretKey);

	const signature = HmacSHA512(signatureData, secretKey).toString();

	console.log("Generated signature:", signature);

	return signature;
};
/**
 * Возвращает заголовки с аутентификацией для запроса
 * @param user - данные пользователя
 * @param body - тело запроса
 * @param method - HTTP метод
 * @param url - URL запроса
 * @returns объект с заголовками
 */
export const getAuthHeaders = (
	user: User,
	body?: any,
	method?: string,
	url?: string,
): Record<string, string> => {
	const timestamp = Date.now().toString();

	const headers = {
		"user-id": user.userId,
		"x-timestamp": timestamp,
		"x-signature": createSignature(body, user.secretKey, method, url),
	};

	console.log("Auth headers:", headers);

	return headers;
};
