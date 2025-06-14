import React, { useState } from 'react';
import { TradeData } from '../types/trading';
import { formatCurrency } from '../utils/calculations';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface TradesListProps {
  trades: TradeData[];
}

const TradesList: React.FC<TradesListProps> = ({ trades }) => {
  const [sortField, setSortField] = useState<keyof TradeData>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterSymbol, setFilterSymbol] = useState<string>('');
  const [showProfitable, setShowProfitable] = useState<'all' | 'wins' | 'losses'>('all');

  const handleSort = (field: keyof TradeData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredTrades = trades
    .filter(trade => {
      if (filterSymbol && !trade.symbol.toLowerCase().includes(filterSymbol.toLowerCase())) {
        return false;
      }
      if (showProfitable === 'wins' && trade.pnl <= 0) return false;
      if (showProfitable === 'losses' && trade.pnl >= 0) return false;
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ field }: { field: keyof TradeData }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const uniqueSymbols = Array.from(new Set(trades.map(trade => trade.symbol))).sort();

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Trade History</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterSymbol}
              onChange={(e) => setFilterSymbol(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="">All Symbols</option>
              {uniqueSymbols.map(symbol => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
          </div>
          <select
            value={showProfitable}
            onChange={(e) => setShowProfitable(e.target.value as 'all' | 'wins' | 'losses')}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Trades</option>
            <option value="wins">Profitable Only</option>
            <option value="losses">Losses Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th 
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <SortIcon field="date" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center space-x-1">
                  <span>Symbol</span>
                  <SortIcon field="symbol" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <SortIcon field="type" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Qty</span>
                  <SortIcon field="quantity" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Price</span>
                  <SortIcon field="price" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('pnl')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>P&L</span>
                  <SortIcon field="pnl" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('balance')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Balance</span>
                  <SortIcon field="balance" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((trade) => (
              <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">
                  {format(trade.date, 'dd/MM/yyyy')}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  {trade.symbol}
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trade.type === 'buy' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-danger-100 text-danger-800'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900">
                  {trade.quantity}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900">
                  {formatCurrency(trade.price)}
                </td>
                <td className={`py-3 px-4 text-sm text-right font-medium ${
                  trade.pnl >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {formatCurrency(trade.pnl)}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900">
                  {formatCurrency(trade.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredTrades.length} of {trades.length} trades
      </div>
    </div>
  );
};

export default TradesList;