'use client';

import React, { useEffect, useState } from 'react';
import { Layout, ConfigProvider, App as AntApp, theme, Spin, message } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from '@/widgets/header/ui/Header';
import { store } from '@/shared/lib/store';
import { api } from '@/shared/api/base-api';
import { Theme, User } from '@/shared/types/common';

const { Content, Footer } = Layout;

// Создаем клиент для React Query
const queryClient = new QueryClient();

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Проверяем авторизацию пользователя
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Получаем пользователя из localStorage
        const savedUserData = localStorage.getItem('user');
        
        if (!savedUserData) {
          console.log('No user data found in localStorage');
          // Если пользователь не найден, перенаправляем на страницу логина
          router.push('/login');
          return;
        }
        
        try {
          // Парсим данные пользователя
          const user: User = JSON.parse(savedUserData);
          
          // Проверка наличия необходимых полей
          if (!user.userId || !user.secretKey) {
            console.error('Invalid user data: missing userId or secretKey');
            throw new Error('Invalid user data');
          }
          
          console.log('User data loaded from localStorage:', user);
          
          // Устанавливаем пользователя в API клиент
          api.setUser(user);
          
          // Оборачиваем каждый запрос в отдельный try-catch блок
          try {
            await api.post('/auth', { userId: user.userId });
            console.log('Authentication successful');
          } catch (authError) {
            console.error('Auth error:', authError);
            // Продолжаем выполнение даже при ошибке аутентификации (для разработки)
          }
          
          try {
            await api.post('/balance', { amount: 200 });
            console.log('Balance set successfully');
          } catch (balanceError) {
            console.error('Balance error:', balanceError);
          }
          
          try {
            await api.get('/bet');
            console.log('Bet retrieved successfully');
          } catch (betError) {
            console.error('Bet error:', betError);
          }
          
          setIsLoading(false);
        } catch (parseError) {
          console.error('Failed to parse user data', parseError);
          
          // Очищаем данные пользователя в случае ошибки
          localStorage.removeItem('user');
          api.clearUser();
          
          message.error('Ошибка авторизации. Пожалуйста, войдите снова.');
          router.push('/login');
        }
      } catch (error) {
        console.error('Authentication check failed', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router, pathname]);
  
  // Переключение темы
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? Theme.DARK : Theme.LIGHT);
  };
  
  // Загрузка темы из localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === Theme.DARK) {
      setIsDarkMode(true);
    }
  }, []);
  
  // Показываем индикатор загрузки, пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Проверка авторизации..." />
      </div>
    );
  }
  
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
              colorPrimary: '#1677ff',
            },
          }}
        >
          <AntApp>
            <Layout className="min-h-screen">
              <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
              
              <Content className="m-4 p-4 bg-white">
                {children}
              </Content>
              
              <Footer className="text-center">
                Betting App ©{new Date().getFullYear()} - Тестовое приложение
              </Footer>
            </Layout>
          </AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
}