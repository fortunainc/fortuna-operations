import { Invoice, Draw, Project } from '@/types';

// Invoice generation utility
export function generateInvoiceFromDraw(
  draw: Draw,
  project: Project,
  serviceType: 'Standard' | 'Core' | 'High-Sensitivity' | 'Rush' = 'Standard'
): Partial<Invoice> {
  // Fee structure based on service type
  const feeStructure = {
    'Standard': { baseFee: 350, perUnit: 0 },
    'Core': { baseFee: 450, perUnit: 0 },
    'High-Sensitivity': { baseFee: 600, perUnit: 0 },
    'Rush': { baseFee: 500, perUnit: 0 },
  };

  const fees = feeStructure[serviceType];
  
  // Generate invoice number: INV-YYYY-MM-XXXX
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  const invoiceNumber = `INV-${year}-${month}-${random}`;

  // Due date is Net 30
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  return {
    invoiceNumber,
    projectId: project.id,
    drawId: draw.id,
    serviceType,
    amount: fees.baseFee,
    inspectionDate: draw.inspectionDate || new Date().toISOString().split('T')[0],
    reportSentDate: draw.reportSentDate || new Date().toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    sentDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Check if invoice should be auto-generated
export function shouldGenerateInvoice(previousStatus: string, newStatus: string): boolean {
  return previousStatus !== 'Report Sent' && newStatus === 'Report Sent';
}

// Calculate days overdue
export function calculateDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = now.getTime() - due.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

// Update invoice status based on dates
export function getUpdatedInvoiceStatus(invoice: Invoice): InvoiceStatus {
  if (invoice.paidDate) return 'Paid';
  if (calculateDaysOverdue(invoice.dueDate) > 0) return 'Overdue';
  return 'Pending';
}

// Format invoice for PDF
export function formatInvoiceForPDF(invoice: Invoice, project: Project): {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  from: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  to: {
    name: string;
    company: string;
    address: string;
    email: string;
  };
  items: {
    description: string;
    amount: number;
  }[];
  total: number;
  notes: string;
} {
  return {
    invoiceNumber: invoice.invoiceNumber,
    date: formatDate(invoice.sentDate || invoice.createdAt),
    dueDate: formatDate(invoice.dueDate),
    from: {
      name: 'Fortuna Draw Group',
      address: '123 Construction Way, Suite 100',
      email: 'billing@fortunadrawgroup.com',
      phone: '(555) 123-4567',
    },
    to: {
      name: project.lender.contactName,
      company: project.lender.name,
      address: project.address,
      email: project.lender.email,
    },
    items: [
      {
        description: `Draw Inspection Services - ${project.name} (Draw #${invoice.drawId})`,
        amount: invoice.amount,
      },
    ],
    total: invoice.amount,
    notes: `Service Type: ${invoice.serviceType}\nDraw Number: ${invoice.drawId}\nInspection Date: ${formatDate(invoice.inspectionDate)}`,
  };
}

function formatDate(date: string | undefined): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue';