'use client';

import { useEffect } from 'react';

/**
 * Компонент для управления загрузкой страницы и предотвращения мигания
 */
export const PreloadHandler = () => {
  useEffect(() => {
    // Добавляем класс loading к html элементу при загрузке
    document.documentElement.classList.add('loading');

    // Удаляем класс loading после полной загрузки страницы
    const handleLoad = () => {
      document.documentElement.classList.remove('loading');
    };

    // Если страница уже загружена, вызываем handleLoad сразу
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      
      // Таймаут как запасной вариант, если событие 'load' не сработает
      const timeout = setTimeout(handleLoad, 2000);
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timeout);
      };
    }
  }, []);

  return null; // Этот компонент не рендерит никакой UI
};