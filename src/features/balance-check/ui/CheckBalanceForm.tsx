import React, { useState } from "react";
import { Form, InputNumber, Button, Card, Typography, Alert, Space } from "antd";
import { WalletOutlined, SaveOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks/redux";
import { setInitialBalance } from "@/features/set-balance/model";

const { Title, Text } = Typography;

const SetBalanceForm: React.FC = () => {
	const [balance, setBalance] = useState<number | null>(null);
	const dispatch = useAppDispatch();
	const { loading, error } = useAppSelector((state) => state.balance);

	const handleSetBalance = async () => {
		if (balance === null) return;

		try {
			await dispatch(setInitialBalance(balance)).unwrap();
		} catch (err) {
			console.error("Failed to set balance", err);
		}
	};

	return (
		<Card className="shadow-md">
			<Space direction="vertical" size="large" className="w-full">
				<div className="text-center">
					<Title level={4}>Установите начальный баланс</Title>
					<Text type="secondary">Это необходимо для начала работы с приложением</Text>
				</div>

				{error && (
					<Alert
						message="Ошибка установки баланса"
						description={error}
						type="error"
						showIcon
						closable
					/>
				)}

				<Form layout="vertical" onFinish={handleSetBalance}>
					<Form.Item
						label="Начальный баланс"
						name="balance"
						rules={[
							{ required: true, message: "Пожалуйста, введите начальный баланс" },
							{
								type: "number",
								min: 1,
								message: "Баланс должен быть положительным числом",
							},
						]}
					>
						<InputNumber
							prefix={<WalletOutlined />}
							placeholder="Введите сумму"
							min={1}
							step={10}
							className="w-full"
							onChange={(value) => setBalance(value as number)}
							precision={2}
							addonAfter="₽"
						/>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							icon={<SaveOutlined />}
							loading={loading}
							disabled={balance === null}
							block
						>
							Установить баланс
						</Button>
					</Form.Item>
				</Form>
			</Space>
		</Card>
	);
};

export default SetBalanceForm;
