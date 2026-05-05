'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { 
  hasPermission, 
  canGenerateReport, 
  canSendReport, 
  canApproveDraw, 
  canCompleteInspection,
  canUploadPhotos,
  getRoleDisplayName 
} from '@/lib/permissions';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canGenerateReport: () => boolean;
  canSendReport: () => boolean;
  canApproveDraw: () => boolean;
  canCompleteInspection: () => boolean;
  canUploadPhotos: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('fortuna_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('fortuna_user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fortuna_user');
  };

  const checkPermission = (permission: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  const value = {
    user,
    login,
    logout,
    hasPermission: checkPermission,
    canGenerateReport: () => user ? canGenerateReport(user.role) : false,
    canSendReport: () => user ? canSendReport(user.role) : false,
    canApproveDraw: () => user ? canApproveDraw(user.role) : false,
    canCompleteInspection: () => user ? canCompleteInspection(user.role) : false,
    canUploadPhotos: () => user ? canUploadPhotos(user.role) : false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helpful wrapper components
export function PermissionGuard({ 
  permission, 
  fallback = null, 
  children 
}: { 
  permission: string; 
  fallback?: React.ReactNode; 
  children: React.ReactNode;
}) {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

export function RoleGuard({ 
  roles, 
  fallback = null, 
  children 
}: { 
  roles: UserRole[]; 
  fallback?: React.ReactNode; 
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  
  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}