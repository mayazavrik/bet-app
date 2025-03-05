import React from "react";
import { Card, Button, Alert, Result, Space, Typography, Spin } from "antd";
import { SearchOutlined, TrophyOutlined, FrownOutlined, ReloadOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks/redux";
import { getWinResult } from "@/features/place-bet/model";
import { clearCurrentBet } from "@/entities/bet/model/slice";

const { Text, Title } = Typography;

const GetWinResult = () => {
	const dispatch = useAppDispatch();
	const { currentBetId, currentBet, winAnimation, loseAnimation, loading } = useAppSelector(
		(state) => state.bet,
	);

	const handleGetResult = () => {
		if (currentBetId) {
			dispatch(getWinResult(currentBetId));
		}
	};

	const handleNewBet = () => {
		dispatch(clearCurrentBet());
	};

	if (winAnimation || loseAnimation) {
		const isWin = winAnimation;
		const resultAmount = isWin ? (currentBet ? currentBet * 2 : 0) : currentBet ? -currentBet : 0;

		return (
			<Card className="shadow-md">
				<Result
					icon={
						isWin ? (
							<TrophyOutlined style={{ color: "#52c41a", fontSize: 72 }} />
						) : (
							<FrownOutlined style={{ color: "#ff4d4f", fontSize: 72 }} />
						)
					}
					title={isWin ? "Поздравляем, вы выиграли!" : "К сожалению, вы проиграли"}
					subTitle={
						<Space direction="vertical" size="small">
							<Text>Ставка: {currentBet} ₽</Text>
							<Text
								style={{
									color: isWin ? "#52c41a" : "#ff4d4f",
									fontSize: "18px",
									fontWeight: "bold",
								}}
							>
								{isWin ? "Выигрыш: " : "Проигрыш: "}
								{isWin ? "+" : ""}
								{resultAmount} ₽
							</Text>
						</Space>
					}
					extra={
						<Button type="primary" size="large" icon={<ReloadOutlined />} onClick={handleNewBet}>
							Сделать новую ставку
						</Button>
					}
				/>
			</Card>
		);
	}

	if (currentBetId) {
		return (
			<Card className="shadow-md h-full">
				<Space direction="vertical" size="large" className="w-full">
					<Alert
						message="Ставка размещена"
						description={
							<div>
								<div className="mb-2">ID ставки: {currentBetId}</div>
								{currentBet && <div>Сумма ставки: {currentBet} ₽</div>}
							</div>
						}
						type="success"
						showIcon
					/>

					<Button
						type="primary"
						icon={<SearchOutlined />}
						onClick={handleGetResult}
						loading={loading}
						block
					>
						Узнать результат
					</Button>
				</Space>
			</Card>
		);
	}

	return (
		<Card className="shadow-md h-full">
			<div className="text-center py-8">
				<Title level={4}>Ожидание ставки</Title>
				<p className="text-gray-500">Сделайте ставку, чтобы увидеть результат</p>
			</div>
		</Card>
	);
};

export default GetWinResult;
