'use client';

import { MetricCard, PriorityItem, ActivityItem } from '@/components/dashboard/MetricCard';
import CEODailySummary from '@/components/dashboard/CEODailySummary';
import InvoiceSummaryWidget from '@/components/dashboard/InvoiceSummaryWidget';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge, { StatusBadge } from '@/components/ui/Badge';
import { 
  getDashboardMetrics, 
  getPriorityItems, 
  projects, 
  formatCurrency 
} from '@/lib/data';

export default function DashboardPage() {
  const metrics = getDashboardMetrics();
  const priorityItems = getPriorityItems();

  // Recent activity (simulated)
  const recentActivity = [
    { type: 'draw_approved' as const, message: 'Draw #3 approved for Sunset Apartments', timestamp: '2 hours ago', user: 'Mike Chen' },
    { type: 'invoice_paid' as const, message: 'Invoice #1004 paid by First National Bank', timestamp: '4 hours ago', user: 'System' },
    { type: 'inspection_complete' as const, message: 'Inspection completed for Harbor Point Phase 2', timestamp: '6 hours ago', user: 'Sarah Johnson' },
    { type: 'project_created' as const, message: 'New project "Metro Center Mall" created', timestamp: '1 day ago', user: 'Admin' },
  ];

  // Top projects by loan amount
  const topProjects = [...projects]
    .sort((a, b) => b.loanAmount - a.loanAmount)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Verified draw reporting system. Welcome back. Here's what needs attention today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </Button>
          <Button variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Projects"
          value={metrics.activeProjects}
          subtitle={`${metrics.totalProjects} total`}
          icon={
            <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <MetricCard
          title="Pending Draws"
          value={metrics.pendingDraws}
          subtitle={`${formatCurrency(metrics.totalDrawAmount)} total`}
          variant="warning"
          icon={
            <svg className="w-5 h-5 text-accent-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <MetricCard
          title="Overdue Invoices"
          value={metrics.overdueInvoices}
          subtitle={`${formatCurrency(metrics.unpaidInvoiceTotal)} unpaid`}
          variant={metrics.overdueInvoices > 0 ? 'danger' : 'success'}
          icon={
            <svg className="w-5 h-5 text-accent-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Inspections This Week"
          value={metrics.upcomingInspections}
          subtitle="scheduled"
          icon={
            <svg className="w-5 h-5 text-accent-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Queue */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader 
              title="Priority Queue" 
              subtitle="What needs attention today" 
            />
            <div className="space-y-3">
              {priorityItems.length > 0 ? (
                priorityItems.map((item, index) => {
                  const status = item.priority === 'high' ? 'overdue' : item.priority === 'medium' ? 'upcoming' : 'due_today';
                  return (
                    <PriorityItem
                      key={index}
                      type={item.type === 'document' ? 'draw' : item.type}
                      title={item.title}
                      description={item.description}
                      status={status}
                      action="View"
                    />
                  );
                })
              ) : (
                <div className="text-center py-8 text-text-muted">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>All caught up! No urgent items.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader title="Recent Activity" />
            <div className="max-h-80 overflow-y-auto">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Invoice Summary & Projects Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Summary Widget */}
        <div className="lg:col-span-1 space-y-6">
          <CEODailySummary />
          <InvoiceSummaryWidget />
        </div>
        
        {/* Top Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Top Projects by Loan Amount" />
            <div className="space-y-4">
            {topProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg hover:bg-surface-hover transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{project.name}</p>
                  <p className="text-xs text-text-muted">{project.lender.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary">{formatCurrency(project.loanAmount)}</p>
                  <Badge 
                    variant={
                      project.status === 'On Track' ? 'success' : 
                      project.status === 'At Risk' ? 'warning' : 
                      project.status === 'Behind' ? 'danger' : 'info'
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <Button variant="ghost" fullWidth>
              View All Projects →
            </Button>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader title="Portfolio Overview" />
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-elevated rounded-lg text-center">
              <p className="text-2xl font-bold text-accent-primary">{formatCurrency(metrics.portfolioValue)}</p>
              <p className="text-xs text-text-muted mt-1">Total Portfolio Value</p>
            </div>
            <div className="p-4 bg-surface-elevated rounded-lg text-center">
              <p className="text-2xl font-bold text-accent-success">{Math.round(metrics.avgCompletion)}%</p>
              <p className="text-xs text-text-muted mt-1">Avg Completion</p>
            </div>
            <div className="p-4 bg-surface-elevated rounded-lg text-center">
              <p className="text-2xl font-bold text-accent-warning">{metrics.projectsAtRisk}</p>
              <p className="text-xs text-text-muted mt-1">Projects At Risk</p>
            </div>
            <div className="p-4 bg-surface-elevated rounded-lg text-center">
              <p className="text-2xl font-bold text-accent-info">{metrics.totalDraws}</p>
              <p className="text-xs text-text-muted mt-1">Total Draws</p>
            </div>
          </div>
          
          {/* Draw Status Mini Chart */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-text-primary mb-3">Draw Status Distribution</h3>
            <div className="flex h-3 rounded-full overflow-hidden bg-surface-elevated">
              <div 
                className="bg-accent-success" 
                style={{ width: '45%' }}
                title="Approved"
              />
              <div 
                className="bg-accent-warning" 
                style={{ width: '30%' }}
                title="Pending"
              />
              <div 
                className="bg-accent-info" 
                style={{ width: '15%' }}
                title="In Review"
              />
              <div 
                className="bg-accent-danger" 
                style={{ width: '10%' }}
                title="Rejected"
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-text-muted">
              <span>Approved</span>
              <span>Pending</span>
              <span>In Review</span>
              <span>Rejected</span>
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}