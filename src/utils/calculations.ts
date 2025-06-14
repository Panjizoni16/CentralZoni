import { TradeData, PerformanceMetrics } from '../types/trading';

export const calculatePerformanceMetrics = (trades: TradeData[]): PerformanceMetrics => {
  if (trades.length === 0) {
    return {
      totalReturn: 0,
      totalReturnPercent: 0,
      maxDrawdown: 0,
      maxDrawdownPercent: 0,
      sharpeRatio: 0,
      winRate: 0,
      totalTrades: 0,
      profitFactor: 0,
      avgWin: 0,
      avgLoss: 0
    };
  }

  const initialBalance = 10000;
  const finalBalance = trades[trades.length - 1].balance;
  const totalReturn = finalBalance - initialBalance;
  const totalReturnPercent = (totalReturn / initialBalance) * 100;

  // Calculate drawdown
  let peak = initialBalance;
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;

  trades.forEach(trade => {
    if (trade.balance > peak) {
      peak = trade.balance;
    }
    const drawdown = peak - trade.balance;
    const drawdownPercent = (drawdown / peak) * 100;
    
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownPercent = drawdownPercent;
    }
  });

  // Win/Loss statistics
  const wins = trades.filter(trade => trade.pnl > 0);
  const losses = trades.filter(trade => trade.pnl < 0);
  const winRate = (wins.length / trades.length) * 100;

  const totalWins = wins.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalLosses = Math.abs(losses.reduce((sum, trade) => sum + trade.pnl, 0));
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0;

  const avgWin = wins.length > 0 ? totalWins / wins.length : 0;
  const avgLoss = losses.length > 0 ? totalLosses / losses.length : 0;

  // Simple Sharpe ratio calculation (assuming risk-free rate of 2%)
  const returns = trades.map(trade => trade.pnl / initialBalance);
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const returnStdDev = Math.sqrt(
    returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
  );
  const sharpeRatio = returnStdDev > 0 ? (avgReturn - 0.02) / returnStdDev : 0;

  return {
    totalReturn,
    totalReturnPercent,
    maxDrawdown,
    maxDrawdownPercent,
    sharpeRatio,
    winRate,
    totalTrades: trades.length,
    profitFactor,
    avgWin,
    avgLoss
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};