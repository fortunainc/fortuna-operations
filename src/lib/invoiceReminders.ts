import { Invoice, InvoiceStatus } from '@/types';
import { projects } from './data';

export interface ReminderSchedule {
  invoiceId: string;
  daysOverdue: number;
  reminderType: 'first' | 'second' | 'final';
  scheduledDate: string;
  sentDate?: string;
  emailContent: string;
}

export interface InvoiceReminder {
  invoice: Invoice;
  daysOverdue: number;
  reminderType: 'first' | 'second' | 'final';
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  shouldSend: boolean;
}

/**
 * Calculate days overdue for an invoice
 */
export function getDaysOverdue(invoice: Invoice): number {
  const dueDate = new Date(invoice.dueDate);
  const today = new Date();
  const diffTime = today.getTime() - dueDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Determine reminder type based on days overdue
 */
export function getReminderType(daysOverdue: number): 'first' | 'second' | 'final' | null {
  if (daysOverdue >= 45) return 'final';  // 45+ days overdue (final reminder)
  if (daysOverdue >= 30) return 'second'; // 30 days overdue (second reminder)
  if (daysOverdue >= 15) return 'first';  // 15 days overdue (first reminder)
  return null;
}

/**
 * Generate reminder email content
 */
export function generateReminderEmail(
  invoice: Invoice,
  reminderType: 'first' | 'second' | 'final'
): { subject: string; body: string } {
  const project = projects.find(p => p.id === invoice.projectId);
  if (!project) {
    throw new Error(`Project ${invoice.projectId} not found`);
  }

  const daysOverdue = getDaysOverdue(invoice);
  const urgencyText = reminderType === 'final' ? 'FINAL' : reminderType === 'second' ? 'URGENT' : 'GENTLE';

  const subject = `${urgencyText} REMINDER: Invoice #${invoice.invoiceNumber} - ${project.name} (${daysOverdue} days overdue)`;

  const body = `Dear ${project.lender.name},

This is a ${reminderType === 'final' ? 'FINAL' : reminderType === 'second' ? 'SECOND' : 'first'} reminder regarding Invoice #${invoice.invoiceNumber} for ${project.name}.

Invoice Details:
• Invoice Number: ${invoice.invoiceNumber}
• Project: ${project.name}
• Service Type: ${invoice.serviceType}
• Amount: $${invoice.amount.toLocaleString()}
• Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
• Days Overdue: ${daysOverdue}

${reminderType === 'final' 
  ? '⚠️ IMPORTANT: This is your final reminder. If payment is not received within 7 days, we will need to pause services for this project.'
  : reminderType === 'second'
  ? 'Please address this payment at your earliest convenience to avoid any service interruptions.'
  : 'Please ensure payment is processed as soon as possible to avoid accumulating further delays.'
}

Payment Information:
• Bank: Fortuna Draw Group
• Account: [Account Number]
• Routing: [Routing Number]
• Reference: Invoice #${invoice.invoiceNumber}

If you have already sent payment, please disregard this notice and provide the payment reference number for our records.

If you have any questions or need to discuss payment arrangements, please contact us at billing@fortunadrawgroup.com.

Thank you for your prompt attention to this matter.

Best regards,
Fortuna Draw Group
billing@fortunadrawgroup.com`;

  return { subject, body };
}

/**
 * Get all invoices that need reminders
 */
export function getInvoicesNeedingReminders(allInvoices: Invoice[]): InvoiceReminder[] {
  return allInvoices
    .filter(invoice => 
      // Only send reminders for pending or overdue invoices that have been sent
      (invoice.status === 'Pending' || invoice.status === 'Overdue') &&
      invoice.sentDate &&
      !invoice.paidDate
    )
    .map(invoice => {
      const daysOverdue = getDaysOverdue(invoice);
      const reminderType = getReminderType(daysOverdue);
      
      if (!reminderType) {
        return null as any;
      }

      const project = projects.find(p => p.id === invoice.projectId);
      if (!project) {
        return null as any;
      }

      const { subject, body } = generateReminderEmail(invoice, reminderType);

      return {
        invoice,
        daysOverdue,
        reminderType,
        recipientEmail: project.lender.email,
        recipientName: project.lender.name,
        subject,
        body,
        shouldSend: true,
      };
    })
    .filter(reminder => reminder !== null);
}

/**
 * Check if an invoice reminder should be sent today
 */
export function shouldSendReminderToday(
  invoice: Invoice,
  lastReminderSentDate?: string
): boolean {
  const daysOverdue = getDaysOverdue(invoice);
  const reminderType = getReminderType(daysOverdue);
  
  if (!reminderType) {
    return false;
  }

  // If no reminder was sent before, send if past the threshold
  if (!lastReminderSentDate) {
    if (reminderType === 'first' && daysOverdue >= 15) return true;
    if (reminderType === 'second' && daysOverdue >= 30) return true;
    if (reminderType === 'final' && daysOverdue >= 45) return true;
    return false;
  }

  // Logic to prevent sending same reminder multiple times
  const lastSent = new Date(lastReminderSentDate);
  const daysSinceLastReminder = Math.floor((Date.now() - lastSent.getTime()) / (1000 * 60 * 60 * 24));

  // Don't send reminder if it was sent within the last 10 days
  if (daysSinceLastReminder < 10) {
    return false;
  }

  // Only send if we've crossed a new threshold
  if (reminderType === 'first' && daysOverdue >= 15 && daysSinceLastReminder >= 5) return true;
  if (reminderType === 'second' && daysOverdue >= 30 && daysSinceLastReminder >= 5) return true;
  if (reminderType === 'final' && daysOverdue >= 45) return true;

  return false;
}

/**
 * Store reminder history (in a real app, this would be in a database)
 */
export interface ReminderHistory {
  invoiceId: string;
  reminderType: 'first' | 'second' | 'final';
  sentDate: string;
}

const reminderHistory: ReminderHistory[] = [];

export function recordReminderSent(invoiceId: string, reminderType: 'first' | 'second' | 'final') {
  reminderHistory.push({
    invoiceId,
    reminderType,
    sentDate: new Date().toISOString(),
  });
}

export function getLastReminderForInvoice(invoiceId: string): ReminderHistory | undefined {
  return reminderHistory
    .filter(r => r.invoiceId === invoiceId)
    .sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime())[0];
}

