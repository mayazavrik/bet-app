import { NextResponse } from "next/server";

async function getBetById(betId) {
	// В реальном приложении это запрос к базе данных или хранилищу
	// Возвращаем заглушку для примера
	return {
		id: betId,
		amount: 50, // Фактическая сумма ставки пользователя
		odds: 2.0, // Коэффициент ставки
		userId: "123",
		status: "pending",
	};
}

// Функция для получения текущего баланса пользователя
async function getUserBalance(userId) {
	// В реальном приложении это запрос к базе данных
	// Возвращаем заглушку для примера
	return 200;
}

// Функция для обновления баланса пользователя
async function updateUserBalance(userId, newBalance) {
	// В реальном приложении это запрос к базе данных
	console.log(`Обновление баланса пользователя ${userId} до ${newBalance}`);
	return true;
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const betId = searchParams.get("betId");

	if (!betId) {
		return NextResponse.json({ error: "Не указан ID ставки (betId)" }, { status: 400 });
	}

	try {
		const bet = await getBetById(betId);
		if (!bet) {
			return NextResponse.json({ error: "Ставка не найдена" }, { status: 404 });
		}

		const currentBalance = await getUserBalance(bet.userId);

		const win = Math.random() > 0.5;

		const winAmount = win ? Math.round(bet.amount * bet.odds) : 0;
		const lossAmount = win ? 0 : bet.amount;

		// Рассчитываем новый баланс
		const newBalance = win ? currentBalance + winAmount - bet.amount : currentBalance - lossAmount;

		// Обновляем баланс пользователя
		await updateUserBalance(bet.userId, newBalance);

		return NextResponse.json({
			win,
			amount: winAmount,
			balance: newBalance,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Ошибка при обработке результата ставки:", error);
		return NextResponse.json(
			{ error: "Не удалось получить результат ставки. Пожалуйста, попробуйте позже." },
			{ status: 500 },
		);
	}
}
