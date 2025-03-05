

// export async function POST(request: Request) {
//   try {
//     // Лог для отладки
//     console.log('POST /api/balance endpoint hit');

import { NextResponse } from "next/server";

    
//     // Получение тела запроса
//     const body = await request.json().catch(e => {
//       console.error('Failed to parse JSON body:', e);
//       return {}; // Пустой объект в случае ошибки парсинга
//     });
    
//     console.log('Received body:', body);
    
//     // Проверяем наличие amount в запросе
//     const amount = body.amount || body.balance;
    
//     if (!amount && amount !== 0) {
//       console.error('No amount provided in request');
//       // Возвращаем ответ с ошибкой если amount отсутствует
//       return NextResponse.json({ error: 'Missing amount parameter' }, { status: 400 });
//     }
    
//     // Успешный ответ
//     return NextResponse.json({ 
//       success: true, 
//       balance: amount,
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     console.error('Error in /api/balance POST handler:', error);
//     return NextResponse.json(
//       { error: 'Failed to set balance' }, 
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     console.log('GET /api/balance endpoint hit');
    
//     // Для GET запроса просто возвращаем фиксированный баланс (в реальном приложении здесь была бы логика получения баланса из БД)
//     return NextResponse.json({ 
//       balance: 1000,
//       timestamp: new Date().toISOString() 
//     });
//   } catch (error) {
//     console.error('Error in /api/balance GET handler:', error);
//     return NextResponse.json(
//       { error: 'Failed to get balance' }, 
//       { status: 500 }
//     );
//   }
// }
export async function POST(request: Request) {
    try {
      console.log('POST /api/balance endpoint hit');
      
      let body;
      try {
        body = await request.json();
        console.log('Received body:', body);
      } catch (e) {
        console.error('Failed to parse JSON body:', e);
        body = {};
      }
      
       // Проверяем оба возможных параметра
       const amount = body.amount !== undefined ? body.amount : body.balance;
      
       // Если amount не определён, считаем это запросом на получение текущего баланса
       if (amount === undefined) {
         console.log('Request to get current balance (no amount provided)');
         // Вернуть текущий баланс пользователя (здесь можно подставить любое значение для теста)
         return NextResponse.json({ 
           success: true, 
           balance: 200, // Или любое другое значение баланса
           timestamp: new Date().toISOString()
         });
       }
       console.log(`Setting balance to: ${amount}`);
      // Успешный ответ с обоими параметрами для совместимости
      return NextResponse.json({ 
        success: true, 
        balance: amount,
        amount: amount,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in /api/balance POST handler:', error);
      return NextResponse.json(
        { error: 'Failed to set balance' }, 
        { status: 500 }
      );
    }
  }






// let userBalance = 200; // Начальный баланс

// export async function POST(request: Request) {
//   try {
//     console.log('POST /api/balance endpoint hit');
    
//     let body;
//     try {
//       body = await request.json();
//       console.log('Received body:', body);
//     } catch (e) {
//       console.error('Failed to parse JSON body:', e);
//       body = {};
//     }
    
//     // Проверяем оба возможных параметра
//     const amount = body.amount !== undefined ? body.amount : body.balance;
    
//     // Если amount не определён, считаем это запросом на получение текущего баланса
//     if (amount === undefined) {
//       console.log('Request to get current balance (no amount provided)');
//       return NextResponse.json({ 
//         success: true, 
//         balance: userBalance,
//         timestamp: new Date().toISOString()
//       });
//     }
    
//     // Обновляем баланс в хранилище данных
//     userBalance = Number(amount);
//     console.log(`Setting balance to: ${userBalance}`);
    
//     // Успешный ответ с обоими параметрами для совместимости
//     return NextResponse.json({ 
//       success: true, 
//       balance: userBalance,
//       amount: userBalance,
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     console.error('Error in /api/balance POST handler:', error);
//     return NextResponse.json(
//       { error: 'Failed to set balance' }, 
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   return NextResponse.json({ 
//     success: true, 
//     balance: userBalance,
//     timestamp: new Date().toISOString()
//   });
// }