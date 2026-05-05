'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input, { Select } from '@/components/ui/Input';
import ProgressBar from '@/components/ui/ProgressBar';
import { 
  projects, 
  lenders, 
  developers,
  formatCurrency, 
  formatDate, 
  calculateProjectProgress,
  getDrawsByProject
} from '@/lib/data';
import { Project, ProjectStatus, ProjectType } from '@/types';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [lenderFilter, setLenderFilter] = useState<string>('all');

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.projectType === typeFilter;
    const matchesLender = lenderFilter === 'all' || project.lender.id === lenderFilter;
    return matchesSearch && matchesStatus && matchesType && matchesLender;
  });

  // Calculate summary stats
  const totalLoanAmount = filteredProjects.reduce((sum, p) => sum + p.loanAmount, 0);
  const activeCount = filteredProjects.filter(p => p.status !== 'Complete').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-sm text-text-muted mt-1">
            {filteredProjects.length} projects • {formatCurrency(totalLoanAmount)} total loan value
          </p>
        </div>
        <Button variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </Button>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'On Track', label: 'On Track' },
              { value: 'At Risk', label: 'At Risk' },
              { value: 'Behind', label: 'Behind' },
              { value: 'Complete', label: 'Complete' },
            ]}
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'SFR', label: 'SFR' },
              { value: 'Multifamily', label: 'Multifamily' },
              { value: 'Ground-up', label: 'Ground-up' },
            ]}
          />
          <Select
            value={lenderFilter}
            onChange={(e) => setLenderFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Lenders' },
              ...lenders.map(l => ({ value: l.id, label: l.name })),
            ]}
          />
        </div>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="text-center py-12">
          <svg className="w-12 h-12 mx-auto mb-4 text-text-muted opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-text-muted">No projects found matching your criteria</p>
        </Card>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const progress = calculateProjectProgress(project.id);
  const draws = getDrawsByProject(project.id);
  const completedDraws = draws.filter(d => d.status === 'Funds Released').length;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card hover className="cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-text-muted font-mono">{project.projectNumber}</span>
              <Badge 
                variant={
                  project.status === 'On Track' ? 'success' : 
                  project.status === 'At Risk' ? 'warning' : 
                  project.status === 'Behind' ? 'danger' : 'info'
                }
                size="sm"
              >
                {project.status}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-text-primary truncate">{project.name}</h3>
            <p className="text-sm text-text-muted truncate">{project.address}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-text-primary">{formatCurrency(project.loanAmount)}</p>
            <p className="text-xs text-text-muted">{project.projectType}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-text-muted mb-1">Lender</p>
            <p className="text-sm text-text-primary">{project.lender.name}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Developer</p>
            <p className="text-sm text-text-primary">{project.developer.name}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Progress</span>
            <span className="text-xs text-text-primary font-medium">{progress}%</span>
          </div>
          <ProgressBar 
            value={progress} 
            color={
              project.status === 'On Track' ? 'success' : 
              project.status === 'At Risk' ? 'warning' : 
              project.status === 'Behind' ? 'danger' : 'primary'
            }
          />
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Draws: {completedDraws}/{project.numberOfDraws}</span>
          <span>End: {formatDate(project.expectedEndDate)}</span>
        </div>
      </Card>
    </Link>
  );
}