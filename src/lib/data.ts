import {
  Project,
  Draw,
  Invoice,
  Lender,
  Developer,
  Photo,
  RiskFlag,
  KickoffDocument,
  PriorityItem,
  DashboardMetrics,
} from '@/types';

// ============================================
// SAMPLE LENDERS
// ============================================

export const lenders: Lender[] = [
  {
    id: 'lender-1',
    name: 'Pacific Hard Money',
    contactName: 'Sarah Chen',
    email: 'sarah.chen@pacifichm.com',
    phone: '(310) 555-0101',
    company: 'Pacific Hard Money LLC',
  },
  {
    id: 'lender-2',
    name: 'Westbridge Capital',
    contactName: 'Michael Torres',
    email: 'mtorres@westbridgecap.com',
    phone: '(213) 555-0202',
    company: 'Westbridge Capital Partners',
  },
  {
    id: 'lender-3',
    name: 'Summit Funding Group',
    contactName: 'Jennifer Walsh',
    email: 'jwalsh@summitfunding.com',
    phone: '(949) 555-0303',
    company: 'Summit Funding Group Inc',
  },
];

// ============================================
// SAMPLE DEVELOPERS
// ============================================

export const developers: Developer[] = [
  {
    id: 'dev-1',
    name: 'Coastal Builders',
    contactName: 'Robert Martinez',
    email: 'rmartinez@coastalbuilders.com',
    phone: '(310) 555-1001',
    company: 'Coastal Builders Inc',
  },
  {
    id: 'dev-2',
    name: 'Metro Development',
    contactName: 'Amanda Liu',
    email: 'aliu@metrodev.com',
    phone: '(213) 555-1002',
    company: 'Metro Development Group',
  },
  {
    id: 'dev-3',
    name: 'Horizon Construction',
    contactName: 'David Kim',
    email: 'dkim@horizonconstruction.com',
    phone: '(949) 555-1003',
    company: 'Horizon Construction LLC',
  },
];

// ============================================
// SAMPLE PHOTOS
// ============================================

const samplePhotos: Photo[] = [
  {
    id: 'photo-1',
    drawId: 'draw-1',
    url: '/photos/exterior-1.jpg',
    thumbnail: '/photos/thumbs/exterior-1.jpg',
    category: 'Exterior',
    tags: ['front', 'facade'],
    caption: 'Front elevation progress',
    includedInReport: true,
    uploadedAt: '2025-01-15T10:30:00Z',
  },
  {
    id: 'photo-2',
    drawId: 'draw-1',
    url: '/photos/interior-1.jpg',
    thumbnail: '/photos/thumbs/interior-1.jpg',
    category: 'Interior',
    tags: ['living room', 'framing'],
    caption: 'Living room framing',
    includedInReport: true,
    uploadedAt: '2025-01-15T10:35:00Z',
  },
];

// ============================================
// SAMPLE RISK FLAGS
// ============================================

const sampleRiskFlags: RiskFlag[] = [
  {
    id: 'flag-1',
    drawId: 'draw-3',
    type: 'delay',
    severity: 'medium',
    description: 'Inspection delayed due to weather conditions',
    resolved: false,
    createdAt: '2025-01-18T14:00:00Z',
  },
];

// ============================================
// SAMPLE DRAWS
// ============================================

