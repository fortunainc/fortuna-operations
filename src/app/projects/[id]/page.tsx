'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  getProjectById,
  getDrawsByProject,
  getInvoicesByProject,
  formatCurrency,
  formatDate,
  calculateProjectProgress,
} from '@/lib/data';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const project = getProjectById(projectId);
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Project Not Found</h1>
        <Link href="/projects">
          <Button variant="secondary">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const draws = getDrawsByProject(projectId);
  const invoices = getInvoicesByProject(projectId);
  const progress = calculateProjectProgress(projectId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-text-muted font-mono">{project.projectNumber}</span>
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
          <h1 className="text-2xl font-bold text-text-primary">{project.name}</h1>
          <p className="text-text-muted mt-1">{project.address}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Button>
          <Button variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Draw
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-primary">{formatCurrency(project.loanAmount)}</p>
          <p className="text-xs text-text-muted mt-1">Loan Amount</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-success">{progress}%</p>
          <p className="text-xs text-text-muted mt-1">Complete</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-text-primary">{draws.length}/{project.numberOfDraws}</p>
          <p className="text-xs text-text-muted mt-1">Draws</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-text-primary">{formatDate(project.expectedEndDate)}</p>
          <p className="text-xs text-text-muted mt-1">Expected End</p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <Card>
            <CardHeader title="Project Progress" />
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">Overall Completion</span>
                <span className="text-sm font-semibold text-text-primary">{progress}%</span>
              </div>
              <ProgressBar 
                value={progress} 
                color={
                  project.status === 'On Track' ? 'success' : 
                  project.status === 'At Risk' ? 'warning' : 
                  project.status === 'Behind' ? 'danger' : 'primary'
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-surface-elevated rounded-lg">
                <p className="text-sm font-semibold text-text-primary">{formatCurrency(project.totalBudget)}</p>
                <p className="text-xs text-text-muted">Total Budget</p>
              </div>
              <div className="p-3 bg-surface-elevated rounded-lg">
                <p className="text-sm font-semibold text-text-primary">{project.expectedDuration} days</p>
                <p className="text-xs text-text-muted">Duration</p>
              </div>
              <div className="p-3 bg-surface-elevated rounded-lg">
                <p className="text-sm font-semibold text-text-primary">{project.projectType}</p>
                <p className="text-xs text-text-muted">Type</p>
              </div>
            </div>
          </Card>

          {/* Draw Timeline */}
          <Card>
            <CardHeader 
              title="Draw Timeline" 
              action={
                <Button variant="ghost" size="sm">View All →</Button>
              }
            />
            <div className="space-y-4">
              {draws.length === 0 ? (
                <p className="text-text-muted text-center py-4">No draws yet</p>
              ) : (
                draws.map((draw) => (
                  <div 
                    key={draw.id}
                    className="flex items-center gap-4 p-3 bg-surface-elevated rounded-lg hover:bg-surface-hover transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-accent-primary">{draw.drawNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">Draw #{draw.drawNumber}</p>
                      <p className="text-xs text-text-muted">
                        {formatCurrency(draw.requestedAmount)}
                        {draw.approvedAmount && draw.approvedAmount !== draw.requestedAmount && 
                          ` → ${formatCurrency(draw.approvedAmount)} approved`
                        }
                      </p>
                    </div>
                    <Badge 
                      variant={
                        draw.status === 'Funds Released' ? 'success' :
                        draw.status === 'Report Sent' ? 'info' :
                        draw.status === 'Inspection Scheduled' ? 'warning' : 'default'
                      }
                    >
                      {draw.status}
                    </Badge>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => router.push(`/reports/${project.id}/${draw.id}`)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Report
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contacts */}
          <Card>
            <CardHeader title="Contacts" />
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted mb-1">Lender</p>
                <p className="text-sm font-medium text-text-primary">{project.lender.name}</p>
                <p className="text-xs text-text-muted">{project.lender.contactName}</p>
                <p className="text-xs text-accent-primary">{project.lender.email}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Developer</p>
                <p className="text-sm font-medium text-text-primary">{project.developer.name}</p>
                <p className="text-xs text-text-muted">{project.developer.contactName}</p>
                <p className="text-xs text-accent-primary">{project.developer.email}</p>
              </div>
            </div>
          </Card>

          {/* Invoices */}
          <Card>
            <CardHeader 
              title="Invoices" 
              action={
                <Button variant="ghost" size="sm">View All →</Button>
              }
            />
            <div className="space-y-3">
              {invoices.length === 0 ? (
                <p className="text-text-muted text-center py-4">No invoices yet</p>
              ) : (
                invoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-text-muted">{formatCurrency(invoice.amount)}</p>
                    </div>
                    <Badge 
                      variant={
                        invoice.status === 'Paid' ? 'success' :
                        invoice.status === 'Overdue' ? 'danger' : 'warning'
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Portal Access */}
          <Card>
            <CardHeader title="Lender Portal" />
            <div className="space-y-3">
              <p className="text-sm text-text-muted">
                Share this link with the lender for read-only access to project updates.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`portal.fortunadrawgroup.com/${project.portalToken}`}
                  className="flex-1 bg-surface-elevated border border-border-subtle rounded px-3 py-2 text-xs text-text-muted"
                />
                <Button variant="secondary" size="sm">
                  Copy
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}