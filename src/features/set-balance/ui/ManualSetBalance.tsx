import React, { useState } from 'react';
import { Form, InputNumber, Button, Card, Typography, Alert, Space, Spin } from 'antd';
import { WalletOutlined, SaveOutlined } from '@ant-design/icons';
import { api } from '@/shared/api/base-api';
import { BalanceResponse, ApiResponse } from '@/shared/types/api';

const { Title, Text, Paragraph } = Typography;

/**
 * Компонент для ручной установки баланса (для отладки)
 */
const ManualSetBalance: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);

  const handleSetBalance = async () => {
    if (balance === null) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResponse(null);
    
    try {
      // Прямой запрос к API для установки баланса
      const result = await api.post<ApiResponse<BalanceResponse>>(
        '/balance',
        { balance: balance }
      );
      
      setResponse(result.data);
      setSuccess(true);
      console.log('Balance set successfully:', result.data);
    } catch (err: any) {
      console.error('Failed to set balance:', err);
      setError(err.message || 'Не удалось установить баланс');
      if (err.response) {
        setResponse(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <Spin spinning={loading}>
        <Space direction="vertical" size="large" className="w-full">
          <div className="text-center">
            <Title level={4}>Ручная установка баланса (отладка)</Title>
            <Text type="secondary">
              Для тестирования API напрямую
            </Text>
          </div>

          {error && (
            <Alert
              message="Ошибка установки баланса"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}
          
          {success && (
            <Alert
              message="Баланс успешно установлен"
              description={`Новый баланс: ${response?.data?.balance || 'N/A'}`}
              type="success"
              showIcon
              closable
              onClose={() => setSuccess(false)}
            />
          )}

          <Form layout="vertical" onFinish={handleSetBalance}>
            <Form.Item
              label="Баланс"
              name="balance"
              rules={[
                { required: true, message: 'Пожалуйста, введите баланс' },
                {
                  type: 'number',
                  min: 1,
                  message: 'Баланс должен быть положительным числом',
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
          
          {response && (
            <div>
              <Paragraph strong>Ответ от сервера:</Paragraph>
              <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </Space>
      </Spin>
    </Card>
  );
};

export default ManualSetBalance;