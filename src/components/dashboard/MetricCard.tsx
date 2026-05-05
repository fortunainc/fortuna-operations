'use client';

import Card from '@/components/ui/Card';
import ProgressBar, { CircularProgress } from '@/components/ui/ProgressBar';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
  progress?: number;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  progress, 
  icon,
  variant = 'default' 
}: MetricCardProps) {
  const variantStyles = {
    default: 'text-text-primary',
    success: 'text-accent-success',
    warning: 'text-accent-warning',
    danger: 'text-accent-danger',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-muted mb-1">{title}</p>
          <p className={`text-2xl font-bold ${variantStyles[variant]}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-text-muted mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${trend.value >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-text-muted">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-surface-elevated rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-4">
          <ProgressBar 
            value={progress} 
            color={variant === 'default' ? 'primary' : variant}
          />
        </div>
      )}
    </Card>
  );
}

interface PriorityItemProps {
  type: 'draw' | 'invoice' | 'project' | 'inspection' | 'document' | 'risk';
  title: string;
  description: string;
  status: 'overdue' | 'due_today' | 'upcoming' | 'at_risk';
  action?: string;
  onClick?: () => void;
}

export function PriorityItem({ 
  type, 
  title, 
  description, 
  status, 
  action, 
  onClick 
}: PriorityItemProps) {
  const statusColors = {
    overdue: 'bg-accent-danger/20 text-accent-danger border-accent-danger/30',
    due_today: 'bg-accent-warning/20 text-accent-warning border-accent-warning/30',
    upcoming: 'bg-accent-info/20 text-accent-info border-accent-info/30',
    at_risk: 'bg-accent-danger/20 text-accent-danger border-accent-danger/30',
  };

  const typeIcons = {
    draw: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    invoice: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    project: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    inspection: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    risk: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    document: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  };

  const statusLabels = {
    overdue: 'Overdue',
    due_today: 'Due Today',
    upcoming: 'Upcoming',
    at_risk: 'At Risk',
  };

  return (
    <div 
      className="flex items-center gap-4 p-4 bg-surface-elevated rounded-lg border border-border-subtle hover:border-border-default transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="p-2 bg-surface rounded-lg text-text-muted">
        {typeIcons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{title}</p>
        <p className="text-xs text-text-muted truncate">{description}</p>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
      {action && (
        <span className="text-xs text-accent-primary font-medium">{action} →</span>
      )}
    </div>
  );
}

interface ActivityItemProps {
  type: 'draw_approved' | 'invoice_paid' | 'project_created' | 'inspection_complete';
  message: string;
  timestamp: string;
  user?: string;
}

export function ActivityItem({ type, message, timestamp, user }: ActivityItemProps) {
  const typeColors = {
    draw_approved: 'bg-accent-success',
    invoice_paid: 'bg-accent-info',
    project_created: 'bg-accent-primary',
    inspection_complete: 'bg-accent-warning',
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border-subtle last:border-0">
      <div className={`w-2 h-2 rounded-full mt-2 ${typeColors[type]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary">{message}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-text-muted">{timestamp}</span>
          {user && (
            <>
              <span className="text-xs text-text-muted">•</span>
              <span className="text-xs text-text-muted">{user}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}