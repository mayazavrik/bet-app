import React from 'react';
import { Button, Card, Typography, Alert, Space, Result, Spin } from 'antd';
import { 
  TrophyOutlined, 
  FrownOutlined, 
  ThunderboltOutlined 
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { getWinResult } from '../model';
import { clearCurrentBet } from '@/entities/bet/model/slice';

const { Title, Text, Paragraph } = Typography;

const GetWinResult: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const { 
    currentBetId, 
    bets, 
    loading, 
    error,
    winAnimation,
    loseAnimation
  } = useAppSelector((state) => state.bet);

  // Получаем текущую ставку из истории
  const currentBet = currentBetId 
    ? bets.find(bet => bet.id === currentBetId) 
    : null;

  const handleGetResult = async () => {
    if (!currentBetId) return;

    try {
      await dispatch(getWinResult(currentBetId)).unwrap();
    } catch (err) {
      console.error('Failed to get win result', err);
    }
  };

  const handleNewBet = () => {
    dispatch(clearCurrentBet());
  };

  // Если нет текущей ставки, не показываем компонент
  if (!currentBetId || !currentBet) {
    return null;
  }

  // Если уже получен результат
  if (currentBet.status === 'completed' && currentBet.result) {
    // Применяем анимации для выигрыша/проигрыша
    let resultClassNames = 'transition-all duration-500';
    
    if (winAnimation) {
      resultClassNames += ' animate-pulse bg-green-50';
    } else if (loseAnimation) {
      resultClassNames += ' animate-pulse bg-red-50';
    }
    
    return (
      <Card className={`shadow-md ${resultClassNames}`}>
        <Result
          status={currentBet.result.win ? 'success' : 'error'}
          title={
            currentBet.result.win 
              ? 'Поздравляем, вы выиграли!' 
              : 'К сожалению, вы проиграли'
          }
          icon={
            currentBet.result.win 
              ? <TrophyOutlined /> 
              : <FrownOutlined />
          }
          subTitle={
            <div className="text-center mt-4">
              <Paragraph>
                Ставка: <Text strong>{currentBet.amount} ₽</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>
                  {currentBet.result.win 
                    ? `Выигрыш: +${currentBet.result.amount} ₽` 
                    : `Проигрыш: -${currentBet.amount} ₽`
                  }
                </Text>
              </Paragraph>
            </div>
          }
          extra={[
            <Button
              key="new-bet"
              type="primary"
              onClick={handleNewBet}
            >
              Сделать новую ставку
            </Button>,
          ]}
        />
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <Space direction="vertical" size="large" className="w-full">
        <div className="text-center">
          <Title level={4}>Текущая ставка</Title>
          <Text type="secondary">
            Получите результат вашей ставки
          </Text>
        </div>

        {error && (
          <Alert
            message="Ошибка получения результата"
            description={error}
            type="error"
            showIcon
            closable
          />
        )}

        <div className="text-center">
          <Paragraph>
            ID ставки: <Text code>{currentBetId}</Text>
          </Paragraph>
          <Paragraph>
            Сумма ставки: <Text strong>{currentBet.amount} ₽</Text>
          </Paragraph>
        </div>

        <div className="flex justify-center">
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            loading={loading}
            onClick={handleGetResult}
            size="large"
          >
            Узнать результат
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default GetWinResult;