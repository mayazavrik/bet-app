"use client";

import React from "react";
import { Typography, Row, Col } from "antd";
import BetHistory from "@/features/bet-history/ui/BetHistory";

import { useAppSelector } from "@/shared/lib/hooks/redux";
import BetStatistics from "@/features/bet-history/ui/BetStatitics";

const { Title } = Typography;

const HistoryPage: React.FC = () => {
	const { bets } = useAppSelector((state) => state.bet);

	return (
		<div>
			<Title level={2} className="mb-8">
				История и статистика ставок
			</Title>

			<Row gutter={[16, 16]}>
				<Col span={24}>
					<BetStatistics />
				</Col>

				<Col span={24} className="mt-4">
					<BetHistory />
				</Col>
			</Row>
		</div>
	);
};

export default HistoryPage;
