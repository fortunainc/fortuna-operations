import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  onClick 
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div 
      className={`
        bg-[#0a1628] border border-[#162a47] rounded-xl
        ${hover ? 'hover:border-[#6b8cae]/50 hover:shadow-lg hover:shadow-[#6b8cae]/5 transition-all cursor-pointer' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-[#8ba4c4] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

export function CardRow({ label, value, icon }: CardRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#162a47] last:border-0">
      <span className="text-sm text-[#8ba4c4] flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  );
}

interface CardGridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
}

export function CardGrid({ children, cols = 2 }: CardGridProps) {
  const colStyles = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={`grid ${colStyles[cols]} gap-4`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatCard({ label, value, icon, trend, trendValue, color = 'default' }: StatCardProps) {
  const colorStyles = {
    default: 'text-white',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
  };

  const trendStyles = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-[#8ba4c4]',
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#8ba4c4] mb-1">{label}</p>
          <p className={`text-2xl font-bold ${colorStyles[color]}`}>{value}</p>
          {trend && trendValue && (
            <p className={`text-xs mt-1 ${trendStyles[trend]}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-[#0f1f35] rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}