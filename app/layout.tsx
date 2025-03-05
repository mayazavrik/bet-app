import type { Metadata } from 'next';
import './globals.css';
import { PreloadHandler } from '@/shared/ui/components/PreloadHandler';

export const metadata: Metadata = {
  title: 'Betting App',
  description: 'Система ставок с функцией проверки баланса',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        {/* Добавляем скрипт для предотвращения мигания */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Добавляем класс 'loading' к html элементу
              document.documentElement.classList.add('loading');
              
              // Удаляем класс после загрузки страницы
              window.addEventListener('DOMContentLoaded', function() {
                document.documentElement.classList.remove('loading');
              });
              
              // Запасной вариант, если DOMContentLoaded не сработает
              setTimeout(function() {
                document.documentElement.classList.remove('loading');
              }, 2000);
            `,
          }}
        />
      </head>
      <body>
        <PreloadHandler />
        {children}
      </body>
    </html>
  );
}