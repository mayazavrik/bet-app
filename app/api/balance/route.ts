import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		console.log("POST /api/balance endpoint hit");

		let body;
		try {
			body = await request.json();
			console.log("Received body:", body);
		} catch (e) {
			console.error("Failed to parse JSON body:", e);
			body = {};
		}

		const amount = body.amount !== undefined ? body.amount : body.balance;

		if (amount === undefined) {
			console.log("Request to get current balance (no amount provided)");

			return NextResponse.json({
				success: true,
				balance: 200, 
				timestamp: new Date().toISOString(),
			});
		}
		console.log(`Setting balance to: ${amount}`);

		return NextResponse.json({
			success: true,
			balance: amount,
			amount: amount,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error in /api/balance POST handler:", error);
		return NextResponse.json({ error: "Failed to set balance" }, { status: 500 });
	}
}
