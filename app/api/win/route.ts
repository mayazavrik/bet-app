// import { NextResponse } from 'next/server';
// export async function GET(request) {
//     try {
//       // Получаем betId из параметров
//       const { searchParams } = new URL(request.url);
//       const betId = searchParams.get('betId');
      
//       if (!betId) {
//         return NextResponse.json({ error: 'Missing betId parameter' }, { status: 400 });
//       }
      
//       // Находим информацию о ставке (в реальной системе - из базы данных)
//       // Здесь для упрощения извлекаем сумму из betId или используем фиксированное значение
//       const betAmount = 100; // Фиксированное значение для тестирования
      
//       // Генерируем результат (50% шанс выигрыша)
//       const win = Math.random() > 0.5;
      
//       // Вычисляем сумму выигрыша (если выиграл)
//       const winAmount = win ? Math.round(betAmount * 1.9) : 0;
      
//       // Получаем текущий баланс
//       const response = await fetch(`${request.nextUrl.origin}/api/balance`);
//       const balanceData = await response.json();
//       const currentBalance = balanceData.balance || 200;
      
//       // Обновляем баланс, если выиграл
//       const newBalance = win ? (currentBalance + winAmount) : currentBalance;
      
//       // Сохраняем новый баланс, если он изменился
//       if (win) {
//         await fetch(`${request.nextUrl.origin}/api/balance`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ balance: newBalance })
//         });
//       }
      
//       // Формируем ответ
//       return NextResponse.json({
//         win,
//         amount: winAmount,
//         balance: newBalance,
//         timestamp: new Date().toISOString()
//       });
//     } catch (error) {
//       console.error('Error in win endpoint:', error);
//       return NextResponse.json(
//         { error: 'Failed to get win result' },
//         { status: 500 }
//       );
//     }
//   }

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Получаем betId из параметров запроса, если есть
  const { searchParams } = new URL(request.url);
  const betId = searchParams.get('betId');
  
  if (!betId) {
    return NextResponse.json({ error: 'Missing betId parameter' }, { status: 400 });
  }
  
  // Генерируем случайный результат (выигрыш/проигрыш)
  const win = Math.random() > 0.5;
  const amount = Math.floor(Math.random() * 1000) + 100;
  
  // Получаем или устанавливаем баланс (в реальной системе это был бы запрос к базе данных)
  const currentBalance = 200; // Пример текущего баланса
  const newBalance = win ? currentBalance + amount : currentBalance - 100; // Предполагаем, что ставка была 100
  
  return NextResponse.json({
    win, // boolean вместо строки
    amount: win ? amount : 0,
    balance: newBalance, // Добавляем баланс в ответ
    timestamp: new Date().toISOString()
  });
}
// import { NextResponse } from 'next/server';
// import HmacSHA512 from 'crypto-js/hmac-sha512';

// // Данные пользователей (используем те же, что и в /api/bet/route.js)
// const users = {
//   '6': { secretKey: '218dd27aebeccecae69ad8408d9a36bf' }
// };

// // Проверка подписи (такая же, как в /api/bet/route.js)
// function verifySignature(request, method) {
//   const userId = request.headers.get('user-id');
//   const timestamp = request.headers.get('x-timestamp');
//   const signature = request.headers.get('x-signature');
  
//   console.log('Verifying signature for /win:', {
//     userId,
//     timestamp,
//     signature: signature ? signature.substring(0, 20) + '...' : undefined
//   });
  
//   if (!userId || !timestamp || !signature) {
//     console.log('Missing auth headers');
//     return false;
//   }
  
//   const user = users[userId];
//   if (!user) {
//     console.log('User not found:', userId);
//     return false;
//   }
  
//   // Проверяем различные форматы пути
//   const payloads = [
//     `${method}:/win:{}`,
//     `${method}:/api/win:{}`
//   ];
  
//   if (request.nextUrl.searchParams.has('betId')) {
//     const betId = request.nextUrl.searchParams.get('betId');
//     payloads.push(`${method}:/api/win?betId=${betId}:{}`);
//   }
  
//   for (const payload of payloads) {
//     const expectedSignature = HmacSHA512(payload, user.secretKey).toString();
//     console.log(`Checking payload: "${payload}"`);
//     console.log(`Expected: ${expectedSignature.substring(0, 20)}...`);
//     console.log(`Actual:   ${signature.substring(0, 20)}...`);
    
//     if (signature === expectedSignature) {
//       console.log('✓ Signature matches!');
//       return true;
//     }
//   }
  
//   console.log('✗ Signature verification failed for all payloads');
//   return false;
// }

// export async function GET(request) {
//   console.log('GET /api/win handler called');
  
//   try {
//     // Получаем betId из параметров запроса
//     const betId = request.nextUrl.searchParams.get('betId');
    
//     console.log('Requested betId:', betId);
    
//     if (!betId) {
//       return NextResponse.json(
//         { error: 'Missing betId parameter' },
//         { status: 400 }
//       );
//     }
    
//     // Верификация подписи (для отладки временно оставляем возможность продолжить без проверки)
//     const signatureValid = verifySignature(request, 'GET');
//     if (!signatureValid) {
//       console.warn('Invalid signature for GET /api/win');
//       // Для отладки временно продолжаем выполнение
//     }
    
//     // Извлекаем данные о ставке из betId (в реальном приложении это было бы из БД)
//     // Для простоты используем размер ставки по умолчанию
//     const defaultBetAmount = 100;
    
//     // Получаем текущий баланс
//     let currentBalance = 200;
//     try {
//       const balanceResponse = await fetch(`${request.nextUrl.origin}/api/balance`);
//       if (balanceResponse.ok) {
//         const balanceData = await balanceResponse.json();
//         if (balanceData.balance !== undefined) {
//           currentBalance = balanceData.balance;
//         }
//       }
//     } catch (error) {
//       console.warn('Failed to fetch current balance:', error);
//       // Продолжаем с значением по умолчанию
//     }
    
//     // Генерируем случайный результат ставки (50% шанс выигрыша)
//     const win = Math.random() > 0.5;
    
//     // Рассчитываем сумму выигрыша и новый баланс
//     const winAmount = win ? Math.round(defaultBetAmount * 1.9) : 0;
//     const newBalance = win ? (currentBalance + winAmount) : currentBalance;
    
//     // Если выиграл, обновляем баланс
//     if (win) {
//       try {
//         await fetch(`${request.nextUrl.origin}/api/balance`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ balance: newBalance })
//         });
//       } catch (error) {
//         console.warn('Failed to update balance after win:', error);
//         // Продолжаем выполнение
//       }
//     }
    
//     // Формируем ответ с результатом
//     const response = {
//       win,
//       amount: winAmount,
//       balance: newBalance,
//       timestamp: new Date().toISOString()
//     };
    
//     console.log('Win response:', response);
    
//     return NextResponse.json(response);
//   } catch (error) {
//     console.error('Error in win endpoint:', error);
//     return NextResponse.json(
//       { error: 'Failed to get win result' },
//       { status: 500 }
//     );
//   }
// }