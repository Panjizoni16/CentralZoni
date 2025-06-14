import { TradeData, EquityPoint } from '../types/trading';
import { format, addDays, startOfYear } from 'date-fns';

// Generate sample trading data
export const generateSampleTrades = (): TradeData[] => {
  const trades: TradeData[] = [];
  const startDate = startOfYear(new Date());
  let balance = 10000;
  
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA'];
  
  for (let i = 0; i < 150; i++) {
    const date = addDays(startDate, Math.floor(i * 2.5));
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const quantity = Math.floor(Math.random() * 100) + 1;
    const price = Math.random() * 200 + 50;
    
    // Generate realistic P&L with 60% win rate
    const isWin = Math.random() < 0.6;
    const pnl = isWin 
      ? Math.random() * 500 + 50  // Win: $50-$550
      : -(Math.random() * 300 + 25); // Loss: -$25 to -$325
    
    const commission = quantity * 0.01; // $0.01 per share
    balance += pnl - commission;
    
    trades.push({
      id: `trade-${i}`,
      date,
      symbol,
      type,
      quantity,
      price,
      pnl,
      commission,
      balance
    });
  }
  
  return trades;
};

export const generateEquityCurve = (trades: TradeData[]): EquityPoint[] => {
  const equityPoints: EquityPoint[] = [];
  let runningBalance = 10000;
  let peak = 10000;
  let totalTrades = 0;
  let wins = 0;
  
  // Group trades by date
  const tradesByDate = trades.reduce((acc, trade) => {
    const dateKey = format(trade.date, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(trade);
    return acc;
  }, {} as Record<string, TradeData[]>);
  
  // Create equity points
  Object.entries(tradesByDate).forEach(([dateKey, dayTrades]) => {
    const dayPnL = dayTrades.reduce((sum, trade) => sum + trade.pnl - trade.commission, 0);
    runningBalance += dayPnL;
    
    if (runningBalance > peak) {
      peak = runningBalance;
    }
    
    const drawdown = peak - runningBalance;
    const drawdownPercent = (drawdown / peak) * 100;
    
    totalTrades += dayTrades.length;
    wins += dayTrades.filter(trade => trade.pnl > 0).length;
    
    equityPoints.push({
      date: dateKey,
      balance: runningBalance,
      pnl: dayPnL,
      drawdown: drawdownPercent,
      trades: dayTrades.length,
      winRate: totalTrades > 0 ? (wins / totalTrades) * 100 : 0
    });
  });
  
  return equityPoints;
};

export const sampleTrades = generateSampleTrades();
export const sampleEquityCurve = generateEquityCurve(sampleTrades);