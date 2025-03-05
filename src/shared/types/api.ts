// API response типы
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
  }
  
  // Auth API типы
  export interface AuthRequest {
    userId: string;
  }
  
  export interface AuthResponse {
    userId: string;
    secretKey: string;
  }
  
  // Balance API типы
  export interface BalanceRequest {
    balance: number;
  }
  
  export interface BalanceResponse {
    balance: number;
  }
  
  // Bet API типы
  export interface RecommendedBetResponse {
    recommendedBet: number;
  }
  
  export interface PlaceBetRequest {
    bet: number;
  }
  
  export interface PlaceBetResponse {
    betId: string;
    balance: number;
  }
  
  // Win API типы
  export interface WinRequest {
    betId: string;
  }
  
  export interface WinResponse {
    win: boolean;
    amount: number;
    balance: number;
  }
  
  // Check Balance API типы
  export interface CheckBalanceRequest {
    expectedBalance: number;
  }
  
  export interface CheckBalanceResponse {
    matched: boolean;
    actualBalance: number;
    difference: number;
  }