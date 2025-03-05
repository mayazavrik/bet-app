import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Typography, Alert, Space, Tag, Tooltip } from 'antd';
import { DollarOutlined, ThunderboltOutlined, BulbOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { getRecommendedBet, placeBet } from '../model';
import { updateBalanceAfterBet } from '@/entities/balance/model/slice';
import { placeBetSuccess, resetBetAnimation } from '@/entities/bet/model/slice';

const { Title, Text, Paragraph } = Typography;

const PlaceBetForm: React.FC = () => {
  const [betAmount, setBetAmount] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  
  const { balance } = useAppSelector((state) => state.balance);
  const { 
    recommendedBet, 
    currentBetId,
    loading, 
    error,
    showBetAnimation
  } = useAppSelector((state) => state.bet);

  // Получаем рекомендуемую ставку при первом рендере
  useEffect(() => {
    handleGetRecommendedBet();
  }, []);

  const handleGetRecommendedBet = async () => {
    try {
      await dispatch(getRecommendedBet()).unwrap();
    } catch (err) {
      console.error('Failed to get recommended bet', err);
    }
  };

  // const handlePlaceBet = async () => {
  //   if (betAmount === null) return;
    
  //   try {
  //     // Формируем правильный объект с данными для ставки
  //     await dispatch(placeBet({
  //       betId: "bet-" + Date.now(), // Генерируем уникальный ID ставки
  //       option: "win", // Указываем опцию ставки
  //       amount: Number(betAmount) // Преобразуем в число
  //     })).unwrap();
      
  //     // Очищаем поле после успешной ставки
  //     setBetAmount(null);
  //   } catch (err) {
  //     console.error('Failed to place bet', err);
  //     // Показываем ошибку пользователю
  //   }
  // };
// Модифицируйте вашу функцию PlaceBetForm или компонент размещения ставки

const handlePlaceBet = async () => {
  if (!betAmount) return;

  try {
    // Вместо вызова API просто делаем локальное обновление UI
    const mockBetId = `bet-${Date.now()}`;
    
    // Обновляем состояние Redux напрямую
    dispatch(placeBetSuccess({
      betId: mockBetId,
      amount: Number(betAmount)
    }));
    
    // Обновляем баланс
    const newBalance = 200 - Number(betAmount); // Используем фиксированный баланс для теста
    dispatch(updateBalanceAfterBet(newBalance));
    
    // Сбрасываем анимацию через задержку
    setTimeout(() => {
      dispatch(resetBetAnimation());
    }, 1000);
    
    // Очищаем форму
    setBetAmount('');
    
    console.log('Ставка успешно размещена (мок)', {
      betId: mockBetId,
      amount: Number(betAmount)
    });
  } catch (error) {
    console.error('Ошибка размещения ставки', error);
  }
};
  const useRecommendedBet = () => {
    if (recommendedBet !== null) {
      setBetAmount(recommendedBet);
    }
  };

  // Определяем, достаточно ли средств для ставки
  const isBetAllowed = balance !== null && betAmount !== null && betAmount <= balance;
  
  // Определяем класс для анимации размещения ставки
  let betFormClassNames = 'transition-all duration-300';
  if (showBetAnimation) {
    betFormClassNames += ' animate-pulse bg-blue-50';
  }

  return (
    <Card className={`shadow-md ${betFormClassNames}`}>
      <Space direction="vertical" size="large" className="w-full">
        <div className="text-center">
          <Title level={4}>Сделать ставку</Title>
          <Text type="secondary">
            Размер ставки: от 1 до 5
          </Text>
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
              {recommendedBet ? recommendedBet.description : 'Нет рекомендаций'}
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
              { required: true, message: 'Пожалуйста, введите размер ставки' },
              {
                type: 'number',
                min: 1,
                max: 5,
                message: 'Ставка должна быть от 1 до 5',
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