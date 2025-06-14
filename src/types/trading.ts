export interface TradeData {
  id: string;
  date: Date;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  pnl: number;
  commission: number;
  balance: number;
}

export interface EquityPoint {
  date: string;
  balance: number;
  pnl: number;
  drawdown: number;
  trades: number;
  winRate: number;
}

export interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
}