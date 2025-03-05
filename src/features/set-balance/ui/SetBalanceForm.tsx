import React, { useState } from "react";
import { Form, InputNumber, Button, Card, Typography, Alert, Space, Spin } from "antd";
import { WalletOutlined, SaveOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks/redux";
import { setInitialBalance } from "../model";

const { Title, Text, Paragraph } = Typography;

const SetBalanceForm: React.FC = () => {
	const [balance, setBalance] = useState<number | null>(null);
	const [localError, setLocalError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const dispatch = useAppDispatch();
	const { balance: currentBalance, loading, error } = useAppSelector((state) => state.balance);

	const handleSetBalance = async () => {
		if (balance === null) return;

		setLocalError(null);
		setSuccessMessage(null);

		try {
			const result = await dispatch(setInitialBalance(balance)).unwrap();

			setSuccessMessage(`Баланс успешно установлен!`);

			setBalance(null);

			form.resetFields();
		} catch (err: any) {
			console.error("Failed to set balance", err);

			setLocalError(err.message || "Не удалось установить баланс. Пожалуйста, попробуйте еще раз.");
		}
	};

	const displayError = localError || error;

	const [form] = Form.useForm();

	return (
		<Card className="shadow-md">
			<Spin spinning={loading}>
				<Space direction="vertical" size="large" className="w-full">
					<div className="text-center">
						<Title level={4}>Установите начальный баланс</Title>
						<Text type="secondary">Это необходимо для начала работы с приложением</Text>
					</div>

					{displayError && (
						<Alert
							message="Ошибка установки баланса"
							description={displayError}
							type="error"
							showIcon
							closable
							onClose={() => setLocalError(null)}
						/>
					)}

					{successMessage && (
						<Alert
							message="Успешно"
							description={successMessage}
							type="success"
							showIcon
							closable
							onClose={() => setSuccessMessage(null)}
						/>
					)}

					{currentBalance !== null && (
						<Alert
							message="Текущий баланс"
							description={`Ваш текущий баланс: ${currentBalance} ₽`}
							type="info"
							showIcon
						/>
					)}

					<Form layout="vertical" onFinish={handleSetBalance} form={form}>
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

					<Paragraph type="secondary" className="text-xs">
						Рекомендуемая сумма: 100-500 ₽. Это тестовое значение для демонстрации работы
						приложения.
					</Paragraph>
				</Space>
			</Spin>
		</Card>
	);
};

export default SetBalanceForm;
