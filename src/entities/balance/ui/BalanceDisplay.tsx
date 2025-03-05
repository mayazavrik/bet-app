import React, { useEffect } from "react";
import { Card, Statistic, Skeleton, Badge } from "antd";
import { WalletOutlined, ReloadOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/shared/lib/hooks/redux";

interface BalanceDisplayProps {
	onRefresh?: () => void;
	isRefreshing?: boolean;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ onRefresh, isRefreshing = false }) => {
	const { balance, loading, error, showBalanceAnimation } = useAppSelector(
		(state) => state.balance,
	);

	let balanceClassNames = "transition-all duration-500";
	if (showBalanceAnimation) {
		balanceClassNames += " animate-balance-change text-green-500";
	}

	return (
		<Card
			className="shadow-sm"
			extra={
				onRefresh && (
					<ReloadOutlined
						className="cursor-pointer hover:text-primary text-lg"
						spin={isRefreshing}
						onClick={onRefresh}
					/>
				)
			}
		>
			{loading && !balance ? (
				<Skeleton active paragraph={{ rows: 1 }} />
			) : error ? (
				<div className="text-error">{error}</div>
			) : (
				<Statistic
					title="Ваш баланс"
					value={balance || 0}
					precision={2}
					prefix={<WalletOutlined />}
					suffix="₽"
					className={balanceClassNames}
					valueStyle={{ color: showBalanceAnimation ? "#52c41a" : undefined }}
				/>
			)}
		</Card>
	);
};

export default BalanceDisplay;
