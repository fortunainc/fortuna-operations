'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole } from '@/types';
import { getRoleDisplayName, getRoleDescription } from '@/lib/permissions';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Demo users for each role
  const demoUsers: Record<UserRole, Omit<User, 'createdAt'>> = {
    admin: {
      id: '1',
      email: 'admin@fortunadrawgroup.com',
      name: 'System Admin',
      role: 'admin',
    },
    ceo: {
      id: '2',
      email: 'ceo@fortunadrawgroup.com',
      name: 'CEO',
      role: 'ceo',
      lenderId: undefined,
    },
    operator: {
      id: '3',
      email: 'operator@fortunadrawgroup.com',
      name: 'Operations Manager',
      role: 'operator',
    },
    inspector: {
      id: '4',
      email: 'inspector@fortunadrawgroup.com',
      name: 'Field Inspector',
      role: 'inspector',
    },
    lender: {
      id: '5',
      email: 'lender@bank.com',
      name: 'Lender Representative',
      role: 'lender',
      lenderId: 'bank-1',
    },
  };

  const handleLogin = (role: UserRole) => {
    const user = {
      ...demoUsers[role],
      createdAt: new Date().toISOString(),
    };
    login(user as User);
    router.push('/');
  };

  const roles: UserRole[] = ['ceo', 'admin', 'operator', 'inspector', 'lender'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050d18] to-[#0a1628] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#6b8cae] to-[#4a7c59] rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Fortuna Operations</h1>
          <p className="text-[#8ba4c4]">Verified Draw Reporting System</p>
        </div>

        {/* User Selection */}
        <Card className="bg-[#0a1628] border-[#162a47]">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Select Your Role</h2>
            <p className="text-sm text-[#8ba4c4]">
              Choose a role to log in and test different permission levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => handleLogin(role)}
                className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                  selectedRole === role
                    ? 'border-[#6b8cae] bg-[#6b8cae]/10'
                    : 'border-[#162a47] bg-[#0f1f35] hover:border-[#6b8cae]/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    role === 'ceo' ? 'bg-purple-600' :
                    role === 'admin' ? 'bg-red-600' :
                    role === 'operator' ? 'bg-blue-600' :
                    role === 'inspector' ? 'bg-green-600' :
                    'bg-yellow-600'
                  }`}>
                    <span className="text-white font-bold">
                      {getRoleDisplayName(role).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{getRoleDisplayName(role)}</h3>
                    <p className="text-xs text-[#8ba4c4]">{demoUsers[role].email}</p>
                  </div>
                </div>
                <p className="text-xs text-[#868e96] mt-2">
                  {getRoleDescription(role)}
                </p>
              </button>
            ))}
          </div>

          {/* Permissions Key */}
          <div className="mt-8 pt-6 border-t border-[#162a47]">
            <h3 className="text-sm font-semibold text-white mb-3">Permission Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded"></div>
                <span className="text-[#8ba4c4]">
                  <strong>CEO:</strong> Full access, approvals, strategic decisions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                <span className="text-[#8ba4c4]">
                  <strong>Admin:</strong> System management, user management
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-[#8ba4c4]">
                  <strong>Operator:</strong> Reports, draws, daily operations
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span className="text-[#8ba4c4]">
                  <strong>Inspector:</strong> Field inspections, photo uploads
                </span>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                <span className="text-[#8ba4c4]">
                  <strong>Lender:</strong> View-only access to assigned projects
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#868e96]">
            This is a demo login page. In production, implement proper authentication.
          </p>
        </div>
      </div>
    </div>
  );
}