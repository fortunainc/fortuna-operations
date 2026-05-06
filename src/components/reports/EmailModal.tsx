'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  type: 'report' | 'invoice';
  data: {
    to: string;
    projectName: string;
    drawNumber: number;
    projectNumber?: string;
    invoiceNumber?: string;
    amount?: number;
    dueDate?: string;
    inspectionDate?: string;
    reportSentDate?: string;
  };
}

export default function EmailModal({ 
  isOpen, 
  onClose, 
  onSend, 
  type, 
  data 
}: EmailModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState(data.to);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const getSubject = () => {
    if (type === 'report') {
      return `Draw Report – ${data.projectName} – Draw #${data.drawNumber}`;
    }
    return `Invoice – ${data.projectName} – Draw #${data.drawNumber}`;
  };

  const getDefaultBody = () => {
    if (type === 'report') {
      return `Attached is the draw inspection report for ${data.projectName}, Draw #${data.drawNumber}.

Please let me know if you need any additional detail or clarification.

Best,
Fortuna Draw Group`;
    }
    
    return `Please find attached the invoice for ${data.projectName}, Draw #${data.drawNumber}.

Invoice Details:
• Invoice #: ${data.invoiceNumber}
• Amount: $${data.amount?.toLocaleString()}
• Due Date: ${data.dueDate}

If you have any questions, please don't hesitate to reach out.

Best,
Fortuna Draw Group`;
  };

  const handleSend = async () => {
    setIsSending(true);
    
    // In production, this would call an API endpoint to send the email
    // For now, we simulate the send
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSend();
    setIsSending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            {type === 'report' ? '📧 Send Report' : '📄 Send Invoice'}
          </h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* To Field */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              To
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="lender@example.com"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Subject
            </label>
            <input
              type="text"
              value={getSubject()}
              readOnly
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface-secondary text-text-muted"
            />
          </div>

          {/* Body Preview */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Message
            </label>
            <textarea
              value={getDefaultBody() + (notes ? '\n\n' + notes : '')}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
            />
          </div>

          {/* Attachment Preview */}
          <div className="bg-surface-secondary rounded-lg p-3">
            <p className="text-xs text-text-muted mb-2">Attachment</p>
            <div className="flex items-center gap-3 bg-card rounded-lg p-2 border border-border">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {type === 'report' 
                    ? `Draw_${data.drawNumber}_Report_${data.projectName.replace(/\s+/g, '_')}.pdf`
                    : `Invoice_${data.invoiceNumber}.pdf`
                  }
                </p>
                <p className="text-xs text-text-muted">PDF Document</p>
              </div>
            </div>
          </div>

          {/* Invoice Details (if invoice) */}
          {type === 'invoice' && (
            <div className="bg-surface-secondary rounded-lg p-3">
              <p className="text-xs text-text-muted mb-2">Invoice Summary</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Invoice #</span>
                  <span className="font-medium text-text-primary">{data.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Amount</span>
                  <span className="font-medium text-text-primary">${data.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Due Date</span>
                  <span className="font-medium text-text-primary">{data.dueDate}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-border">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="flex-1"
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSend}
            className="flex-1"
            disabled={isSending || !email}
          >
            {isSending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send {type === 'report' ? 'Report' : 'Invoice'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}