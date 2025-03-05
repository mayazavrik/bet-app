'use client';

import React, { useMemo } from 'react';
import { Typography, Row, Col, Card, Empty, Divider, Statistic } from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  RiseOutlined, 
  FallOutlined, 
  AreaChartOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAppSelector } from '@/shared/lib/hooks/redux';
import { Bet, BetStatus } from '@/shared/types/common';

const { Title, Paragraph } = Typography;

const StatisticsPage: React.FC = () => {
  const { bets } = useAppSelector((state) => state.bet);
  
  // Подготавливаем данные для графиков
  const chartsData = useMemo(() => {
    if (bets.length === 0) {
      return null;
    }
    
    // Фильтруем только завершенные ставки
    const completedBets = bets
      .filter((bet) => bet.status === BetStatus.COMPLETED && bet.result)
      .sort((a, b) => a.timestamp - b.timestamp);
    
    if (completedBets.length === 0) {
      return null;
    }
    
    // Данные для графика баланса
    let currentBalance = 0;
    const balanceHistory = completedBets.map((bet) => {
      const amount = bet.result?.win ? bet.result.amount : -bet.amount;
      currentBalance += amount;
      
      return {
        time: new Date(bet.timestamp).toLocaleString(),
        balance: currentBalance,
        bet: bet.amount,
        result: bet.result?.win ? 'Выигрыш' : 'Проигрыш',
        amount,
      };
    });
    
    // Статистика выигрышей/проигрышей по дням
    const dailyStats: Record<string, { date: string; wins: number; losses: number; netProfit: number }> = {};
    
    completedBets.forEach((bet) => {
      const date = new Date(bet.timestamp).toLocaleDateString();
      
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          wins: 0,
          losses: 0,
          netProfit: 0,
        };
      }
      
      if (bet.result?.win) {
        dailyStats[date].wins += 1;
        dailyStats[date].netProfit += bet.result.amount;
      } else {
        dailyStats[date].losses += 1;
        dailyStats[date].netProfit -= bet.amount;
      }
    });
    
    const dailyData = Object.values(dailyStats);
    
    return {
      balanceHistory,
      dailyData,
    };
  }, [bets]);
  
  // Если нет данных для отображения
  if (!chartsData || chartsData.balanceHistory.length === 0) {
    return (
      <div>
        <Title level={2} className="mb-8">
          Статистика и аналитика
        </Title>
        
        <Empty 
          description="Недостаточно данных для отображения статистики. Сделайте несколько ставок, чтобы увидеть аналитику."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }
  
  // Извлекаем последнее значение баланса
  const currentBalance = chartsData.balanceHistory[chartsData.balanceHistory.length - 1].balance;
  
  return (
    <div>
      <Title level={2} className="mb-8">
        Статистика и аналитика
      </Title>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={
              <div className="flex items-center">
                <AreaChartOutlined className="mr-2" />
                <span>Динамика баланса</span>
              </div>
            }
            className="shadow-md"
          >
            <Paragraph>
              График показывает изменение вашего баланса после каждой ставки.
            </Paragraph>
            
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <LineChart
                  data={chartsData.balanceHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${Number(value).toFixed(2)} ₽`, 
                      name === 'balance' ? 'Баланс' : 'Изменение'
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#1677ff"
                    name="Баланс"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#52c41a"
                    name="Изменение"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Текущий баланс"
                  value={currentBalance}
                  precision={2}
                  suffix="₽"
                  valueStyle={{ color: currentBalance >= 0 ? '#52c41a' : '#ff4d4f' }}
                  prefix={currentBalance >= 0 ? <RiseOutlined /> : <FallOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Всего ставок"
                  value={chartsData.balanceHistory.length}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Средний выигрыш/проигрыш"
                  value={currentBalance / chartsData.balanceHistory.length}
                  precision={2}
                  suffix="₽"
                  valueStyle={{ color: currentBalance >= 0 ? '#52c41a' : '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col span={24}>
          <Card 
            title={
              <div className="flex items-center">
                <BarChartOutlined className="mr-2" />
                <span>Статистика по дням</span>
              </div>
            }
            className="shadow-md"
          >
            <Paragraph>
              График показывает количество выигрышей и проигрышей по дням.
            </Paragraph>
            
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart
                  data={chartsData.dailyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="wins"
                    name="Выигрыши"
                    fill="#52c41a"
                  />
                  <Bar
                    dataKey="losses"
                    name="Проигрыши"
                    fill="#ff4d4f"
                  />
                  <Bar
                    dataKey="netProfit"
                    name="Чистая прибыль"
                    fill="#1677ff"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;