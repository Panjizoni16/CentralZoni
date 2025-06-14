import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Target, DollarSign, Activity, Award } from 'lucide-react';
import EquityChart from './components/EquityChart';
import MetricsCard from './components/MetricsCard';
import TradesList from './components/TradesList';
import { sampleTrades, sampleEquityCurve } from './data/sampleData';
import { calculatePerformanceMetrics, formatCurrency, formatPercent } from './utils/calculations';

function App() {
  const [showDrawdown, setShowDrawdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'trades'>('overview');

  const metrics = useMemo(() => calculatePerformanceMetrics(sampleTrades), []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Trading Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('trades')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'trades'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trades
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              <MetricsCard
                title="Total Return"
                value={formatCurrency(metrics.totalReturn)}
                change={formatPercent(metrics.totalReturnPercent)}
                trend={metrics.totalReturn >= 0 ? 'up' : 'down'}
                icon={<DollarSign className="w-5 h-5" />}
              />
              <MetricsCard
                title="Max Drawdown"
                value={formatCurrency(-metrics.maxDrawdown)}
                change={formatPercent(-metrics.maxDrawdownPercent)}
                trend="down"
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <MetricsCard
                title="Win Rate"
                value={`${metrics.winRate.toFixed(1)}%`}
                trend={metrics.winRate >= 50 ? 'up' : 'down'}
                icon={<Target className="w-5 h-5" />}
              />
              <MetricsCard
                title="Total Trades"
                value={metrics.totalTrades.toString()}
                icon={<Activity className="w-5 h-5" />}
              />
              <MetricsCard
                title="Profit Factor"
                value={metrics.profitFactor.toFixed(2)}
                trend={metrics.profitFactor >= 1 ? 'up' : 'down'}
                icon={<Award className="w-5 h-5" />}
              />
              <MetricsCard
                title="Sharpe Ratio"
                value={metrics.sharpeRatio.toFixed(2)}
                trend={metrics.sharpeRatio >= 1 ? 'up' : 'neutral'}
                icon={<BarChart3 className="w-5 h-5" />}
              />
            </div>

            {/* Chart Controls */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showDrawdown}
                    onChange={(e) => setShowDrawdown(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Show Drawdown</span>
                </label>
              </div>
            </div>

            {/* Equity Chart */}
            <div className="mb-8">
              <EquityChart data={sampleEquityCurve} showDrawdown={showDrawdown} />
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Win/Loss Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Win:</span>
                    <span className="font-medium text-success-600">
                      {formatCurrency(metrics.avgWin)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Loss:</span>
                    <span className="font-medium text-danger-600">
                      {formatCurrency(-metrics.avgLoss)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win/Loss Ratio:</span>
                    <span className="font-medium">
                      {metrics.avgLoss > 0 ? (metrics.avgWin / metrics.avgLoss).toFixed(2) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Drawdown:</span>
                    <span className="font-medium text-danger-600">
                      {formatPercent(-metrics.maxDrawdownPercent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sharpe Ratio:</span>
                    <span className="font-medium">
                      {metrics.sharpeRatio.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit Factor:</span>
                    <span className="font-medium">
                      {metrics.profitFactor.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Trades:</span>
                    <span className="font-medium">{metrics.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Winning Trades:</span>
                    <span className="font-medium text-success-600">
                      {Math.round(metrics.totalTrades * metrics.winRate / 100)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Losing Trades:</span>
                    <span className="font-medium text-danger-600">
                      {metrics.totalTrades - Math.round(metrics.totalTrades * metrics.winRate / 100)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Initial Balance:</span>
                    <span className="font-medium">{formatCurrency(10000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Final Balance:</span>
                    <span className="font-medium">{formatCurrency(10000 + metrics.totalReturn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Return:</span>
                    <span className={`font-medium ${metrics.totalReturn >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                      {formatPercent(metrics.totalReturnPercent)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'trades' && (
          <TradesList trades={sampleTrades} />
        )}
      </main>
    </div>
  );
}

export default App;