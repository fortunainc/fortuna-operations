'use client';

import { Invoice, Project } from '@/types';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateInvoicePDF(invoice: Invoice, project: Project): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate invoice');
    return;
  }

  const html = generateInvoiceHTML(invoice, project);
  printWindow.document.write(html);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

function generateInvoiceHTML(invoice: Invoice, project: Project): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${invoice.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1f2937;
      background: #fff;
      padding: 40px;
    }
    
    @page {
      size: letter;
      margin: 0.5in;
    }
    
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .brand-logo {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 24px;
    }
    
    .brand-text {
      font-size: 24px;
      font-weight: 700;
      color: #1e3a5f;
      letter-spacing: -0.5px;
    }
    
    .brand-subtitle {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .invoice-title {
      text-align: right;
    }
    
    .invoice-title h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1e3a5f;
      margin-bottom: 8px;
    }
    
    .invoice-number {
      font-size: 14px;
      color: #6b7280;
    }
    
    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    
    .info-section h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      margin-bottom: 12px;
    }
    
    .info-section p {
      font-size: 14px;
      color: #1f2937;
      margin-bottom: 4px;
    }
    
    .info-section .company {
      font-weight: 600;
      color: #1e3a5f;
    }
    
    /* Invoice Details */
    .invoice-details {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 40px;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    
    .detail-item {
      padding: 8px 0;
    }
    
    .detail-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .detail-value {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }
    
    /* Table */
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }
    
    .invoice-table th {
      background: #1e3a5f;
      color: white;
      padding: 14px 16px;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      font-size: 11px;
    }
    
    .invoice-table th:last-child {
      text-align: right;
    }
    
    .invoice-table td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .invoice-table .amount {
      text-align: right;
      font-family: 'SF Mono', 'Consolas', monospace;
      font-size: 14px;
      font-weight: 600;
    }
    
    /* Total */
    .total-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }
    
    .total-box {
      background: #1e3a5f;
      color: white;
      padding: 20px 30px;
      border-radius: 8px;
      min-width: 250px;
    }
    
    .total-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.8;
      margin-bottom: 8px;
    }
    
    .total-amount {
      font-size: 28px;
      font-weight: 700;
    }
    
    /* Footer */
    .footer {
      border-top: 2px solid #e2e8f0;
      padding-top: 20px;
      font-size: 10px;
      color: #6b7280;
      line-height: 1.6;
    }
    
    .footer p {
      margin-bottom: 8px;
    }
    
    /* Print */
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="brand">
        <div class="brand-logo">F</div>
        <div>
          <div class="brand-text">Fortuna Draw Group</div>
          <div class="brand-subtitle">Construction Draw Inspection Services</div>
        </div>
      </div>
      <div class="invoice-title">
        <h1>INVOICE</h1>
        <div class="invoice-number">${invoice.invoiceNumber}</div>
      </div>
    </div>
    
    <!-- Info Grid -->
    <div class="info-grid">
      <div class="info-section">
        <h3>Bill To</h3>
        <p class="company">${project.lender.name}</p>
        <p>${project.lender.contactName}</p>
        <p>${project.lender.email}</p>
        <p>${project.lender.phone}</p>
      </div>
      <div class="info-section">
        <h3>Project Details</h3>
        <p class="company">${project.name}</p>
        <p>${project.projectNumber}</p>
        <p>${project.address}</p>
      </div>
    </div>
    
    <!-- Invoice Details -->
    <div class="invoice-details">
      <div class="details-grid">
        <div class="detail-item">
          <div class="detail-label">Invoice Date</div>
          <div class="detail-value">${formatDate(invoice.sentDate || invoice.createdAt)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Due Date</div>
          <div class="detail-value">${formatDate(invoice.dueDate)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Draw Number</div>
          <div class="detail-value">#${invoice.drawId}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Service Type</div>
          <div class="detail-value">${invoice.serviceType}</div>
        </div>
      </div>
    </div>
    
    <!-- Line Items -->
    <table class="invoice-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Draw Inspection Services</strong><br>
            <span style="color: #6b7280; font-size: 12px;">
              Project: ${project.name}<br>
              Draw: #${invoice.drawId}<br>
              Inspection Date: ${formatDate(invoice.inspectionDate)}
            </span>
          </td>
          <td class="amount">${formatCurrency(invoice.amount)}</td>
        </tr>
      </tbody>
    </table>
    
    <!-- Total -->
    <div class="total-section">
      <div class="total-box">
        <div class="total-label">Total Due</div>
        <div class="total-amount">${formatCurrency(invoice.amount)}</div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p><strong>Payment Terms:</strong> Net 30</p>
      <p><strong>Payment Methods:</strong> ACH Transfer, Wire Transfer, Check</p>
      <p><strong>Questions:</strong> billing@fortunadrawgroup.com | (555) 123-4567</p>
      <p style="margin-top: 16px;">Thank you for your business!</p>
    </div>
  </div>
  
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;
}