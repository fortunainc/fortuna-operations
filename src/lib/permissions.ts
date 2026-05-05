import { UserRole } from '@/types';

export interface Permission {
  label: string;
  allowed: UserRole[];
}

export const permissions: Record<string, Permission> = {
  // Project Management
  viewProjects: { label: 'View Projects', allowed: ['admin', 'operator', 'ceo', 'inspector', 'lender'] },
  createProjects: { label: 'Create Projects', allowed: ['admin', 'ceo'] },
  editProjects: { label: 'Edit Projects', allowed: ['admin', 'ceo'] },
  deleteProjects: { label: 'Delete Projects', allowed: ['admin', 'ceo'] },

  // Draw Management
  viewDraws: { label: 'View Draws', allowed: ['admin', 'operator', 'ceo', 'inspector', 'lender'] },
  createDraws: { label: 'Create Draws', allowed: ['admin', 'ceo', 'operator'] },
  editDraws: { label: 'Edit Draws', allowed: ['admin', 'ceo', 'operator'] },
  deleteDraws: { label: 'Delete Draws', allowed: ['admin', 'ceo'] },
  approveDraws: { label: 'Approve Draws', allowed: ['admin', 'ceo'] },
  completeInspections: { label: 'Complete Inspections', allowed: ['admin', 'ceo', 'inspector'] },

  // Report Generation
  generateReports: { label: 'Generate Reports', allowed: ['admin', 'ceo', 'operator'] },
  sendReports: { label: 'Send Reports', allowed: ['admin', 'ceo', 'operator'] },
  viewReports: { label: 'View Reports', allowed: ['admin', 'operator', 'ceo', 'inspector', 'lender'] },

  // Invoice Management
  viewInvoices: { label: 'View Invoices', allowed: ['admin', 'operator', 'ceo', 'lender'] },
  createInvoices: { label: 'Create Invoices', allowed: ['admin', 'ceo', 'operator'] },
  editInvoices: { label: 'Edit Invoices', allowed: ['admin', 'ceo', 'operator'] },
  sendInvoices: { label: 'Send Invoices', allowed: ['admin', 'ceo', 'operator'] },

  // Photo Management
  viewPhotos: { label: 'View Photos', allowed: ['admin', 'operator', 'ceo', 'inspector', 'lender'] },
  uploadPhotos: { label: 'Upload Photos', allowed: ['admin', 'ceo', 'inspector'] },
  deletePhotos: { label: 'Delete Photos', allowed: ['admin', 'ceo', 'operator'] },

  // Financial Access
  viewFinancials: { label: 'View Financial Data', allowed: ['admin', 'ceo', 'operator'] },
  editBudgets: { label: 'Edit Budgets', allowed: ['admin', 'ceo', 'operator'] },

  // User Management
  manageUsers: { label: 'Manage Users', allowed: ['admin', 'ceo'] },

  // System Settings
  manageSettings: { label: 'Manage Settings', allowed: ['admin', 'ceo'] },
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const perm = permissions[permission];
  if (!perm) return false;
  return perm.allowed.includes(role);
}

export function canGenerateReport(role: UserRole): boolean {
  return hasPermission(role, 'generateReports');
}

export function canSendReport(role: UserRole): boolean {
  return hasPermission(role, 'sendReports');
}

export function canApproveDraw(role: UserRole): boolean {
  return hasPermission(role, 'approveDraws');
}

export function canCompleteInspection(role: UserRole): boolean {
  return hasPermission(role, 'completeInspections');
}

export function canUploadPhotos(role: UserRole): boolean {
  return hasPermission(role, 'uploadPhotos');
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    admin: 'Administrator',
    operator: 'Operator',
    lender: 'Lender',
    ceo: 'CEO',
    inspector: 'Inspector',
  };
  return names[role] || role;
}

// Get role description
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    admin: 'Full system access and user management',
    operator: 'Day-to-day operations and report generation',
    lender: 'View-only access to assigned projects',
    ceo: 'Full access to strategic operations and approvals',
    inspector: 'Field inspections and photo documentation',
  };
  return descriptions[role] || '';
}