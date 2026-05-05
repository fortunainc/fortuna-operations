'use client';

import { ReportData, BudgetLineItem, RiskFlag, Photo } from '@/types';

// Helper to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper to format dates
function formatDate(date: string | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Generate the HTML for the PDF
export function generateReportPDF(data: ReportData): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate PDF');
    return;
  }

  const html = generateReportHTML(data);
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for images to load, then print
  setTimeout(() => {
    printWindow.print();
  }, 1000);
}

function generateReportHTML(data: ReportData): string {
  const photosByCategory = groupPhotosByCategory(data.photos);
  const alignmentStatus = calculateAlignmentStatus(data.budgetItems);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Draw Inspection Report - ${data.projectName} - Draw #${data.drawNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      background: #fff;
    }
    
    .sans-serif {
      font-family: 'Helvetica', 'Arial', sans-serif;
    }
    
    @page {
      size: letter;
      margin: 0.5in 0.75in 0.5in 0.75in;
    }
    
    .page {
      min-height: 10.5in;
    }
    
    .no-break {
      page-break-inside: avoid;
    }
    
    /* HEADER */
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #000;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    
    .brand {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    
    .report-title {
      text-align: right;
      font-size: 10px;
      font-weight: 400;
      color: #666;
    }
    
    .report-title strong {
      font-size: 12px;
      font-weight: 700;
      color: #000;
      display: block;
      margin-bottom: 4px;
    }
    
    .metadata-box {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 12px 16px;
      margin-bottom: 24px;
      font-size: 10px;
    }
    
    .metadata-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      line-height: 1.4;
    }
    
    .metadata-label {
      font-weight: 600;
      color: #444;
    }
    
    .metadata-value {
      font-weight: 400;
    }
    
    /* EXECUTIVE SUMMARY BOX */
    .executive-summary {
      background: #fafafa;
      border: 2px solid #000;
      padding: 20px;
      margin-bottom: 24px;
    }
    
    .summary-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .summary-item {
      text-align: center;
    }
    
    .summary-label {
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      margin-bottom: 4px;
    }
    
    .summary-value {
      font-size: 18px;
      font-weight: 700;
      color: #000;
    }
    
    .alignment-status {
      margin-top: 16px;
      padding: 12px;
      text-align: center;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .alignment-aligned {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .alignment-partial {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }
    
    .alignment-not-aligned {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .summary-bullets {
      margin-top: 16px;
      padding-left: 20px;
    }
    
    .summary-bullets li {
      font-size: 10px;
      margin-bottom: 6px;
      line-height: 1.5;
    }
    
    /* SECTIONS */
    .section {
      margin-bottom: 24px;
    }
    
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    
    /* TIMELINE TABLE */
    .timeline-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 8px;
    }
    
    .timeline-table th,
    .timeline-table td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    .timeline-table th {
      background: #000;
      color: #fff;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .timeline-table tr:last-child td {
      border-bottom: none;
    }
    
    /* SITE OBSERVATIONS */
    .observations-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 8px;
    }
    
    .observations-col {
      background: #fafafa;
      padding: 12px;
      border: 1px solid #e0e0e0;
    }
    
    .observations-col h4 {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid #ccc;
    }
    
    .observations-col ul {
      list-style: none;
      padding-left: 0;
    }
    
    .observations-col li {
      font-size: 9px;
      padding-left: 12px;
      position: relative;
      margin-bottom: 4px;
      line-height: 1.4;
    }
    
    .observations-col li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #000;
    }
    
    /* PHOTOS */
    .photo-section {
      margin-bottom: 20px;
    }
    
    .photo-category-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    
    .photo-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    
    .photo-item {
      page-break-inside: avoid;
    }
    
    .photo-item img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border: 1px solid #000;
    }
    
    .photo-caption {
      font-size: 8px;
      color: #666;
      margin-top: 4px;
      text-align: center;
      font-style: italic;
    }
    
    .photo-tag {
      display: inline-block;
      background: #000;
      color: #fff;
      font-size: 7px;
      padding: 2px 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    
    /* BUDGET TABLE */
    .budget-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 8px;
    }
    
    .budget-table th {
      background: #000;
      color: #fff;
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .budget-table th:last-child {
      text-align: right;
    }
    
    .budget-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #ddd;
    }
    
    .budget-table tr:nth-child(even) {
      background: #fafafa;
    }
    
    .budget-table .amount {
      text-align: right;
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }
    
    .budget-table .discrepancy {
      color: #c00;
      font-weight: 700;
    }
    
    .budget-table .notes {
      font-style: italic;
      color: #666;
      font-size: 9px;
    }
    
    /* DOCUMENTATION REVIEW */
    .doc-review {
      font-size: 10px;
      margin-bottom: 8px;
    }
    
    .doc-review-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px dotted #ccc;
    }
    
    .doc-review-item.missing {
      color: #c00;
    }
    
    .checkmark {
      font-weight: 700;
    }
    
    /* RISK FLAGS */
    .risk-section {
      margin-bottom: 24px;
    }
    
    .risk-item {
      background: #fff3cd;
      border-left: 4px solid #fc0;
      padding: 12px;
      margin-bottom: 8px;
    }
    
    .risk-item.high {
      background: #f8d7da;
      border-left-color: #dc3545;
    }
    
    .risk-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    
    .risk-type {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .risk-priority {
      font-size: 8px;
      font-weight: 700;
      padding: 2px 8px;
      background: #000;
      color: #fff;
      text-transform: uppercase;
    }
    
    .risk-description {
      font-size: 10px;
      line-height: 1.4;
    }
    
    /* DISCLAIMER */
    .disclaimer {
      background: #f5f5f5;
      border: 1px solid #ccc;
      padding: 16px;
      margin-top: 32px;
      font-size: 8px;
      color: #666;
      line-height: 1.5;
      text-align: justify;
    }
    
    .disclaimer strong {
      color: #000;
      font-weight: 700;
      display: block;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Print optimizations */
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { margin: 0; }
    }
  </style>
</head>
<body>
  <!-- PAGE 1 -->
  <div class="page">
    <!-- HEADER -->
    <div class="report-header">
      <div class="brand">Fortuna Draw Group</div>
      <div class="report-title sans-serif">
        <strong>Draw Inspection Report</strong>
        Report Date: ${formatDate(data.reportDate)}
      </div>
    </div>
    
    <!-- METADATA BOX -->
    <div class="metadata-box sans-serif">
      <div class="metadata-row">
        <span class="metadata-label">Project Name:</span>
        <span class="metadata-value">${data.projectName}</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">Property Address:</span>
        <span class="metadata-value">${data.projectAddress}</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">Draw #:</span>
        <span class="metadata-value">#${data.drawNumber}</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">Inspection Date:</span>
        <span class="metadata-value">${formatDate(data.inspectionDate)}</span>
      </div>
    </div>
    
    <!-- EXECUTIVE SUMMARY -->
    <div class="executive-summary sans-serif">
      <div class="summary-header">Executive Summary</div>
      
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-label">Requested Draw Amount</div>
          <div class="summary-value">${formatCurrency(data.requestedAmount)}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Observed Completion</div>
          <div class="summary-value">${data.percentComplete}%</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Previous Completion</div>
          <div class="summary-value">${Math.max(0, data.percentComplete - 15)}%</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Completion Delta</div>
          <div class="summary-value">+${Math.min(15, data.percentComplete)}%</div>
        </div>
      </div>
      
      <div class="alignment-status alignment-${alignmentStatus.value}">
        ${alignmentStatus.label}
      </div>
      
      <ul class="summary-bullets">
        ${generateExecutiveSummaryBullets(data)}
      </ul>
    </div>
    
    <!-- DRAW TIMELINE -->
    <div class="section sans-serif">
      <div class="section-title">Draw Timeline Snapshot</div>
      <table class="timeline-table">
        <thead>
          <tr>
            <th>Milestone</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Requested</td>
            <td>${formatDate(data.requestedDate)}</td>
          </tr>
          <tr>
            <td>Docs Received</td>
            <td>${formatDate(data.docsReceivedDate)}</td>
          </tr>
          <tr>
            <td>Inspection</td>
            <td>${formatDate(data.inspectionDate)}</td>
          </tr>
          <tr>
            <td>Report Sent</td>
            <td>${formatDate(data.reportSentDate)}</td>
          </tr>
          <tr>
            <td>Funds Released</td>
            <td>${formatDate(data.fundsReleasedDate)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- PAGE 2 -->
  <div class="page">
    <!-- SITE OBSERVATIONS -->
    <div class="section">
      <div class="section-title">Site Observations</div>
      <div class="observations-grid sans-serif">
        ${generateObservationsColumns(data.siteObservations)}
      </div>
    </div>
    
    <!-- PHOTO DOCUMENTATION -->
    ${generatePhotoSectionsHTML(photosByCategory)}
  </div>
  
  <!-- PAGE 3 -->
  <div class="page">
    <!-- BUDGET VS PROGRESS TABLE -->
    <div class="section sans-serif">
      <div class="section-title">Budget vs Progress Analysis</div>
      <table class="budget-table">
        <thead>
          <tr>
            <th>Line Item</th>
            <th>Budget</th>
            <th>Claimed %</th>
            <th>Observed %</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${data.budgetItems.map(item => {
            const hasDiscrepancy = Math.abs(item.observedPercent - (item.budgetAmount > 0 ? (item.invoicedAmount / item.budgetAmount) * 100 : 0)) > 10;
            return `
              <tr>
                <td><strong>${item.category}</strong></td>
                <td class="amount">${formatCurrency(item.budgetAmount)}</td>
                <td class="amount">${item.budgetAmount > 0 ? ((item.invoicedAmount / item.budgetAmount) * 100).toFixed(0) : 0}%</td>
                <td class="amount ${hasDiscrepancy ? 'discrepancy' : ''}">${item.observedPercent}%</td>
                <td class="notes">${item.notes || (hasDiscrepancy ? 'Variances observed' : 'On track')}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
    
    <!-- DOCUMENTATION REVIEW -->
    <div class="section sans-serif">
      <div class="section-title">Documentation Review</div>
      <div class="doc-review">
        ${generateDocumentationReview(data.documentationReview)}
      </div>
    </div>
    
    <!-- RISK FLAGS -->
    ${data.riskFlags.length > 0 ? `
      <div class="section sans-serif">
        <div class="section-title">Risk Flags</div>
        ${data.riskFlags.map(flag => `
          <div class="risk-item ${flag.severity === 'high' ? 'high' : ''}">
            <div class="risk-header">
              <span class="risk-type">${flag.type}</span>
              <span class="risk-priority">${flag.severity} Priority</span>
            </div>
            <div class="risk-description">${flag.description}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    <!-- DISCLAIMER -->
    <div class="disclaimer">
      <strong>Disclaimer</strong>
      This report reflects observed site conditions and documentation reviewed at the time of inspection. It is provided for client decision support only and does not constitute approval of funds, guarantee of work, or verification of cost accuracy. Fortuna Draw Group assumes no liability for decisions made based on the contents of this report beyond the scope of the inspection services contracted.
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

function groupPhotosByCategory(photos: Photo[]): Record<string, Photo[]> {
  const groups: Record<string, Photo[]> = {
    'Exterior': [],
    'Interior': [],
    'Kitchen': [],
    'Bathroom': [],
    'Mechanical': [],
    'Misc': []
  };
  
  photos.forEach(photo => {
    const category = photo.category || 'Misc';
    if (groups[category]) {
      groups[category].push(photo);
    } else {
      groups['Misc'].push(photo);
    }
  });
  
  return groups;
}

function calculateAlignmentStatus(budgetItems: BudgetLineItem[]): { value: string; label: string } {
  const aligned = budgetItems.filter(item => item.status === 'aligned').length;
  const total = budgetItems.length;
  const pct = total > 0 ? (aligned / total) * 100 : 0;
  
  if (pct >= 80) return { value: 'aligned', label: 'Aligned' };
  if (pct >= 50) return { value: 'partial', label: 'Partially Aligned' };
  return { value: 'not-aligned', label: 'Not Aligned' };
}

function generateExecutiveSummaryBullets(data: ReportData): string {
  const bullets = [];
  
  // What was completed
  const completedItems = data.budgetItems.filter(item => item.observedPercent >= 90);
  if (completedItems.length > 0) {
    bullets.push(`<li><strong>Completed:</strong> ${completedItems.slice(0, 3).map(item => item.category).join(', ')}</li>`);
  } else {
    bullets.push('<li>Construction progressing according to schedule with multiple trades active on site.</li>');
  }
  
  // What is in progress
  const inProgressItems = data.budgetItems.filter(item => item.observedPercent >= 30 && item.observedPercent < 90);
  if (inProgressItems.length > 0) {
    bullets.push(`<li><strong>In Progress:</strong> ${inProgressItems.slice(0, 3).map(item => item.category).join(', ')}</li>`);
  } else {
    bullets.push('<li>Work quality meets industry standards with proper safety protocols observed.</li>');
  }
  
  // Concerns
  const varianceItems = data.budgetItems.filter(item => item.status === 'variance');
  if (varianceItems.length > 0) {
    bullets.push(`<li><strong>Attention Required:</strong> ${varianceItems.map(item => item.category).join(', ')} showing variances from planned schedule.</li>`);
  }
  
  if (data.riskFlags.length > 0) {
    bullets.push(`<li><strong>Risk Alert:</strong> ${data.riskFlags[0].description.substring(0, 100)}...</li>`);
  }
  
  return bullets.join('');
}

function generateObservationsColumns(siteObservations: string): string {
  // Parse observations into three columns
  const lines = siteObservations.split('\n').filter(line => line.trim());
  const completed: string[] = [];
  const inProgress: string[] = [];
  const notStarted: string[] = [];
  
  lines.forEach(line => {
    const cleanLine = line.replace(/^[•\-\*]\s*/, '').replace(/\*\*/g, '');
    if (cleanLine.toLowerCase().includes('complete') || cleanLine.toLowerCase().includes('100%')) {
      completed.push(cleanLine);
    } else if (cleanLine.toLowerCase().includes('progress') || cleanLine.includes('%')) {
      inProgress.push(cleanLine);
    } else {
      notStarted.push(cleanLine);
    }
  });
  
  return `
    <div class="observations-col">
      <h4>Work Completed</h4>
      <ul>
        ${completed.length > 0 ? completed.map(item => `<li>${item}</li>`).join('') : '<li>No completed work items documented</li>'}
      </ul>
    </div>
    <div class="observations-col">
      <h4>Work In Progress</h4>
      <ul>
        ${inProgress.length > 0 ? inProgress.map(item => `<li>${item}</li>`).join('') : '<li>No in-progress work items documented</li>'}
      </ul>
    </div>
    <div class="observations-col">
      <h4>Work Not Started</h4>
      <ul>
        ${notStarted.length > 0 ? notStarted.map(item => `<li>${item}</li>`).join('') : '<li>All work phases initiated</li>'}
      </ul>
    </div>
  `;
}

function generatePhotoSectionsHTML(photosByCategory: Record<string, Photo[]>): string {
  const categories = ['Exterior', 'Interior', 'Kitchen', 'Bathroom', 'Mechanical', 'Misc'];
  
  let html = '';
  
  categories.forEach(category => {
    const photos = photosByCategory[category];
    if (photos && photos.length > 0) {
      html += `
        <div class="section sans-serif">
          <div class="photo-category-title">${category}</div>
          <div class="photo-grid">
            ${photos.map(photo => `
              <div class="photo-item">
                <img src="${photo.url}" alt="${photo.caption || category}" />
                ${photo.caption ? `<div class="photo-caption">${photo.caption}</div>` : ''}
                ${photo.tags && photo.tags.length > 0 ? `
                  <div class="photo-tag">${photo.tags[0]}</div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  });
  
  return html;
}

function generateDocumentationReview(documentationReview: string): string {
  const docs = [
    { name: 'Invoices Reviewed', status: true },
    { name: 'Receipts Reviewed', status: true },
    { name: 'Lien Releases', status: true },
    { name: 'AIA G702/G703 Forms', status: true },
    { name: 'Updated Draw Schedule', status: true },
    { name: 'Waivers & Affidavits', status: false },
  ];
  
  return docs.map(doc => `
    <div class="doc-review-item ${!doc.status ? 'missing' : ''}">
      <span>${doc.name}</span>
      <span class="checkmark">${doc.status ? '✓' : '✗'}</span>
    </div>
  `).join('');
}

// Generate sample report data for demo
export function generateSampleReportData(): ReportData {
  return {
    projectName: 'Sunset Apartments Phase II',
    projectNumber: 'PRJ-2024-0042',
    projectAddress: '5678 Pacific Coast Highway, Malibu, CA 90265',
    lenderName: 'First National Bank',
    drawNumber: 3,
    reportDate: new Date().toISOString().split('T')[0],
    percentComplete: 62,
    executiveSummary: 'Progress continues on schedule with notable completion of structural framing and weather envelope. Interior trades are active with mechanical and electrical rough-in progressing. Quality of work meets industry standards. Recommend approval of requested draw amount with continued monitoring of critical path items.',
    requestedAmount: 425000,
    approvedAmount: 425000,
    drawStatus: 'Inspected',
    requestedDate: '2024-01-15',
    docsReceivedDate: '2024-01-18',
    inspectionDate: '2024-01-22',
    reportSentDate: undefined,
    fundsReleasedDate: undefined,
    siteObservations: `Exterior shell complete and weather-tight
Roofing 100% complete with proper drainage installed
Exterior insulation and weather barrier applied
Window installation 60% complete
Interior framing 85% complete across all units
Rough electrical complete in Units 101-110
Rough plumbing complete in Units 101-105
HVAC rough-in 70% complete
Drywall staging on site, installation beginning
Site maintained in professional manner with safety protocols observed`,
    budgetItems: [
      { category: 'Site Work', budgetAmount: 85000, invoicedAmount: 78000, observedPercent: 92, status: 'aligned' },
      { category: 'Foundation', budgetAmount: 145000, invoicedAmount: 145000, observedPercent: 100, status: 'aligned' },
      { category: 'Framing', budgetAmount: 195000, invoicedAmount: 165000, observedPercent: 85, status: 'aligned' },
      { category: 'Roofing', budgetAmount: 78000, invoicedAmount: 78000, observedPercent: 100, status: 'aligned' },
      { category: 'Windows/Doors', budgetAmount: 65000, invoicedAmount: 42000, observedPercent: 60, status: 'aligned' },
      { category: 'Plumbing', budgetAmount: 95000, invoicedAmount: 58000, observedPercent: 52, status: 'variance', notes: 'Slightly behind schedule' },
      { category: 'Electrical', budgetAmount: 85000, invoicedAmount: 52000, observedPercent: 61, status: 'aligned' },
      { category: 'HVAC', budgetAmount: 72000, invoicedAmount: 48000, observedPercent: 67, status: 'aligned' },
    ],
    documentationReview: `All required documentation received and verified:
- AIA G702 Application for Payment
- AIA G703 Continuation Sheet
- Lien Waivers - General Contractor
- Lien Waivers - Subcontractors (all tiers)
- Updated Draw Schedule
- Photos of Completed Work
- Previous Draw Reconciliation`,
    riskFlags: [
      {
        id: '1',
        drawId: 'draw-3',
        type: 'budget',
        severity: 'medium',
        description: 'Plumbing rough-in shows 5% variance from invoiced amounts. Verify subcontractor billing before next draw.',
        resolved: false,
        createdAt: new Date().toISOString()
      }
    ],
    photos: []
  };
}