export const draws: Draw[] = [
  // Project 1 Draws
  {
    id: 'draw-1',
    projectId: 'proj-1',
    drawNumber: 1,
    requestedAmount: 45000,
    approvedAmount: 45000,
    status: 'Funds Released',
    requestedDate: '2024-11-15',
    docsReceivedDate: '2024-11-16',
    inspectionDate: '2024-11-18',
    reportSentDate: '2024-11-20',
    fundsReleasedDate: '2024-11-22',
    percentComplete: 20,
    notes: 'Foundation work complete. Framing initiated.',
    riskFlags: [],
    photos: samplePhotos,
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-11-22T16:00:00Z',
  },
  {
    id: 'draw-2',
    projectId: 'proj-1',
    drawNumber: 2,
    requestedAmount: 55000,
    approvedAmount: 52000,
    status: 'Report Sent',
    requestedDate: '2024-12-20',
    docsReceivedDate: '2024-12-21',
    inspectionDate: '2024-12-23',
    reportSentDate: '2024-12-25',
    fundsReleasedDate: undefined,
    percentComplete: 45,
    notes: 'Framing 90% complete. Electrical rough-in started.',
    riskFlags: [],
    photos: [],
    createdAt: '2024-12-20T09:00:00Z',
    updatedAt: '2024-12-25T14:00:00Z',
  },
  {
    id: 'draw-3',
    projectId: 'proj-1',
    drawNumber: 3,
    requestedAmount: 60000,
    status: 'Inspection Scheduled',
    requestedDate: '2025-01-20',
    docsReceivedDate: '2025-01-21',
    inspectionDate: '2025-01-23',
    reportSentDate: undefined,
    fundsReleasedDate: undefined,
    percentComplete: 65,
    notes: '',
    riskFlags: [sampleRiskFlags[0]],
    photos: [],
    createdAt: '2025-01-20T09:00:00Z',
    updatedAt: '2025-01-21T10:00:00Z',
  },
  // Project 2 Draws
  {
    id: 'draw-4',
    projectId: 'proj-2',
    drawNumber: 1,
    requestedAmount: 85000,
    approvedAmount: 85000,
    status: 'Funds Released',
    requestedDate: '2024-10-01',
    docsReceivedDate: '2024-10-02',
    inspectionDate: '2024-10-04',
    reportSentDate: '2024-10-06',
    fundsReleasedDate: '2024-10-08',
    percentComplete: 15,
    notes: 'Site preparation and foundation work initiated.',
    riskFlags: [],
    photos: [],
    createdAt: '2024-10-01T09:00:00Z',
    updatedAt: '2024-10-08T16:00:00Z',
  },
  {
    id: 'draw-5',
    projectId: 'proj-2',
    drawNumber: 2,
    requestedAmount: 120000,
    status: 'Docs Received',
    requestedDate: '2025-01-10',
    docsReceivedDate: '2025-01-12',
    inspectionDate: undefined,
    reportSentDate: undefined,
    fundsReleasedDate: undefined,
    percentComplete: 35,
    notes: '',
    riskFlags: [],
    photos: [],
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-12T11:00:00Z',
  },
  // Project 3 Draws
  {
    id: 'draw-6',
    projectId: 'proj-3',
    drawNumber: 1,
    requestedAmount: 35000,
    approvedAmount: 35000,
    status: 'Funds Released',
    requestedDate: '2024-12-01',
    docsReceivedDate: '2024-12-02',
    inspectionDate: '2024-12-04',
    reportSentDate: '2024-12-06',
    fundsReleasedDate: '2024-12-08',
    percentComplete: 25,
    notes: 'Initial renovation work commenced.',
    riskFlags: [],
    photos: [],
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-08T16:00:00Z',
  },
];

