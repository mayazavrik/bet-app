import { NextResponse } from "next/server";

// Фиктивные данные для рекомендаций ставок
const recommendedBets = [
	{
		id: "rec-bet-1",
		description: "Футбол: Спартак - ЦСКА",
		odds: 1.85,
		recommendedAmount: 100,
		option: "win",
	},
	{
		id: "rec-bet-2",
		description: "Хоккей: СКА - Динамо",
		odds: 2.1,
		recommendedAmount: 150,
		option: "win",
	},
	{
		id: "rec-bet-3",
		description: "Баскетбол: ЦСКА - Химки",
		odds: 1.75,
		recommendedAmount: 200,
		option: "win",
	},
];

export async function GET() {
	const randomBet = recommendedBets[Math.floor(Math.random() * recommendedBets.length)];

	return NextResponse.json(randomBet);
}

export async function POST() {
	const randomBet = recommendedBets[Math.floor(Math.random() * recommendedBets.length)];

	return NextResponse.json(randomBet);
}
