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
  PENDING = 'pending',    
  COMPLETED = 'completed', 
  CANCELED = 'canceled',   
}

/**
 * Результат ставки
 */
export interface BetResult {
  win: boolean;          
  amount: number;        
  timestamp: number;     
}

/**
 * Информация о ставке
 */
export interface Bet {
  id: string;             
  amount: number;        
  timestamp: number;     
  status: BetStatus;     
  result?: BetResult;     
}

/**
 * Информация о пользователе
 */
export interface User {
  userId: string;        
  username: string;      
  secretKey: string;   
  balance?: number;       
}