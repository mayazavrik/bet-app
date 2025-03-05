import React, { useState, useEffect } from "react";
import { Form, InputNumber, Button, Card, Typography, Alert, Space, Tag, Tooltip } from "antd";
import {
	DollarOutlined,
	ThunderboltOutlined,
	BulbOutlined,
	ReloadOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks/redux";
import { getRecommendedBet, placeBet } from "../model";

const { Title, Text, Paragraph } = Typography;

const PlaceBetForm: React.FC = () => {
	const [betAmount, setBetAmount] = useState<number | null>(null);
	const dispatch = useAppDispatch();

	const { balance } = useAppSelector((state) => state.balance);
	const { recommendedBet, currentBetId, loading, error, showBetAnimation } = useAppSelector(
		(state) => state.bet,
	);

	useEffect(() => {
		handleGetRecommendedBet();
	}, []);

	const handleGetRecommendedBet = async () => {
		try {
			await dispatch(getRecommendedBet()).unwrap();
		} catch (err) {
			console.error("Failed to get recommended bet", err);
		}
	};

	const handlePlaceBet = async () => {
		if (!betAmount) return;

		try {
			const mockBetId = `bet-${Date.now()}`;

			const betData = {
				betId: mockBetId,
				option: "win",
				amount: Number(betAmount),
			};

			await dispatch(placeBet(betData)).unwrap();

			setBetAmount(null);
		} catch (error) {
			console.error("Ошибка размещения ставки", error);
		}
	};

	const useRecommendedBet = () => {
		if (recommendedBet && recommendedBet.recommendedAmount) {
			setBetAmount(recommendedBet.recommendedAmount);
		}
	};

	const isBetAllowed = balance !== null && betAmount !== null && betAmount <= balance;

	let betFormClassNames = "transition-all duration-300";
	if (showBetAnimation) {
		betFormClassNames += " animate-pulse bg-blue-50";
	}

	return (
		<Card className={`shadow-md ${betFormClassNames}`}>
			<Space direction="vertical" size="large" className="w-full">
				<div className="text-center">
					<Title level={4}>Сделать ставку</Title>
					<Text type="secondary">Размер ставки: от 1 до 5</Text>
				</div>

				{error && (
					<Alert
						message="Ошибка размещения ставки"
						description={error}
						type="error"
						showIcon
						closable
					/>
				)}

				<div className="flex items-center justify-between">
					<Paragraph>Рекомендуемая ставка:</Paragraph>
					{recommendedBet !== null ? (
						<div className="flex items-center gap-2">
							<Tag color="blue" className="text-lg px-3 py-1">
								{recommendedBet.description} ({recommendedBet.recommendedAmount}₽)
							</Tag>
							<Tooltip title="Использовать рекомендуемую ставку">
								<Button
									type="link"
									icon={<BulbOutlined />}
									onClick={useRecommendedBet}
									size="small"
								/>
							</Tooltip>
							<Tooltip title="Обновить рекомендацию">
								<Button
									type="link"
									icon={<ReloadOutlined />}
									onClick={handleGetRecommendedBet}
									size="small"
									loading={loading && betAmount === null}
								/>
							</Tooltip>
						</div>
					) : (
						<Button
							type="link"
							icon={<ReloadOutlined />}
							onClick={handleGetRecommendedBet}
							loading={loading && betAmount === null}
						>
							Получить рекомендацию
						</Button>
					)}
				</div>

				<Form layout="vertical" onFinish={handlePlaceBet}>
					<Form.Item
						label="Размер ставки"
						name="betAmount"
						rules={[
							{ required: true, message: "Пожалуйста, введите размер ставки" },
							{
								type: "number",
								min: 1,
								max: 5,
								message: "Ставка должна быть от 1 до 5",
							},
						]}
					>
						<InputNumber
							prefix={<DollarOutlined />}
							placeholder="От 1 до 5"
							min={1}
							max={5}
							className="w-full"
							value={betAmount}
							onChange={(value) => setBetAmount(value as number)}
							addonAfter="₽"
						/>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							icon={<ThunderboltOutlined />}
							loading={loading && betAmount !== null}
							disabled={!isBetAllowed || loading}
							block
						>
							Сделать ставку
						</Button>
					</Form.Item>
				</Form>

				{balance !== null && betAmount !== null && betAmount > balance && (
					<Alert
						message="Недостаточно средств"
						description={`Для ставки требуется ${betAmount}₽, но доступно только ${balance}₽`}
						type="warning"
						showIcon
					/>
				)}

				{currentBetId && (
					<Alert
						message="Ставка размещена"
						description={`ID ставки: ${currentBetId}`}
						type="success"
						showIcon
					/>
				)}
			</Space>
		</Card>
	);
};

export default PlaceBetForm;
