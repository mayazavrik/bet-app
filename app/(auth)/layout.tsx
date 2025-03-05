'use client';

import React from 'react';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/shared/lib/store';

// Создаем клиент для React Query
const queryClient = new QueryClient();

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              colorPrimary: '#1677ff',
            },
          }}
        >
          <AntApp>
            {children}
          </AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
}