import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Проверяем, что есть userId в запросе
    if (!body.userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    
    console.log('Auth request received:', body);
    
    // Успешная авторизация
    return NextResponse.json({ 
      success: true, 
      message: 'Authentication successful',
      userId: body.userId
    });
  } catch (error) {
    console.error('Error in auth endpoint:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}