import { NextResponse } from 'next/server';

export async function POST() {
  // В реальном приложении здесь нужно проверять баланс пользователя
  // Для тестирования возвращаем фиктивный результат
  return NextResponse.json({
    balance: 1500,  // Фиктивный баланс
    isValid: true,  // Флаг корректности баланса
    lastChecked: new Date().toISOString()
  });
}
export async function GET() {
    // Используем тот же баланс, что и в /api/balance
    // В реальном приложении это должна быть база данных
    const userBalance = 200; // Либо получайте значение из контекста приложения
    
    return NextResponse.json({ balance: userBalance });
  }