'use client';

import { useState } from 'react';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input, { Select } from '@/components/ui/Input';
import EmailModal from '@/components/reports/EmailModal';
import { generateInvoicePDF } from '@/components/invoices/InvoicePDFGenerator';
import { 
  invoices,
  projects,
  lenders,
  formatCurrency, 
  formatDate,
  getProjectById,
  updateInvoiceStatusOnSent,
  updateInvoiceStatusOnPaid
} from '@/lib/data';
import { Invoice, InvoiceStatus } from '@/types';
import { processPendingReminders } from '@/lib/invoiceReminders';

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [sendingInvoice, setSendingInvoice] = useState<Invoice | null>(null);
  const [invoiceSent, setInvoiceSent] = useState<string[]>([]);
  const [processingReminders, setProcessingReminders] = useState(false);
  const [reminderResult, setReminderResult] = useState<string | null>(null);

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const project = getProjectById(invoice.projectId);
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle reminder processing
  const handleProcessReminders = async () => {
    setProcessingReminders(true);
    setReminderResult(null);
    
    try {
      const result = await processPendingReminders(invoices);
      setReminderResult(
        `✅ Processed ${result.processed} invoices: ${result.sent} sent, ${result.skipped} skipped` +
        (result.errors.length > 0 ? ` (${result.errors.length} errors)` : '')
      );
    } catch (error) {
      setReminderResult(`❌ Error processing reminders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessingReminders(false);
    }
  };

  // Calculate totals
  const totalAmount = filteredInvoices.reduce((s, i) => s + i.amount, 0);
  const paidAmount = filteredInvoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const overdueAmount = filteredInvoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);
  const pendingAmount = filteredInvoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0);
  
  // Calculate this month's paid
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const paidThisMonth = filteredInvoices
    .filter(i => {
      if (i.status !== 'Paid' || !i.paidDate) return false;
      const paidDate = new Date(i.paidDate);
      return paidDate.getMonth() === thisMonth && paidDate.getFullYear() === thisYear;
    })
    .reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Invoices</h1>
          <p className="text-sm text-text-muted mt-1">
            {filteredInvoices.length} invoices • {formatCurrency(totalAmount)} total
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={handleProcessReminders}
            disabled={processingReminders}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {processingReminders ? 'Processing...' : 'Send Reminders'}
          </Button>
          <Button variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Generate Invoices
          </Button>
        </div>
      </div>

      {reminderResult && (
        <div className="p-4 bg-accent-success/10 border border-accent-success/20 rounded-lg">
          <p className="text-sm text-accent-success">{reminderResult}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-text-primary">{formatCurrency(totalAmount)}</p>
          <p className="text-xs text-text-muted mt-1">Total</p>
        </Card>
        <Card className="text-center bg-accent-success/5 border-accent-success/20">
          <p className="text-2xl font-bold text-accent-success">{formatCurrency(paidAmount)}</p>
          <p className="text-xs text-text-muted mt-1">Paid</p>
        </Card>
        <Card className="text-center bg-accent-success/5 border-accent-success/20">
          <p className="text-2xl font-bold text-accent-success">{formatCurrency(paidThisMonth)}</p>
          <p className="text-xs text-text-muted mt-1">Paid This Month</p>
        </Card>
        <Card className="text-center bg-accent-warning/5 border-accent-warning/20">
          <p className="text-2xl font-bold text-accent-warning">{formatCurrency(pendingAmount)}</p>
          <p className="text-xs text-text-muted mt-1">Pending</p>
        </Card>
        <Card className="text-center bg-accent-danger/5 border-accent-danger/20">
          <p className="text-2xl font-bold text-accent-danger">{formatCurrency(overdueAmount)}</p>
          <p className="text-xs text-text-muted mt-1">Overdue</p>
        </Card>
      </div>

      {/* Outstanding Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Total Outstanding</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(pendingAmount + overdueAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted">
              {filteredInvoices.filter(i => i.status === 'Pending').length} pending • {' '}
              <span className="text-accent-danger font-medium">
                {filteredInvoices.filter(i => i.status === 'Overdue').length} overdue
              </span>
            </p>
            <p className="text-xs text-text-muted mt-1">
              Last payment: {formatDate(new Date().toISOString().split('T')[0])}
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search invoices..."
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
              { value: 'Pending', label: 'Pending' },
              { value: 'Paid', label: 'Paid' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
          />
        </div>
      </Card>

      {/* Invoices Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Project</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Type</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Sent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Due Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredInvoices.map((invoice) => (
                <InvoiceRow 
                  key={invoice.id} 
                  invoice={invoice} 
                  onMarkPaid={() => setSelectedInvoice(invoice)}
                  onSendInvoice={() => setSendingInvoice(invoice)}
                  isSent={invoiceSent.includes(invoice.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto mb-4 text-text-muted opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-text-muted">No invoices found</p>
          </div>
        )}
      </Card>

      {/* Mark as Paid Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader title="Mark as Paid" />
            <div className="space-y-4">
              <p className="text-sm text-text-muted">
                Mark invoice <span className="font-medium text-text-primary">{selectedInvoice.invoiceNumber}</span> as paid?
              </p>
              <div className="bg-surface-secondary rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Amount</span>
                  <span className="font-semibold text-text-primary">{formatCurrency(selectedInvoice.amount)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => {
                    // Update invoice status to Paid
                    updateInvoiceStatusOnPaid(selectedInvoice.id);
                    setSelectedInvoice(null);
                  }}
                >
                  ✓ Mark as Paid
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Send Invoice Modal */}
      {sendingInvoice && (
        <EmailModal
          isOpen={true}
          onClose={() => setSendingInvoice(null)}
          onSend={() => {
            setInvoiceSent(prev => [...prev, sendingInvoice.id]);
            // Update invoice status with sent date
            updateInvoiceStatusOnSent(sendingInvoice.id);
            setSendingInvoice(null);
          }}
          type="invoice"
          data={{
            to: getProjectById(sendingInvoice.projectId)?.lender.email || '',
            projectName: getProjectById(sendingInvoice.projectId)?.name || '',
            drawNumber: parseInt(sendingInvoice.drawId) || 1,
            invoiceNumber: sendingInvoice.invoiceNumber,
            amount: sendingInvoice.amount,
            dueDate: sendingInvoice.dueDate,
            inspectionDate: sendingInvoice.inspectionDate,
          }}
        />
      )}
    </div>
  );
}

function InvoiceRow({ invoice, onMarkPaid, onSendInvoice, isSent }: { 
  invoice: Invoice; 
  onMarkPaid: () => void;
  onSendInvoice: () => void;
  isSent: boolean;
}) {
  const project = getProjectById(invoice.projectId);
  const isOverdue = invoice.status === 'Overdue' || 
    (invoice.status === 'Pending' && new Date(invoice.dueDate) < new Date());

  const getStatusVariant = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Overdue': return 'danger';
      default: return 'warning';
    }
  };

  const daysOverdue = invoice.status === 'Overdue' || (invoice.status === 'Pending' && new Date(invoice.dueDate) < new Date())
    ? Math.floor((Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <tr className="hover:bg-surface-elevated transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-text-primary">{invoice.invoiceNumber}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-text-primary">{project?.name}</p>
        <p className="text-xs text-text-muted">{project?.projectNumber}</p>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-text-muted">{invoice.serviceType}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <p className="text-sm font-semibold text-text-primary">{formatCurrency(invoice.amount)}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-text-muted">
          {invoice.sentDate ? formatDate(invoice.sentDate) : '—'}
        </p>
      </td>
      <td className="px-4 py-3">
        <p className={`text-sm ${isOverdue ? 'text-accent-danger font-medium' : 'text-text-muted'}`}>
          {formatDate(invoice.dueDate)}
        </p>
        {daysOverdue > 0 && (
          <p className="text-xs text-accent-danger">{daysOverdue} days overdue</p>
        )}
      </td>
      <td className="px-4 py-3">
        <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
        {invoice.paidDate && (
          <p className="text-xs text-text-muted mt-1">Paid: {formatDate(invoice.paidDate)}</p>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          {!isSent && invoice.status !== 'Paid' && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={onSendInvoice}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send
            </Button>
          )}
          {isSent && (
            <span className="text-xs text-accent-success flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sent
            </span>
          )}
          {invoice.status !== 'Paid' && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={onMarkPaid}
            >
              Mark Paid
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}