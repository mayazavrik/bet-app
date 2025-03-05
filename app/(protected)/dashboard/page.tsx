"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Card, Alert, Layout } from "antd";
import BalanceDisplay from "@/entities/balance/ui/BalanceDisplay";
import PlaceBetForm from "@/features/place-bet/ui/PlaceBetForm";
import GetWinResult from "@/features/place-bet/ui/GetWinResult";
import SetBalanceForm from "@/features/set-balance/ui/SetBalanceForm";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks/redux";
import { getBalance } from "@/features/set-balance/model";

const { Title } = Typography;
const { Content } = Layout;

const DashboardPage: React.FC = () => {
	const [isClient, setIsClient] = useState(false);
	const dispatch = useAppDispatch();
	const { balance, loading } = useAppSelector((state) => state.balance);
	const { currentBetId, winAnimation, loseAnimation } = useAppSelector((state) => state.bet);

	useEffect(() => {
		setIsClient(true);
		handleRefreshBalance();
	}, []);

	const handleRefreshBalance = () => {
		dispatch(getBalance());
	};

	if (!isClient) {
		return (
			<Content className="dashboard-container flex justify-center items-center min-h-screen">
				<div className="text-center">
					<Title level={2}>Загрузка...</Title>
					<p>Подождите, идёт загрузка данных...</p>
				</div>
			</Content>
		);
	}

	if (balance === null) {
		return (
			<Content className="dashboard-container">
				<div className="max-w-2xl mx-auto w-full">
					<Title level={2} className="mb-8 text-center">
						Добро пожаловать в Betting App
					</Title>

					<Alert
						type="info"
						message="Начальная настройка"
						description="Для начала работы с приложением, пожалуйста, установите начальный баланс."
						showIcon
						className="mb-8"
					/>

					<SetBalanceForm />
				</div>
			</Content>
		);
	}

	const showResultScreen = winAnimation || loseAnimation;

	return (
		<Content className="dashboard-container">
			<Title level={2} className="mb-4">
				Панель управления
			</Title>

			<Row gutter={[16, 16]} className="w-full">
				<Col xs={24} md={8}>
					<Card className="dashboard-card">
						<BalanceDisplay onRefresh={handleRefreshBalance} isRefreshing={loading} />
					</Card>
				</Col>

				<Col xs={24} md={16}>
					<Alert
						type="info"
						message="Как делать ставки"
						description="Выберите сумму ставки от 1 до 5 и нажмите кнопку 'Сделать ставку'. После размещения ставки вы сможете узнать результат, нажав на кнопку 'Узнать результат'."
						showIcon
						className="dashboard-card"
					/>
				</Col>
			</Row>

			<Row gutter={[16, 16]} className="mt-4 w-full">
				{showResultScreen ? (
					<Col xs={24}>
						<div className="dashboard-card">
							<GetWinResult />
						</div>
					</Col>
				) : (
					<>
						<Col xs={24} md={12}>
							<div className="dashboard-card">
								<PlaceBetForm />
							</div>
						</Col>

						<Col xs={24} md={12}>
							<div className="dashboard-card">
								{currentBetId ? (
									<GetWinResult />
								) : (
									<Card className="h-full border-0 shadow-none">
										<div className="text-center py-8">
											<Title level={4}>Ожидание ставки</Title>
											<p className="text-gray-500">Сделайте ставку, чтобы увидеть результат</p>
										</div>
									</Card>
								)}
							</div>
						</Col>
					</>
				)}
			</Row>
		</Content>
	);
};

export default DashboardPage;
