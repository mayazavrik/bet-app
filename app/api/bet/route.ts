

import { NextResponse } from 'next/server';
import HmacSHA512 from 'crypto-js/hmac-sha512';

// Фиктивные данные для ставок
const sampleBets = [
  {
    id: 'bet-1',
    description: 'Футбол: Спартак - ЦСКА',
    odds: 1.85,
    availableOptions: ['win', 'lose', 'draw']
  },
  {
    id: 'bet-2',
    description: 'Хоккей: СКА - Динамо',
    odds: 2.1,
    availableOptions: ['win', 'lose']
  },
  {
    id: 'bet-3',
    description: 'Баскетбол: ЦСКА - Химки',
    odds: 1.75,
    availableOptions: ['win', 'lose']
  }
];

// Данные пользователей
const users = {
  '6': { secretKey: '218dd27aebeccecae69ad8408d9a36bf' }
};

// Проверка подписи с подробным логированием
function verifySignature(request, method) {
  const userId = request.headers.get('user-id');
  const timestamp = request.headers.get('x-timestamp');
  const signature = request.headers.get('x-signature');
  
  console.log('Verifying signature for /bet:', {
    userId,
    timestamp,
    signature: signature ? signature.substring(0, 20) + '...' : undefined
  });
  
  if (!userId || !timestamp || !signature) {
    console.log('Missing auth headers');
    return false;
  }
  
  const user = users[userId];
  if (!user) {
    console.log('User not found:', userId);
    return false;
  }
  
  // Проверяем как GET:/bet:{} так и GET:/api/bet:{}
  // Это поможет определить правильный формат
  const payloads = [
    `${method}:/bet:{}`,
    `${method}:/api/bet:{}`
  ];
  
  for (const payload of payloads) {
    const expectedSignature = HmacSHA512(payload, user.secretKey).toString();
    console.log(`Checking payload: "${payload}"`);
    console.log(`Expected: ${expectedSignature.substring(0, 20)}...`);
    console.log(`Actual:   ${signature.substring(0, 20)}...`);
    
    if (signature === expectedSignature) {
      console.log('✓ Signature matches!');
      return true;
    }
  }
  
  console.log('✗ Signature verification failed for all payloads');
  return false;
}

export async function GET(request) {
  console.log('GET /api/bet handler called');
  
  // Верификация подписи с информационным логированием
  const signatureValid = verifySignature(request, 'GET');
  if (!signatureValid) {
    console.warn('Invalid signature for GET /api/bet');
    // Для отладки временно продолжаем выполнение
  }
  
  // Возвращаем случайную ставку из списка
  const randomBet = sampleBets[Math.floor(Math.random() * sampleBets.length)];
  
  // Добавляем в ответ рекомендацию для клиента
  const response = {
    ...randomBet,
    recommendation: {
      amount: Math.floor(Math.random() * 50) + 50,
      option: randomBet.availableOptions[0]
    }
  };
  
  return NextResponse.json(response);
}

