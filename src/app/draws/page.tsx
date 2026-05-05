'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input, { Select } from '@/components/ui/Input';
import { 
  draws, 
  projects, 
  formatCurrency, 
  formatDate,
  getProjectById
} from '@/lib/data';
import { Draw, DrawStatus } from '@/types';
import DrawStatusManager from '@/components/draws/DrawStatusManager';

const statusOrder: Record<DrawStatus, number> = {
  'Requested': 0,
  'Docs Received': 1,
  'Inspection Scheduled': 2,
  'Inspected': 3,
  'Report Sent': 4,
  'Funds Released': 5,
  'On Hold': 6,
};

export default function DrawsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter and sort draws
  const filteredDraws = draws
    .filter(draw => {
      const project = getProjectById(draw.projectId);
      const matchesSearch = 
        `Draw #${draw.drawNumber}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project?.projectNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || draw.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  // Group by status
  const groupedDraws = {
    needsAttention: filteredDraws.filter(d => 
      d.status === 'Requested' || d.status === 'Docs Received' || d.status === 'Inspection Scheduled'
    ),
    inProgress: filteredDraws.filter(d => 
      d.status === 'Inspected' || d.status === 'Report Sent'
    ),
    completed: filteredDraws.filter(d => 
      d.status === 'Funds Released' || d.status === 'On Hold'
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Draws</h1>
          <p className="text-sm text-text-muted mt-1">
            {filteredDraws.length} draws • {formatCurrency(filteredDraws.reduce((s, d) => s + d.requestedAmount, 0))} total requested
          </p>
        </div>
        <Button variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Draw
        </Button>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search draws..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'Requested', label: 'Requested' },
              { value: 'Docs Received', label: 'Docs Received' },
              { value: 'Inspection Scheduled', label: 'Inspection Scheduled' },
              { value: 'Inspected', label: 'Inspected' },
              { value: 'Report Sent', label: 'Report Sent' },
              { value: 'Funds Released', label: 'Funds Released' },
              { value: 'On Hold', label: 'On Hold' },
            ]}
          />
        </div>
      </Card>

      {/* Draws by Status */}
      {statusFilter === 'all' ? (
        <div className="space-y-6">
          {/* Needs Attention */}
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-warning"></span>
              Needs Attention ({groupedDraws.needsAttention.length})
            </h2>
            <div className="space-y-3">
              {groupedDraws.needsAttention.map(draw => (
                <DrawCard key={draw.id} draw={draw} />
              ))}
              {groupedDraws.needsAttention.length === 0 && (
                <p className="text-text-muted text-center py-4">No draws need attention</p>
              )}
            </div>
          </div>

          {/* In Progress */}
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-info"></span>
              In Progress ({groupedDraws.inProgress.length})
            </h2>
            <div className="space-y-3">
              {groupedDraws.inProgress.map(draw => (
                <DrawCard key={draw.id} draw={draw} />
              ))}
              {groupedDraws.inProgress.length === 0 && (
                <p className="text-text-muted text-center py-4">No draws in progress</p>
              )}
            </div>
          </div>

          {/* Completed */}
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-success"></span>
              Completed ({groupedDraws.completed.length})
            </h2>
            <div className="space-y-3">
              {groupedDraws.completed.map(draw => (
                <DrawCard key={draw.id} draw={draw} />
              ))}
              {groupedDraws.completed.length === 0 && (
                <p className="text-text-muted text-center py-4">No completed draws</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDraws.map(draw => (
            <DrawCard key={draw.id} draw={draw} />
          ))}
        </div>
      )}
    </div>
  );
}

function DrawCard({ draw }: { draw: Draw }) {
  const router = useRouter();
  const [currentDraw, setCurrentDraw] = useState(draw);
  const project = getProjectById(currentDraw.projectId);
  
  const getStatusColor = (status: DrawStatus) => {
    switch (status) {
      case 'Funds Released': return 'success';
      case 'Report Sent': return 'info';
      case 'Inspection Scheduled': return 'warning';
      case 'Inspected': return 'default';
      case 'On Hold': return 'danger';
      default: return 'default';
    }
  };

  const handleGenerateReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/reports/${currentDraw.projectId}/${currentDraw.id}`);
  };

  const handleStatusUpdate = (updatedDraw: Draw) => {
    // Update local state
    const drawIndex = draws.findIndex(d => d.id === updatedDraw.id);
    if (drawIndex !== -1) {
      draws[drawIndex] = updatedDraw;
    }
    setCurrentDraw(updatedDraw);
  };

  return (
    <Card hover className="cursor-pointer">
      <div className="flex items-center gap-4">
        {/* Draw Number */}
        <div className="w-12 h-12 rounded-lg bg-accent-primary/20 flex items-center justify-center">
          <span className="text-lg font-bold text-accent-primary">#{currentDraw.drawNumber}</span>
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-text-primary">Draw #{currentDraw.drawNumber}</h3>
            {currentDraw.riskFlags.length > 0 && (
              <svg className="w-4 h-4 text-accent-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <p className="text-xs text-text-muted truncate">
            {project?.name} ({project?.projectNumber})
          </p>
        </div>

        {/* Amount */}
        <div className="text-right">
          <p className="text-sm font-semibold text-text-primary">{formatCurrency(currentDraw.requestedAmount)}</p>
          {currentDraw.approvedAmount && currentDraw.approvedAmount !== currentDraw.requestedAmount && (
            <p className="text-xs text-accent-success">{formatCurrency(currentDraw.approvedAmount)} approved</p>
          )}
        </div>

        {/* Timeline */}
        <div className="hidden md:flex items-center gap-2 text-xs text-text-muted">
          <span>Requested: {formatDate(currentDraw.requestedDate)}</span>
          {currentDraw.inspectionDate && (
            <>
              <span>•</span>
              <span>Inspection: {formatDate(currentDraw.inspectionDate)}</span>
            </>
          )}
        </div>

        {/* Status Manager */}
        <DrawStatusManager draw={currentDraw} onUpdate={handleStatusUpdate} />
        
        {/* Generate Report Button */}
        <Button 
          variant="primary" 
          size="sm"
          onClick={handleGenerateReport}
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Report
        </Button>
      </div>

      {/* Progress Bar (if applicable) */}
      {currentDraw.percentComplete !== undefined && (
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-text-muted">Project Completion</span>
            <span className="text-text-primary font-medium">{currentDraw.percentComplete}%</span>
          </div>
          <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-primary rounded-full transition-all duration-300"
              style={{ width: `${currentDraw.percentComplete}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}