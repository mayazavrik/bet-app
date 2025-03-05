// // Пользовательские данные
// export interface User {
//     userId: string;
//     secretKey: string;
//   }
  
//   // Данные о ставке
//   export interface Bet {
//     id: string;
//     amount: number;
//     timestamp: number;
//     status: BetStatus;
//     result?: BetResult;
//   }
  
//   export enum BetStatus {
//     PENDING = 'pending',
//     COMPLETED = 'completed',
//   }
  
//   export interface BetResult {
//     win: boolean;
//     amount: number;
//     timestamp: number;
//   }
  
//   // Статистика
//   export interface Statistics {
//     totalBets: number;
//     wins: number;
//     losses: number;
//     winRate: number;
//     totalWinAmount: number;
//     totalLossAmount: number;
//   }
  
//   // Тема интерфейса
//   export enum Theme {
//     LIGHT = 'light',
//     DARK = 'dark',
//   }
  
//   // Уведомления
//   export interface Notification {
//     id: string;
//     type: 'success' | 'error' | 'warning' | 'info';
//     message: string;
//     description?: string;
//     duration?: number;
//   }
// shared/types/common.ts

/**
 * Перечисление тем оформления
 */
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

/**
 * Перечисление статусов ставки
 */
export enum BetStatus {
  PENDING = 'pending',    // Ставка размещена, ожидает результата
  COMPLETED = 'completed', // Ставка завершена (выигрыш или проигрыш)
  CANCELED = 'canceled',   // Ставка отменена
}

/**
 * Результат ставки
 */
export interface BetResult {
  win: boolean;          // Выигрыш (true) или проигрыш (false)
  amount: number;        // Сумма выигрыша/проигрыша
  timestamp: number;      // Время получения результата
}

/**
 * Информация о ставке
 */
export interface Bet {
  id: string;             // Уникальный идентификатор ставки
  amount: number;         // Сумма ставки
  timestamp: number;      // Время размещения ставки
  status: BetStatus;      // Статус ставки
  result?: BetResult;     // Результат ставки (если есть)
}

/**
 * Информация о пользователе
 */
export interface User {
  userId: string;         // Уникальный идентификатор пользователя
  username: string;       // Имя пользователя
  secretKey: string;      // Секретный ключ для подписи запросов
  balance?: number;       // Баланс пользователя (опционально)
}