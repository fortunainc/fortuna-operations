// Core Types for Fortuna Operations System

// ============================================
// PROJECT TYPES
// ============================================

export type ProjectType = 'SFR' | 'Multifamily' | 'Ground-up';
export type ProjectStatus = 'On Track' | 'At Risk' | 'Behind' | 'Complete';

export interface Project {
  id: string;
  name: string;
  projectNumber: string;
  address: string;
  lender: Lender;
  developer: Developer;
  loanAmount: number;
  projectType: ProjectType;
  status: ProjectStatus;
  startDate: string;
  expectedDuration: number; // in days
  expectedEndDate: string;
  totalBudget: number;
  numberOfDraws: number;
  createdAt: string;
  updatedAt: string;
  portalToken?: string; // For lender portal access
}

export interface Lender {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  company: string;
}

export interface Developer {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  company: string;
}

// ============================================
// DRAW TYPES
// ============================================

export type DrawStatus = 'Requested' | 'Docs Received' | 'Inspection Scheduled' | 'Inspected' | 'Report Sent' | 'Funds Released' | 'On Hold';

export interface Draw {
  id: string;
  projectId: string;
  drawNumber: number;
  requestedAmount: number;
  approvedAmount?: number;
  status: DrawStatus;
  
  // Timeline dates
  requestedDate: string;
  docsReceivedDate?: string;
  inspectionDate?: string;
  reportSentDate?: string;
  fundsReleasedDate?: string;
  
  // Inspection data
  percentComplete?: number;
  notes?: string;
  riskFlags: RiskFlag[];
  
  // Photos
  photos: Photo[];
  
  createdAt: string;
  updatedAt: string;
}

export interface RiskFlag {
  id: string;
  drawId: string;
  type: 'delay' | 'budget' | 'quality' | 'documentation' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

// ============================================
// PHOTO TYPES
// ============================================

export type PhotoCategory = 'Exterior' | 'Interior' | 'Kitchen' | 'Bathroom' | 'Mechanical' | 'Misc';

export interface Photo {
  id: string;
  drawId: string;
  url: string;
  thumbnail: string;
  category: PhotoCategory;
  tags: string[];
  caption?: string;
  includedInReport: boolean;
  uploadedAt: string;
}

// ============================================
// INVOICE TYPES
// ============================================

export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  drawId: string;
  
  // Details
  serviceType: 'Standard' | 'Core' | 'High-Sensitivity' | 'Rush';
  amount: number;
  
  // Dates
  inspectionDate: string;
  reportSentDate: string;
  dueDate: string;
  sentDate?: string;
  paidDate?: string;
  
  status: InvoiceStatus;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// KICKOFF TYPES
// ============================================

export interface KickoffDocument {
  id: string;
  projectId: string;
  
  // Tracking
  sentAt?: string;
  viewedAt?: string;
  acknowledgedAt?: string;
  
  // Content sections
  projectOverview: string;
  drawProcess: string;
  requiredDocuments: string[];
  timelineExpectations: string;
  rolesAndResponsibilities: string;
  communicationProtocol: string;
  portalAccessInstructions: string;
  
  createdAt: string;
}

// ============================================
// CALCULATOR TYPES
// ============================================

export interface WindowCalculatorInput {
  totalBudget: number;
  projectDuration: number; // in days
  numberOfDraws: number;
}

export interface DrawSchedule {
  drawNumber: number;
  expectedDate: string;
  expectedPercent: number;
  expectedAmount: number;
}

export interface WindowCalculatorOutput {
  drawSchedule: DrawSchedule[];
  expectedCompletionPercent: number;
  scheduleStatus: 'On Track' | 'Behind' | 'Ahead';
  dailyBurnRate: number;
  drawInterval: number; // days between draws
}

// ============================================
// REPORT TYPES
// ============================================

export interface Report {
  id: string;
  drawId: string;
  projectId: string;
  
  // Executive Summary
  executiveSummary: string;
  percentComplete: number;
  summaryNotes: string;
  
  // Budget Analysis
  budgetItems: BudgetLineItem[];
  
  // Observations
  siteObservations: string;
  
  // Risk Assessment
  riskAssessment: string;
  
  // Documentation
  documentationReview: string;
  
  // Photos included
  photos: Photo[];
  
  // Metadata
  generatedAt: string;
  generatedBy: string;
  
  // File info
  pdfUrl?: string;
}

export interface BudgetLineItem {
  category: string;
  budgetAmount: number;
  invoicedAmount: number;
  observedPercent: number;
  status: 'aligned' | 'variance' | 'incomplete';
  notes?: string;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  editable: boolean;
}

export interface ReportData {
  // Cover Page
  projectName: string;
  projectNumber: string;
  projectAddress: string;
  lenderName: string;
  drawNumber: number;
  reportDate: string;
  
  // Executive Summary
  percentComplete: number;
  executiveSummary: string;
  
  // Draw Info
  requestedAmount: number;
  approvedAmount?: number;
  drawStatus: string;
  
  // Timeline
  requestedDate: string;
  docsReceivedDate?: string;
  inspectionDate?: string;
  reportSentDate?: string;
  fundsReleasedDate?: string;
  
  // Site Observations
  siteObservations: string;
  
  // Budget
  budgetItems: BudgetLineItem[];
  
  // Documentation
  documentationReview: string;
  
  // Risk Flags
  riskFlags: RiskFlag[];
  
  // Photos
  photos: Photo[];
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardMetrics {
  activeProjects: number;
  totalProjects: number;
  pendingDraws: number;
  totalDrawAmount: number;
  overdueInvoices: number;
  unpaidInvoiceTotal: number;
  upcomingInspections: number;
  overdueDraws: number;
  projectsAtRisk: number;
  unpaidInvoices: number;
  totalOutstanding: number;
  portfolioValue: number;
  avgCompletion: number;
  totalDraws: number;
}

export interface PriorityItem {
  id: string;
  type: 'inspection' | 'draw' | 'invoice' | 'risk' | 'document';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  dueDate?: string;
  projectId: string;
  projectName: string;
  actionUrl: string;
}

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'admin' | 'operator' | 'lender' | 'ceo' | 'inspector';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  lenderId?: string; // If user is a lender
  createdAt: string;
}