// ============================================
// SAMPLE PROJECTS
// ============================================

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Oak Avenue SFR Development',
    projectNumber: 'FDG-2024-001',
    address: '1234 Oak Avenue, Los Angeles, CA 90001',
    lender: lenders[0],
    developer: developers[0],
    loanAmount: 450000,
    projectType: 'SFR',
    status: 'On Track',
    startDate: '2024-11-01',
    expectedDuration: 180,
    expectedEndDate: '2025-05-01',
    totalBudget: 400000,
    numberOfDraws: 6,
    createdAt: '2024-10-15T09:00:00Z',
    updatedAt: '2025-01-21T10:00:00Z',
    portalToken: 'portal-oak-2024-001',
  },
  {
    id: 'proj-2',
    name: 'Metro Multifamily Complex',
    projectNumber: 'FDG-2024-002',
    address: '5678 Metro Blvd, Long Beach, CA 90802',
    lender: lenders[1],
    developer: developers[1],
    loanAmount: 2500000,
    projectType: 'Multifamily',
    status: 'At Risk',
    startDate: '2024-09-01',
    expectedDuration: 365,
    expectedEndDate: '2025-09-01',
    totalBudget: 2200000,
    numberOfDraws: 12,
    createdAt: '2024-08-15T09:00:00Z',
    updatedAt: '2025-01-12T11:00:00Z',
    portalToken: 'portal-metro-2024-002',
  },
  {
    id: 'proj-3',
    name: 'Coastal Renovation Project',
    projectNumber: 'FDG-2024-003',
    address: '901 Ocean Drive, Newport Beach, CA 92660',
    lender: lenders[2],
    developer: developers[2],
    loanAmount: 180000,
    projectType: 'SFR',
    status: 'On Track',
    startDate: '2024-11-15',
    expectedDuration: 120,
    expectedEndDate: '2025-03-15',
    totalBudget: 160000,
    numberOfDraws: 4,
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-12-08T16:00:00Z',
    portalToken: 'portal-coastal-2024-003',
  },
  {
    id: 'proj-4',
    name: 'Highland Ground-Up',
    projectNumber: 'FDG-2025-001',
    address: '246 Highland Ave, Pasadena, CA 91101',
    lender: lenders[0],
    developer: developers[0],
    loanAmount: 680000,
    projectType: 'Ground-up',
    status: 'Behind',
    startDate: '2024-10-15',
    expectedDuration: 240,
    expectedEndDate: '2025-06-15',
    totalBudget: 600000,
    numberOfDraws: 8,
    createdAt: '2024-10-01T09:00:00Z',
    updatedAt: '2025-01-18T14:00:00Z',
    portalToken: 'portal-highland-2025-001',
  },
];

// ============================================
// SAMPLE INVOICES
// ============================================

export const invoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    projectId: 'proj-1',
    drawId: 'draw-1',
    serviceType: 'Core',
    amount: 450,
    inspectionDate: '2024-11-18',
    reportSentDate: '2024-11-20',
    dueDate: '2024-12-20',
    sentDate: '2024-11-20',
    paidDate: '2024-12-05',
    status: 'Paid',
    createdAt: '2024-11-20T15:00:00Z',
    updatedAt: '2024-12-05T10:00:00Z',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2024-002',
    projectId: 'proj-1',
    drawId: 'draw-2',
    serviceType: 'Core',
    amount: 450,
    inspectionDate: '2024-12-23',
    reportSentDate: '2024-12-25',
    dueDate: '2025-01-25',
    sentDate: '2024-12-25',
    paidDate: undefined,
    status: 'Pending',
    createdAt: '2024-12-25T15:00:00Z',
    updatedAt: '2024-12-25T15:00:00Z',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2024-003',
    projectId: 'proj-2',
    drawId: 'draw-4',
    serviceType: 'High-Sensitivity',
    amount: 750,
    inspectionDate: '2024-10-04',
    reportSentDate: '2024-10-06',
    dueDate: '2024-11-06',
    sentDate: '2024-10-06',
    paidDate: '2024-10-28',
    status: 'Paid',
    createdAt: '2024-10-06T15:00:00Z',
    updatedAt: '2024-10-28T10:00:00Z',
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2025-001',
    projectId: 'proj-3',
    drawId: 'draw-6',
    serviceType: 'Standard',
    amount: 300,
    inspectionDate: '2024-12-04',
    reportSentDate: '2024-12-06',
    dueDate: '2025-01-06',
    sentDate: '2024-12-06',
    paidDate: undefined,
    status: 'Overdue',
    createdAt: '2024-12-06T15:00:00Z',
    updatedAt: '2025-01-07T00:00:00Z',
  },
];

// ============================================
// KICKOFF DOCUMENTS
// ============================================

