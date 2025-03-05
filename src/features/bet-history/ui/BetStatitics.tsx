import React, { useMemo } from 'react';
import { Card, Typography, Row, Col, Statistic, Divider, Empty } from 'antd';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip
} from 'recharts';
import { 
  RiseOutlined, 
  FallOutlined, 
  PercentageOutlined, 
  DollarOutlined,
  TrophyOutlined,
  StopOutlined
} from '@ant-design/icons';
import { useAppSelector } from '@/shared/lib/hooks/redux';
import { Bet, BetStatus } from '@/shared/types/common';

const { Title, Text } = Typography;

const BetStatistics: React.FC = () => {
  const { bets } = useAppSelector((state) => state.bet);
  
  // Вычисляем статистику
  const statistics = useMemo(() => {
    // Фильтруем только завершенные ставки
    const completedBets = bets.filter(
      (bet) => bet.status === BetStatus.COMPLETED && bet.result
    );
    
    if (completedBets.length === 0) {
      return null;
    }
    
    // Подсчитываем выигрыши/проигрыши
    const wins = completedBets.filter((bet) => bet.result?.win);
    const losses = completedBets.filter((bet) => bet.result && !bet.result.win);
    
    // Суммы выигрышей/проигрышей
    const totalWinAmount = wins.reduce(
      (sum, bet) => sum + (bet.result?.amount || 0), 
      0
    );
    const totalLossAmount = losses.reduce(
      (sum, bet) => sum + bet.amount, 
      0
    );
    
    // Вычисляем процент выигрышей
    const winRate = completedBets.length > 0 
      ? (wins.length / completedBets.length) * 100 
      : 0;
    
    return {
      totalBets: completedBets.length,
      wins: wins.length,
      losses: losses.length,
      winRate,
      totalWinAmount,
      totalLossAmount,
      netProfit: totalWinAmount - totalLossAmount,
    };
  }, [bets]);

  // Данные для круговой диаграммы
  const pieData = statistics ? [
    { name: 'Выигрыши', value: statistics.wins },
    { name: 'Проигрыши', value: statistics.losses },
  ] : [];

  // Цвета для диаграммы
  const COLORS = ['#52c41a', '#ff4d4f'];

  if (!statistics) {
    return (
      <Card className="shadow-md">
        <Empty description="Недостаточно данных для отображения статистики" />
      </Card>
    );
  }

  return (
    <Card 
      className="shadow-md"
      title={
        <div className="flex items-center">
          <TrophyOutlined className="mr-2" />
          <span>Статистика ставок</span>
        </div>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Statistic
            title="Всего ставок"
            value={statistics.totalBets}
            prefix={<DollarOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Statistic
            title="Процент выигрышей"
            value={statistics.winRate.toFixed(2)}
            precision={2}
            suffix="%"
            prefix={<PercentageOutlined />}
            valueStyle={{ color: statistics.winRate >= 50 ? '#52c41a' : '#ff4d4f' }}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Statistic
            title="Чистая прибыль"
            value={statistics.netProfit}
            precision={2}
            prefix={statistics.netProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
            suffix="₽"
            valueStyle={{ color: statistics.netProfit >= 0 ? '#52c41a' : '#ff4d4f' }}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Row>
            <Col span={12}>
              <Statistic
                title="Выигрыши"
                value={statistics.wins}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Проигрыши"
                value={statistics.losses}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <div className="text-center">
            <Title level={5}>Соотношение выигрышей и проигрышей</Title>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Финансовый результат">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Сумма выигрышей"
                  value={statistics.totalWinAmount}
                  precision={2}
                  suffix="₽"
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<RiseOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Сумма проигрышей"
                  value={statistics.totalLossAmount}
                  precision={2}
                  suffix="₽"
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<FallOutlined />}
                />
              </Col>
            </Row>
            <Divider />
            <Statistic
              title="Итоговый результат"
              value={statistics.netProfit}
              precision={2}
              suffix="₽"
              valueStyle={{ color: statistics.netProfit >= 0 ? '#52c41a' : '#ff4d4f' }}
              prefix={statistics.netProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default BetStatistics;