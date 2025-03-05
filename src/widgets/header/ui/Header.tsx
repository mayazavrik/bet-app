import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography, Badge } from 'antd';
import { 
  UserOutlined, 
  DashboardOutlined, 
  HistoryOutlined, 
  LineChartOutlined,
  WalletOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { logoutUser } from '@/features/auth/model';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  
  const { user } = useAppSelector((state) => state.user);
  const { balance } = useAppSelector((state) => state.balance);
  
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  
  // Меню для мобильной версии
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };
  
  // Настройки пользователя (выпадающее меню)
  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Профиль
      </Menu.Item>
      <Menu.Item key="2" icon={<WalletOutlined />}>
        <Link href="/balance">Управление балансом</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Выйти
      </Menu.Item>
    </Menu>
  );
  
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Главная</Link>,
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: <Link href="/history">История</Link>,
    },
    {
      key: '/statistics',
      icon: <LineChartOutlined />,
      label: <Link href="/statistics">Статистика</Link>,
    },
    {
      key: '/balance',
      icon: <WalletOutlined />,
      label: <Link href="/balance">Баланс</Link>,
    },
  ];
  
  return (
    <AntHeader className="bg-white shadow-sm flex items-center justify-between px-4 h-16">
      {/* Логотип и название */}
      <div className="flex items-center">
        <div className="text-primary text-xl font-bold mr-8">
          Betting App
        </div>
        
        {/* Кнопка мобильного меню */}
        <Button
          type="text"
          icon={mobileMenuVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={toggleMobileMenu}
          className="md:hidden"
        />
      </div>
      
      {/* Основное меню */}
      <div className="hidden md:block">
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </div>
      
      {/* Правая часть хедера */}
      <div className="flex items-center">
        {/* Переключатель темы */}
        <Button
          type="text"
          icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
          onClick={toggleTheme}
          className="mr-2"
        />
        
        {/* Баланс */}
        {balance !== null && (
          <Badge count={0} offset={[-5, 5]} dot={false} className="mr-4">
            <Button type="text" icon={<WalletOutlined />}>
            <span className="ml-1 font-medium">
  {typeof balance === 'number' ? balance.toFixed(2) : '0.00'} ₽
</span>
            </Button>
          </Badge>
        )}
        
        {/* Профиль пользователя */}
        <Dropdown overlay={userMenu} trigger={['click']}>
          <Button type="text">
            <Space>
              <Avatar icon={<UserOutlined />} size="small" />
              <Text ellipsis>{user?.userId}</Text>
            </Space>
          </Button>
        </Dropdown>
      </div>
      
      {/* Мобильное меню */}
      {mobileMenuVisible && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md z-10 md:hidden">
          <Menu
            mode="vertical"
            selectedKeys={[pathname]}
            items={menuItems}
          />
        </div>
      )}
    </AntHeader>
  );
};

export default Header;