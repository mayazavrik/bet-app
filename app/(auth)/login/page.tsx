"use client";

import React, { useState, useEffect } from "react";
import { Typography, Spin } from "antd";
import LoginForm from "@/features/auth/ui/LoginForm";

const { Title } = Typography;

const LoginPage: React.FC = () => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(false);
	}, []);

	// Если идет загрузка, отображаем спиннер
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Spin size="large" tip="Загрузка..." />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
			<div className="text-center mb-8">
				<Title level={2}>Betting App</Title>
				<p className="text-gray-500">Система ставок с функцией проверки баланса</p>
			</div>

			<LoginForm />

			<div className="mt-8 text-center text-gray-400 text-sm">
				<p>Используйте тестовые аккаунты для входа или введите User ID</p>
			</div>
		</div>
	);
};

export default LoginPage;
