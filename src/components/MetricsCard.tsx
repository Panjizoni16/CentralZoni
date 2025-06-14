import React from 'react';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  change, 
  trend = 'neutral',
  icon 
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success-600';
      case 'down': return 'text-danger-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;