export async function POST(request) {
    console.log('POST /api/bet handler called');
    
    try {
      // Клонируем запрос, чтобы можно было прочитать тело для проверки подписи
      const requestClone = request.clone();
      const body = await requestClone.text();
      
      console.log('POST /api/bet body:', body);
      
      // Проверяем подпись
      const signatureValid = verifySignature(request, 'POST');
      if (!signatureValid) {
        console.warn('Invalid signature for POST /api/bet');
        // Для отладки временно продолжаем выполнение
      }
      
      // Парсим тело
      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        parsedBody = {};
      }
      
      // Проверяем необходимые поля
      if (!parsedBody.betId || !parsedBody.option || !parsedBody.amount) {
        return NextResponse.json(
          { error: 'Missing required fields: betId, option, amount' },
          { status: 400 }
        );
      }
      
      console.log('Bet placement received:', parsedBody);
      
      // Создаем фиктивный ответ на размещение ставки
      return NextResponse.json({
        success: true,
        bet: {
          id: parsedBody.betId,
          amount: Number(parsedBody.amount), // Преобразуем в число
          option: parsedBody.option,
          odds: 1.9,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in bet placement endpoint:', error);
      return NextResponse.json(
        { error: 'Failed to place bet' },
        { status: 500 }
      );
    }
  }
// import { NextResponse } from 'next/server';
// import HmacSHA512 from 'crypto-js/hmac-sha512';

// // Фиктивные данные для ставок
// const sampleBets = [
//   {
//     id: 'bet-1',
//     description: 'Футбол: Спартак - ЦСКА',
//     odds: 1.85,
//     availableOptions: ['win', 'lose', 'draw']
//   },
//   {
//     id: 'bet-2',
//     description: 'Хоккей: СКА - Динамо',
//     odds: 2.1,
//     availableOptions: ['win', 'lose']
//   },
//   {
//     id: 'bet-3',
//     description: 'Баскетбол: ЦСКА - Химки',
//     odds: 1.75,
//     availableOptions: ['win', 'lose']
//   }
// ];

// // Данные пользователей
// const users = {
//   '6': { secretKey: '218dd27aebeccecae69ad8408d9a36bf' }
// };

// // Проверка подписи с подробным логированием
// function verifySignature(request, method) {
//   const userId = request.headers.get('user-id');
//   const timestamp = request.headers.get('x-timestamp');
//   const signature = request.headers.get('x-signature');
  
//   console.log('Verifying signature for /bet:', {
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
  
//   // Проверяем как GET:/bet:{} так и GET:/api/bet:{}
//   // Это поможет определить правильный формат
//   const payloads = [
//     `${method}:/bet:{}`,
//     `${method}:/api/bet:{}`
//   ];
  
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
//   console.log('GET /api/bet handler called');
  
//   // Верификация подписи с информационным логированием
//   const signatureValid = verifySignature(request, 'GET');
//   if (!signatureValid) {
//     console.warn('Invalid signature for GET /api/bet');
//     // Для отладки временно продолжаем выполнение
//   }
  
//   // Возвращаем случайную ставку из списка
//   const randomBet = sampleBets[Math.floor(Math.random() * sampleBets.length)];
  
//   // Добавляем в ответ рекомендацию для клиента
//   const response = {
//     ...randomBet,
//     recommendation: {
//       amount: Math.floor(Math.random() * 50) + 50,
//       option: randomBet.availableOptions[0]
//     }
//   };
  
//   return NextResponse.json(response);
// }

// export async function POST(request) {
//   console.log('POST /api/bet handler called');
  
//   try {
//     // Клонируем запрос, чтобы можно было прочитать тело для проверки подписи
//     const requestClone = request.clone();
//     const body = await requestClone.text();
    
//     console.log('POST /api/bet body:', body);
    
//     // Проверяем подпись
//     const signatureValid = verifySignature(request, 'POST');
//     if (!signatureValid) {
//       console.warn('Invalid signature for POST /api/bet');
//       // Для отладки временно продолжаем выполнение
//     }
    
//     // Парсим тело
//     let parsedBody;
//     try {
//       parsedBody = JSON.parse(body);
//     } catch (e) {
//       parsedBody = {};
//     }
    
//     // Проверяем необходимые поля
//     if (!parsedBody.betId || !parsedBody.option || !parsedBody.amount) {
//       return NextResponse.json(
//         { error: 'Missing required fields: betId, option, amount' },
//         { status: 400 }
//       );
//     }
    
//     console.log('Bet placement received:', parsedBody);
    
//     // Создаем фиктивный ответ на размещение ставки
//     return NextResponse.json({
//         success: true,
//         bet: {
//           id: parsedBody.betId,
//           amount: parsedBody.amount, // Сохраняем amount как число, а не как объект
//           option: parsedBody.option,
//           odds: 1.9,
//           timestamp: new Date().toISOString()
//         }
//       });
//   } catch (error) {
//     console.error('Error in bet placement endpoint:', error);
//     return NextResponse.json(
//       { error: 'Failed to place bet' },
//       { status: 500 }
//     );
//   }
// }