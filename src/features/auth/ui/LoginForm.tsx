import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, Typography, Alert, Space, Divider } from 'antd';
import { UserOutlined, LoginOutlined, KeyOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { User } from '@/shared/types/common';
import { loginSuccess } from '@/entities/user/model/slice';
import { api } from '@/shared/api/base-api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Тестовые пользователи с данными из ТЗ
const TEST_USERS = [
  { id: '6', name: 'Тестовый пользователь', secretKey: '218dd27aebeccecae69ad8408d9a36bf' },
];

// Ключ для хранения ошибки в sessionStorage
const ERROR_STORAGE_KEY = 'login_error';

const LoginForm: React.FC = () => {
  const [userIdInput, setUserIdInput] = useState('');
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.user);

  // При монтировании компонента проверяем наличие ошибки в sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedError = sessionStorage.getItem(ERROR_STORAGE_KEY);
      if (savedError) {
        setAuthError(savedError);
      }
    }
  }, []);

  const handleLogin = async () => {
    try {
      // Очищаем предыдущую ошибку
      clearError();
      
      let userId: string;
      let secretKey: string;
      
      if (selectedUser) {
        // Если выбран пользователь из списка
        const user = TEST_USERS.find(u => u.id === selectedUser);
        if (!user) {
          throw new Error('Пользователь не найден');
        }
        userId = user.id;
        secretKey = user.secretKey;
      } else if (userIdInput && secretKeyInput) {
        // Если введены данные вручную
        userId = userIdInput;
        secretKey = secretKeyInput;
      } else {
        throw new Error('Введите User ID и Secret Key');
      }
      
      // Создаем объект пользователя
      const user: User = {
        userId,
        secretKey
      };
      
      // Устанавливаем пользователя в API клиент
      api.setUser(user);
      
      // Обновляем Redux состояние
      dispatch(loginSuccess(user));
      
      // Сохраняем пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Перенаправляем на dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login failed', err);
      const errorMessage = err?.message || 'Ошибка аутентификации. Пожалуйста, попробуйте ещё раз.';
      
      // Сохраняем ошибку в sessionStorage и в состоянии компонента
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ERROR_STORAGE_KEY, errorMessage);
      }
      setAuthError(errorMessage);
    }
  };

  // Функция для ручного скрытия ошибки
  const clearError = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ERROR_STORAGE_KEY);
    }
    setAuthError(null);
  };

  // Обработчик выбора пользователя из списка
  const handleUserSelect = (value: string) => {
    setSelectedUser(value);
    // При выборе из списка очищаем поля ручного ввода
    setUserIdInput('');
    setSecretKeyInput('');
  };

  return (
    <Card className="max-w-md w-full shadow-md">
      <Space direction="vertical" size="large" className="w-full">
        <div className="text-center">
          <Title level={3}>Вход в систему</Title>
          <Text type="secondary">Выберите тестового пользователя или введите данные вручную</Text>
        </div>

        {authError && (
          <Alert
            message="Ошибка аутентификации"
            description={authError}
            type="error"
            showIcon
            closable
            onClose={clearError}
          />
        )}

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item 
            label="Выберите тестового пользователя"
          >
            <Select
              placeholder="Выберите пользователя"
              onChange={handleUserSelect}
              allowClear
              value={selectedUser}
            >
              {TEST_USERS.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name} (ID: {user.id})
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Divider plain>или</Divider>
          
          <Form.Item
            label="User ID"
            rules={[{ required: !selectedUser, message: 'Пожалуйста, введите User ID' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Введите User ID"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              disabled={!!selectedUser}
            />
          </Form.Item>
          
          <Form.Item
            label="Secret Key"
            rules={[{ required: !selectedUser, message: 'Пожалуйста, введите Secret Key' }]}
          >
            <Input
              prefix={<KeyOutlined />}
              placeholder="Введите Secret Key"
              value={secretKeyInput}
              onChange={(e) => setSecretKeyInput(e.target.value)}
              disabled={!!selectedUser}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<LoginOutlined />}
              loading={loading}
              block
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
        
        <Paragraph type="secondary" className="text-center text-xs">
          Для тестирования используйте:<br/>
          User ID: 6<br/>
          Secret Key: 218dd27aebeccecae69ad8408d9a36bf
        </Paragraph>
      </Space>
    </Card>
  );
};

export default LoginForm;