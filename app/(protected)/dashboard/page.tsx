'use client';

import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Card, Alert } from 'antd';
import BalanceDisplay from '@/entities/balance/ui/BalanceDisplay';
import PlaceBetForm from '@/features/place-bet/ui/PlaceBetForm';
import GetWinResult from '@/features/place-bet/ui/GetWinResult';
import SetBalanceForm from '@/features/set-balance/ui/SetBalanceForm';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { getBalance } from '@/features/set-balance/model';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  // Добавляем состояние для отслеживания инициализации на клиенте
  const [isClient, setIsClient] = useState(false);
  const dispatch = useAppDispatch();
  const { balance, loading } = useAppSelector((state) => state.balance);
  const { currentBetId } = useAppSelector((state) => state.bet);
  
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
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Title level={2}>Загрузка...</Title>
        <p>Подождите, идёт загрузка данных...</p>
      </div>
    </div>;
  }
  
  // Если баланс не установлен, показываем форму для его установки
  if (balance === null) {
    return (
      <div className="max-w-2xl mx-auto">
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
    );
  }
  
  return (
    <div>
      <Title level={2} className="mb-8">
        Панель управления
      </Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <BalanceDisplay onRefresh={handleRefreshBalance} isRefreshing={loading} />
        </Col>
        
        <Col xs={24} md={16}>
          <Alert
            type="info"
            message="Как делать ставки"
            description="Выберите сумму ставки от 1 до 5 и нажмите кнопку 'Сделать ставку'. После размещения ставки вы сможете узнать результат, нажав на кнопку 'Узнать результат'."
            showIcon
            className="mb-4"
          />
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <PlaceBetForm />
        </Col>
        
        <Col xs={24} md={12}>
          {currentBetId ? (
            <GetWinResult />
          ) : (
            <Card className="shadow-md h-full">
              <div className="text-center py-8">
                <Title level={4}>Ожидание ставки</Title>
                <p className="text-gray-500">
                  Сделайте ставку, чтобы увидеть результат
                </p>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;