export const kickoffDocuments: KickoffDocument[] = [
  {
    id: 'kickoff-1',
    projectId: 'proj-1',
    sentAt: '2024-10-20T10:00:00Z',
    viewedAt: '2024-10-21T14:30:00Z',
    acknowledgedAt: '2024-10-21T15:00:00Z',
    projectOverview: 'Single family residential development at 1234 Oak Avenue, Los Angeles.',
    drawProcess: 'Six draw inspections scheduled over 6-month construction period.',
    requiredDocuments: ['Budget', 'Draw Request Form', 'Invoices', 'Receipts', 'Lien Releases'],
    timelineExpectations: 'Draws processed within 24-48 hours of inspection.',
    rolesAndResponsibilities: 'Lender: Sarah Chen\nDeveloper: Robert Martinez\nInspector: FDG Team',
    communicationProtocol: 'Primary: Email\nUrgent: Phone\nPortal: For document access',
    portalAccessInstructions: 'Access the portal at portal.fortunadrawgroup.com using the token provided.',
    createdAt: '2024-10-15T09:00:00Z',
  },
];

// ============================================
// DASHBOARD METRICS
// ============================================

export function getDashboardMetrics(): DashboardMetrics {
  const activeProjects = projects.filter(p => p.status !== 'Complete').length;
  const totalProjects = projects.length;
  const pendingDraws = draws.filter(d => 
    d.status === 'Requested' || d.status === 'Docs Received' || d.status === 'Inspection Scheduled'
  ).length;
  const totalDrawAmount = draws
    .filter(d => d.status !== 'Funds Released')
    .reduce((sum, d) => sum + d.requestedAmount, 0);
  const upcomingInspections = draws.filter(d => 
    d.status === 'Inspection Scheduled' || d.status === 'Docs Received'
  ).length;
  const overdueDraws = draws.filter(d => 
    d.status === 'Requested' && 
    new Date(d.requestedDate) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const projectsAtRisk = projects.filter(p => 
    p.status === 'At Risk' || p.status === 'Behind'
  ).length;
  const unpaidInvoices = invoices.filter(i => 
    i.status === 'Pending' || i.status === 'Overdue'
  ).length;
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue').length;
  const unpaidInvoiceTotal = invoices
    .filter(i => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((sum, i) => sum + i.amount, 0);
  const totalOutstanding = unpaidInvoiceTotal;
  const portfolioValue = projects.reduce((sum, p) => sum + p.loanAmount, 0);
  const avgCompletion = projects.length > 0 
    ? projects.reduce((sum, p) => sum + calculateProjectProgress(p.id), 0) / projects.length 
    : 0;
  const totalDraws = draws.length;

  return {
    activeProjects,
    totalProjects,
    pendingDraws,
    totalDrawAmount,
    upcomingInspections,
    overdueDraws,
    projectsAtRisk,
    unpaidInvoices,
    overdueInvoices,
    unpaidInvoiceTotal,
    totalOutstanding,
    portfolioValue,
    avgCompletion,
    totalDraws,
  };
}

// ============================================
// PRIORITY ITEMS
// ============================================

export function getPriorityItems(): PriorityItem[] {
  const items: PriorityItem[] = [];
  
  // Check for upcoming inspections
  draws
    .filter(d => d.status === 'Inspection Scheduled' && d.inspectionDate)
    .forEach(d => {
      const project = projects.find(p => p.id === d.projectId);
      if (project) {
        items.push({
          id: `priority-insp-${d.id}`,
          type: 'inspection',
          priority: 'high',
          title: `Inspection: Draw #${d.drawNumber}`,
          description: `Scheduled for ${d.inspectionDate} at ${project.name}`,
          dueDate: d.inspectionDate,
          projectId: project.id,
          projectName: project.name,
          actionUrl: `/projects/${project.id}/draws/${d.id}`,
        });
      }
    });
  
  // Check for pending docs
  draws
    .filter(d => d.status === 'Requested')
    .forEach(d => {
      const project = projects.find(p => p.id === d.projectId);
      if (project) {
        items.push({
          id: `priority-docs-${d.id}`,
          type: 'document',
          priority: 'medium',
          title: `Awaiting Documents: Draw #${d.drawNumber}`,
          description: `Documents needed for ${project.name}`,
          projectId: project.id,
          projectName: project.name,
          actionUrl: `/projects/${project.id}/draws/${d.id}`,
        });
      }
    });
  
  // Check for overdue invoices
  invoices
    .filter(i => i.status === 'Overdue')
    .forEach(i => {
      const project = projects.find(p => p.id === i.projectId);
      if (project) {
        items.push({
          id: `priority-inv-${i.id}`,
          type: 'invoice',
          priority: 'high',
          title: `Overdue Invoice: ${i.invoiceNumber}`,
          description: `$${i.amount} from ${project.name}`,
          dueDate: i.dueDate,
          projectId: project.id,
          projectName: project.name,
          actionUrl: `/invoices/${i.id}`,
        });
      }
    });
  
  // Check for projects at risk
  projects
    .filter(p => p.status === 'At Risk' || p.status === 'Behind')
    .forEach(p => {
      items.push({
        id: `priority-risk-${p.id}`,
        type: 'risk',
        priority: p.status === 'Behind' ? 'high' : 'medium',
        title: `Project ${p.status}: ${p.name}`,
        description: `Requires attention - check timeline and draws`,
        projectId: p.id,
        projectName: p.name,
        actionUrl: `/projects/${p.id}`,
      });
    });
  
  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

export function getProjects(): Project[] {
  return projects;
}

export function getDrawsByProject(projectId: string): Draw[] {
  return draws.filter(d => d.projectId === projectId);
}

export function getInvoicesByProject(projectId: string): Invoice[] {
  return invoices.filter(i => i.projectId === projectId);
}

export function getInvoicesByDraw(drawId: string): Invoice | undefined {
  return invoices.find(i => i.drawId === drawId);
}

export function calculateProjectProgress(projectId: string): number {
  const projectDraws = getDrawsByProject(projectId);
  if (projectDraws.length === 0) return 0;
  
  const completedDraws = projectDraws.filter(d => d.percentComplete);
  if (completedDraws.length === 0) return 0;
  
  // Return the latest percent complete
  const latest = completedDraws.sort((a, b) => b.drawNumber - a.drawNumber)[0];
  return latest.percentComplete || 0;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'On Track': 'text-green-400 bg-green-400/10',
    'At Risk': 'text-yellow-400 bg-yellow-400/10',
    'Behind': 'text-red-400 bg-red-400/10',
    'Complete': 'text-blue-400 bg-blue-400/10',
    'Requested': 'text-gray-400 bg-gray-400/10',
    'Docs Received': 'text-blue-400 bg-blue-400/10',
    'Inspection Scheduled': 'text-purple-400 bg-purple-400/10',
    'Inspected': 'text-indigo-400 bg-indigo-400/10',
    'Report Sent': 'text-cyan-400 bg-cyan-400/10',
    'Funds Released': 'text-green-400 bg-green-400/10',
    'On Hold': 'text-orange-400 bg-orange-400/10',
    'Pending': 'text-yellow-400 bg-yellow-400/10',
    'Paid': 'text-green-400 bg-green-400/10',
    'Overdue': 'text-red-400 bg-red-400/10',
  };
  return colors[status] || 'text-gray-400 bg-gray-400/10';
}

// ============================================
// STATUS UPDATE FUNCTIONS
// ============================================

/**
 * Update draw status when report is sent
 * Transitions: Inspected → Report Sent
 */
export function updateDrawStatusOnReportSent(drawId: string): Draw | null {
  const drawIndex = draws.findIndex(d => d.id === drawId);
  if (drawIndex === -1) return null;
  
  const draw = draws[drawIndex];
  
  // Validate transition: can only send report if inspected
  if (draw.status !== 'Inspected') {
    console.warn(`Cannot send report for draw ${drawId} - status is ${draw.status}, expected 'Inspected'`);
    return null;
  }
  
  // Update status and date
  draws[drawIndex] = {
    ...draw,
    status: 'Report Sent',
    reportSentDate: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString(),
  };
  
  return draws[drawIndex];
}

/**
 * Update draw status when funds are released
 * Transitions: Report Sent → Funds Released
 */
export function updateDrawStatusOnFundsReleased(drawId: string): Draw | null {
  const drawIndex = draws.findIndex(d => d.id === drawId);
  if (drawIndex === -1) return null;
  
  const draw = draws[drawIndex];
  
  // Validate transition: can only release funds if report sent
  if (draw.status !== 'Report Sent') {
    console.warn(`Cannot release funds for draw ${drawId} - status is ${draw.status}, expected 'Report Sent'`);
    return null;
  }
  
  // Update status and date
  draws[drawIndex] = {
    ...draw,
    status: 'Funds Released',
    fundsReleasedDate: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString(),
  };
  
  return draws[drawIndex];
}

/**
 * Update draw status when inspection is completed
 * Transitions: Inspection Scheduled → Inspected
 */
export function updateDrawStatusOnInspectionComplete(drawId: string, percentComplete?: number, notes?: string): Draw | null {
  const drawIndex = draws.findIndex(d => d.id === drawId);
  if (drawIndex === -1) return null;
  
  const draw = draws[drawIndex];
  
  // Validate transition: can only complete inspection if scheduled
  if (draw.status !== 'Inspection Scheduled') {
    console.warn(`Cannot complete inspection for draw ${drawId} - status is ${draw.status}, expected 'Inspection Scheduled'`);
    return null;
  }
  
  // Update status and data
  draws[drawIndex] = {
    ...draw,
    status: 'Inspected',
    percentComplete: percentComplete ?? draw.percentComplete,
    notes: notes ?? draw.notes,
    updatedAt: new Date().toISOString(),
  };
  
  return draws[drawIndex];
}

/**
 * Update draw status when documents are received
 * Transitions: Requested → Docs Received
 */
export function updateDrawStatusOnDocsReceived(drawId: string): Draw | null {
  const drawIndex = draws.findIndex(d => d.id === drawId);
  if (drawIndex === -1) return null;
  
  const draw = draws[drawIndex];
  
  // Validate transition: can only receive docs if requested
  if (draw.status !== 'Requested') {
    console.warn(`Cannot receive docs for draw ${drawId} - status is ${draw.status}, expected 'Requested'`);
    return null;
  }
  
  // Update status and date
  draws[drawIndex] = {
    ...draw,
    status: 'Docs Received',
    docsReceivedDate: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString(),
  };
  
  return draws[drawIndex];
}

/**
 * Update draw status when inspection is scheduled
 * Transitions: Docs Received → Inspection Scheduled
 */
export function updateDrawStatusOnInspectionScheduled(drawId: string, inspectionDate: string): Draw | null {
  const drawIndex = draws.findIndex(d => d.id === drawId);
  if (drawIndex === -1) return null;
  
  const draw = draws[drawIndex];
  
  // Validate transition: can only schedule inspection if docs received
  if (draw.status !== 'Docs Received') {
    console.warn(`Cannot schedule inspection for draw ${drawId} - status is ${draw.status}, expected 'Docs Received'`);
    return null;
  }
  
  // Update status and date
  draws[drawIndex] = {
    ...draw,
    status: 'Inspection Scheduled',
    inspectionDate,
    updatedAt: new Date().toISOString(),
  };
  
  return draws[drawIndex];
}

/**
 * Update invoice status when sent
 * Transitions: Pending → Pending (with sentDate)
 */
export function updateInvoiceStatusOnSent(invoiceId: string): Invoice | null {
  const invoiceIndex = invoices.findIndex(i => i.id === invoiceId);
  if (invoiceIndex === -1) return null;
  
  const invoice = invoices[invoiceIndex];
  
  // Update sent date
  invoices[invoiceIndex] = {
    ...invoice,
    sentDate: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString(),
  };
  
  return invoices[invoiceIndex];
}

/**
 * Update invoice status when paid
 * Transitions: Pending/Overdue → Paid
 */
export function updateInvoiceStatusOnPaid(invoiceId: string): Invoice | null {
  const invoiceIndex = invoices.findIndex(i => i.id === invoiceId);
  if (invoiceIndex === -1) return null;
  
  const invoice = invoices[invoiceIndex];
  
  // Update status and date
  invoices[invoiceIndex] = {
    ...invoice,
    status: 'Paid',
    paidDate: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString(),
  };
  
  return invoices[invoiceIndex];
}