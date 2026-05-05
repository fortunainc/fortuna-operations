import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export default function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  dot = false 
}: BadgeProps) {
  const variants = {
    default: 'bg-[#6b8cae]/10 text-[#6b8cae]',
    success: 'bg-green-400/10 text-green-400',
    warning: 'bg-yellow-400/10 text-yellow-400',
    danger: 'bg-red-400/10 text-red-400',
    info: 'bg-blue-400/10 text-blue-400',
    muted: 'bg-gray-400/10 text-gray-400',
  };

  const dotColors = {
    default: 'bg-[#6b8cae]',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    muted: 'bg-gray-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

// Project Status Badge
interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    'On Track': { variant: 'success', label: 'On Track' },
    'At Risk': { variant: 'warning', label: 'At Risk' },
    'Behind': { variant: 'danger', label: 'Behind' },
    'Complete': { variant: 'info', label: 'Complete' },
    'Requested': { variant: 'muted', label: 'Requested' },
    'Docs Received': { variant: 'info', label: 'Docs Received' },
    'Inspection Scheduled': { variant: 'default', label: 'Scheduled' },
    'Inspected': { variant: 'default', label: 'Inspected' },
    'Report Sent': { variant: 'default', label: 'Report Sent' },
    'Funds Released': { variant: 'success', label: 'Funds Released' },
    'On Hold': { variant: 'warning', label: 'On Hold' },
    'Pending': { variant: 'warning', label: 'Pending' },
    'Paid': { variant: 'success', label: 'Paid' },
    'Overdue': { variant: 'danger', label: 'Overdue' },
  };

  const config = statusConfig[status] || { variant: 'muted' as const, label: status };

  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}