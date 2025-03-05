"use client";

import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Card, Button, Statistic, Divider, Alert, Collapse } from "antd";
import {
	ReloadOutlined,
	QuestionCircleOutlined,
	WalletOutlined,
	BugOutlined,
} from "@ant-design/icons";
import BalanceDisplay from "@/entities/balance/ui/BalanceDisplay";
import CheckBalanceForm from "@/features/balance-check/ui/CheckBalanceForm";
import SetBalanceForm from "@/features/set-balance/ui/SetBalanceForm";
import ManualSetBalance from "@/features/set-balance/ui/ManualSetBalance";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks/redux";
import { getBalance } from "@/features/set-balance/model";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const BalancePage: React.FC = () => {
	// Добавляем состояние для отслеживания инициализации на клиенте
	const [isClient, setIsClient] = useState(false);
	const dispatch = useAppDispatch();
	const { balance, loading } = useAppSelector((state) => state.balance);
	const { bets } = useAppSelector((state) => state.bet);

	// Устанавливаем isClient в true при монтировании компонента
	useEffect(() => {
		setIsClient(true);
		handleRefreshBalance();
	}, []);

	const handleRefreshBalance = () => {
		dispatch(getBalance());
	};

	// Рендерим только после того, как компонент монтирован на клиенте
	if (!isClient) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Title level={2}>Загрузка...</Title>
					<p>Подождите, идёт загрузка данных...</p>
				</div>
			</div>
		);
	}

	const calculateExpectedBalance = (): number => {
		if (balance === null) return 0;

		let totalBets = 0;
		let totalWins = 0;

		bets.forEach((bet) => {
			if (bet.status === "completed" && bet.result) {
				totalBets += bet.amount;
				if (bet.result.win) {
					totalWins += bet.result.amount;
				}
			}
		});

		return balance + totalWins - totalBets;
	};

	const expectedBalance = calculateExpectedBalance();

	return (
		<div>
			<Title level={2} className="mb-8">
				Управление балансом
			</Title>

			<Alert
				type="info"
				message="Управление балансом"
				description="Здесь вы можете проверить свой текущий баланс, установить новый начальный баланс или сверить ожидаемый баланс с фактическим."
				showIcon
				className="mb-8"
			/>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={8}>
					<Card
						title={
							<div className="flex items-center">
								<WalletOutlined className="mr-2" />
								<span>Текущий баланс</span>
							</div>
						}
						extra={
							<Button
								icon={<ReloadOutlined />}
								onClick={handleRefreshBalance}
								loading={loading}
								type="text"
							/>
						}
						className="shadow-md"
					>
						<BalanceDisplay />

						<Divider />

						<div className="text-center">
							<Button type="primary" onClick={handleRefreshBalance} loading={loading}>
								Обновить баланс
							</Button>
						</div>
					</Card>
				</Col>

				<Col xs={24} lg={8}>
					<Card
						title={
							<div className="flex items-center">
								<QuestionCircleOutlined className="mr-2" />
								<span>Проверка баланса</span>
							</div>
						}
						className="shadow-md"
					>
						<Paragraph>
							Проверьте соответствие ожидаемого и фактического баланса на сервере.
						</Paragraph>

						<Statistic
							title="Ожидаемый баланс (на основе ваших ставок)"
							value={expectedBalance}
							precision={2}
							suffix="₽"
						/>

						<Divider />

						<CheckBalanceForm />
					</Card>
				</Col>

				<Col xs={24} lg={8}>
					<Card
						title={
							<div className="flex items-center">
								<WalletOutlined className="mr-2" />
								<span>Установка баланса</span>
							</div>
						}
						className="shadow-md"
					>
						<Alert
							type="warning"
							message="Внимание"
							description="Установка начального баланса сбросит весь прогресс ваших ставок."
							showIcon
							className="mb-4"
						/>

						<SetBalanceForm />
					</Card>
				</Col>
			</Row>

			{/* Отладочный раздел */}
			<Collapse className="mt-8">
				<Panel
					header={
						<div className="flex items-center">
							<BugOutlined className="mr-2" />
							<span>Отладка (для разработчиков)</span>
						</div>
					}
					key="1"
				>
					<Row gutter={[16, 16]}>
						<Col xs={24} md={12}>
							<ManualSetBalance />
						</Col>
						<Col xs={24} md={12}>
							<Card className="shadow-md">
								<Title level={5}>Информация о пользователе</Title>
								<pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
									{JSON.stringify(localStorage.getItem("user"), null, 2)}
								</pre>

								<Divider />

								<Title level={5}>Журнал запросов</Title>
								<p>Откройте консоль разработчика (F12) для просмотра деталей API-запросов.</p>
							</Card>
						</Col>
					</Row>
				</Panel>
			</Collapse>
		</div>
	);
};

export default BalancePage;