/**
 * Simulate sending reminder emails (in a real app, this would use an email service)
 */
export async function sendReminderEmail(reminder: InvoiceReminder): Promise<boolean> {
  console.log('📧 Sending reminder email:', {
    to: reminder.recipientEmail,
    subject: reminder.subject,
    invoiceId: reminder.invoice.id,
  });

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Record that reminder was sent
  recordReminderSent(reminder.invoice.id, reminder.reminderType);

  console.log(`✅ Reminder sent to ${reminder.recipientEmail} for Invoice #${reminder.invoice.invoiceNumber}`);
  return true;
}

/**
 * Process all pending reminders (to be called by a scheduled job)
 */
export async function processPendingReminders(allInvoices: Invoice[]): Promise<{
  processed: number;
  sent: number;
  skipped: number;
  errors: string[];
}> {
  const reminders = getInvoicesNeedingReminders(allInvoices);
  
  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const reminder of reminders) {
    try {
      const lastReminder = getLastReminderForInvoice(reminder.invoice.id);
      
      if (shouldSendReminderToday(reminder.invoice, lastReminder?.sentDate)) {
        await sendReminderEmail(reminder);
        sent++;
      } else {
        console.log(`⏭️ Skipped reminder for Invoice #${reminder.invoice.invoiceNumber} (already sent recently)`);
        skipped++;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Invoice #${reminder.invoice.invoiceNumber}: ${errorMsg}`);
      console.error(`❌ Error processing reminder for Invoice #${reminder.invoice.invoiceNumber}:`, errorMsg);
    }
  }

  return {
    processed: reminders.length,
    sent,
    skipped,
    errors,
  };
}