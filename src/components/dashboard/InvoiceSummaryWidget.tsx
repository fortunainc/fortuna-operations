'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate, getProjectById } from '@/lib/data';
import { invoices } from '@/lib/data';
import Link from 'next/link';

export default function InvoiceSummaryWidget() {
  // Calculate invoice statistics
  const paidInvoices = invoices.filter(i => i.status === 'Paid');
  const pendingInvoices = invoices.filter(i => i.status === 'Pending');
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue');
  
  const totalOutstanding = pendingInvoices.reduce((s, i) => s + i.amount, 0) + 
                          overdueInvoices.reduce((s, i) => s + i.amount, 0);
  
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const paidThisMonth = paidInvoices
    .filter(i => {
      if (!i.paidDate) return false;
      const paidDate = new Date(i.paidDate);
      return paidDate.getMonth() === thisMonth && paidDate.getFullYear() === thisYear;
    })
    .reduce((s, i) => s + i.amount, 0);

  // Get recent overdue invoices
  const recentOverdue = overdueInvoices
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 3);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Invoice Summary</h3>
        <Link href="/invoices">
          <Button variant="ghost" size="sm">
            View All →
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-surface-secondary rounded-lg">
          <p className="text-xl font-bold text-accent-danger">{overdueInvoices.length}</p>
          <p className="text-xs text-text-muted">Overdue</p>
        </div>
        <div className="text-center p-3 bg-surface-secondary rounded-lg">
          <p className="text-xl font-bold text-accent-warning">{pendingInvoices.length}</p>
          <p className="text-xs text-text-muted">Pending</p>
        </div>
        <div className="text-center p-3 bg-surface-secondary rounded-lg">
          <p className="text-xl font-bold text-accent-success">{formatCurrency(paidThisMonth)}</p>
          <p className="text-xs text-text-muted">Paid This Month</p>
        </div>
      </div>

      {/* Outstanding Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wide">Total Outstanding</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalOutstanding)}</p>
          </div>
          {overdueInvoices.length > 0 && (
            <div className="text-right">
              <Badge variant="danger">{overdueInvoices.length} Overdue</Badge>
              <p className="text-xs text-text-muted mt-1">Requires attention</p>
            </div>
          )}
        </div>
      </div>

      {/* Overdue Invoices List */}
      {recentOverdue.length > 0 && (
        <div>
          <p className="text-sm font-medium text-text-primary mb-2">Overdue Invoices</p>
          <div className="space-y-2">
            {recentOverdue.map(invoice => {
              const project = getProjectById(invoice.projectId);
              const daysOverdue = Math.floor(
                (Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between p-2 bg-accent-danger/5 rounded-lg border border-accent-danger/10"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {project?.name}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-semibold text-accent-danger">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p className="text-xs text-accent-danger">
                      {daysOverdue}d overdue
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Overdue */}
      {overdueInvoices.length === 0 && (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">✓</div>
          <p className="text-sm text-text-muted">All invoices are current</p>
        </div>
      )}
    </Card>
  );
}