"use client";

import React, { useEffect, useState } from "react";
import { Layout, ConfigProvider, App as AntApp, theme, Spin, message } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "@/widgets/header/ui/Header";
import { store } from "@/shared/lib/store";
import { api } from "@/shared/api/base-api";
import { Theme, User } from "@/shared/types/common";

const { Content, Footer } = Layout;

const queryClient = new QueryClient();

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				setIsLoading(true);

				const savedUserData = localStorage.getItem("user");

				if (!savedUserData) {
					console.log("No user data found in localStorage");

					router.push("/login");
					return;
				}

				try {
					const user: User = JSON.parse(savedUserData);

					if (!user.userId || !user.secretKey) {
						console.error("Invalid user data: missing userId or secretKey");
						throw new Error("Invalid user data");
					}

					console.log("User data loaded from localStorage:", user);

					api.setUser(user);

					try {
						await api.post("/auth", { userId: user.userId });
						console.log("Authentication successful");
					} catch (authError) {
						console.error("Auth error:", authError);
					}

					try {
						await api.post("/balance", { amount: 200 });
						console.log("Balance set successfully");
					} catch (balanceError) {
						console.error("Balance error:", balanceError);
					}

					try {
						await api.get("/bet");
						console.log("Bet retrieved successfully");
					} catch (betError) {
						console.error("Bet error:", betError);
					}

					setIsLoading(false);
				} catch (parseError) {
					console.error("Failed to parse user data", parseError);

					localStorage.removeItem("user");
					api.clearUser();

					message.error("Ошибка авторизации. Пожалуйста, войдите снова.");
					router.push("/login");
				}
			} catch (error) {
				console.error("Authentication check failed", error);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, [router, pathname]);

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
		localStorage.setItem("theme", !isDarkMode ? Theme.DARK : Theme.LIGHT);
	};

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === Theme.DARK) {
			setIsDarkMode(true);
		}
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Spin size="large" tip="Проверка авторизации..." />
			</div>
		);
	}

	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<ConfigProvider
					theme={{
						algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
						token: {
							colorPrimary: "#1677ff",
						},
					}}
				>
					<AntApp>
						<Layout className="min-h-screen flex flex-col">
							<Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

							<Content className="flex-1 overflow-auto relative z-10 p-4 bg-white">
								<div className="dashboard-container">{children}</div>
							</Content>

							<Footer className="text-center relative z-10">
								Betting App ©{new Date().getFullYear()} - Тестовое приложение
							</Footer>
						</Layout>
					</AntApp>
				</ConfigProvider>
			</QueryClientProvider>
		</Provider>
	);
}
