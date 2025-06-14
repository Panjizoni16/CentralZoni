import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush
} from 'recharts';
import { EquityPoint } from '../types/trading';
import { formatCurrency, formatPercent } from '../utils/calculations';
import { format, parseISO } from 'date-fns';

interface EquityChartProps {
  data: EquityPoint[];
  showDrawdown?: boolean;
}

const EquityChart: React.FC<EquityChartProps> = ({ data, showDrawdown = false }) => {
  const [activeTooltip, setActiveTooltip] = useState<any>(null);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">
            {format(parseISO(label), 'dd MMM yyyy')}
          </p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Balance:</span>{' '}
              <span className="font-medium">{formatCurrency(data.balance)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Daily P&L:</span>{' '}
              <span className={`font-medium ${data.pnl >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {formatCurrency(data.pnl)}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Drawdown:</span>{' '}
              <span className="font-medium text-danger-600">
                {formatPercent(-data.drawdown)}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Trades:</span>{' '}
              <span className="font-medium">{data.trades}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Win Rate:</span>{' '}
              <span className="font-medium">{data.winRate.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const initialBalance = 10000;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Equity Curve</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Balance</span>
          </div>
          {showDrawdown && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Drawdown</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date"
              tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#666"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine 
              y={initialBalance} 
              stroke="#94a3b8" 
              strokeDasharray="5 5"
              label={{ value: "Initial Balance", position: "topRight" }}
            />
            
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#0ea5e9" }}
            />
            
            {showDrawdown && (
              <Line
                type="monotone"
                dataKey="drawdown"
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
              />
            )}
            
            <Brush 
              dataKey="date"
              height={30}
              stroke="#0ea5e9"
              tickFormatter={(value) => format(parseISO(value), 'MMM')}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EquityChart;