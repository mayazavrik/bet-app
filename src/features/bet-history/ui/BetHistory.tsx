import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Tooltip, 
  Empty 
} from 'antd';
import { 
  HistoryOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined, 
  DeleteOutlined, 
  FilterOutlined 
} from '@ant-design/icons';
import { useAppSelector } from '@/shared/lib/hooks/redux';
import { Bet, BetStatus } from '@/shared/types/common';

const { Title, Text } = Typography;

const BetHistory: React.FC = () => {
  const { bets } = useAppSelector((state) => state.bet);
  const [filters, setFilters] = useState({
    status: null as string | null,
    result: null as boolean | null,
  });

  // Функция для форматирования даты
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Функционал фильтрации
  const filteredBets = bets.filter(bet => {
    if (filters.status && bet.status !== filters.status) {
      return false;
    }
    if (filters.result !== null && 
        (bet.status !== BetStatus.COMPLETED || 
         bet.result?.win !== filters.result)) {
      return false;
    }
    return true;
  });

  // Сброс всех фильтров
  const clearFilters = () => {
    setFilters({
      status: null,
      result: null,
    });
  };

  // Фильтр только по статусу
  const filterByStatus = (status: string) => {
    setFilters({
      ...filters,
      status: filters.status === status ? null : status,
    });
  };

  // Фильтр только по результату
  const filterByResult = (result: boolean) => {
    setFilters({
      ...filters,
      result: filters.result === result ? null : result,
    });
  };

  // Определение столбцов таблицы
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text code>{text.substring(0, 8)}...</Text>,
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text strong>{amount} ₽</Text>,
      sorter: (a: Bet, b: Bet) => a.amount - b.amount,
    },
    {
      title: 'Дата',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => formatDate(timestamp),
      sorter: (a: Bet, b: Bet) => a.timestamp - b.timestamp,
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag 
          color={status === BetStatus.COMPLETED ? 'green' : 'blue'}
          icon={status === BetStatus.COMPLETED ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {status === BetStatus.COMPLETED ? 'Завершена' : 'В ожидании'}
        </Tag>
      ),
    },
    {
      title: 'Результат',
      key: 'result',
      render: (record: Bet) => {
        if (record.status !== BetStatus.COMPLETED || !record.result) {
          return <Text type="secondary">—</Text>;
        }
        
        return record.result.win ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Выигрыш +{record.result.amount} ₽
          </Tag>
        ) : (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            Проигрыш
          </Tag>
        );
      },
    },
  ];

  return (
    <Card 
      className="shadow-md"
      title={
        <div className="flex items-center">
          <HistoryOutlined className="mr-2" />
          <span>История ставок</span>
        </div>
      }
      extra={
        <Space>
          <Tooltip title="Фильтровать по статусу">
            <Button
              icon={<FilterOutlined />}
              type={filters.status ? 'primary' : 'default'}
              onClick={() => filterByStatus(BetStatus.COMPLETED)}
              size="small"
            >
              Завершенные
            </Button>
          </Tooltip>
          <Tooltip title="Фильтровать по выигрышам">
            <Button
              icon={<CheckCircleOutlined />}
              type={filters.result === true ? 'primary' : 'default'}
              onClick={() => filterByResult(true)}
              size="small"
            >
              Выигрыши
            </Button>
          </Tooltip>
          <Tooltip title="Фильтровать по проигрышам">
            <Button
              icon={<CloseCircleOutlined />}
              type={filters.result === false ? 'primary' : 'default'}
              onClick={() => filterByResult(false)}
              size="small"
            >
              Проигрыши
            </Button>
          </Tooltip>
          {(filters.status || filters.result !== null) && (
            <Tooltip title="Сбросить фильтры">
              <Button
                icon={<DeleteOutlined />}
                onClick={clearFilters}
                size="small"
                danger
              />
            </Tooltip>
          )}
        </Space>
      }
    >
      {bets.length > 0 ? (
        <Table
          dataSource={filteredBets}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      ) : (
        <Empty description="История ставок пуста" />
      )}
    </Card>
  );
};

export default BetHistory;