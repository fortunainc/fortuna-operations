'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import ReportBuilder from '@/components/reports/ReportBuilder';
import { generateReportPDF } from '@/components/reports/PDFGenerator';
import Button from '@/components/ui/Button';
import { 
  getProjectById, 
  getDrawsByProject,
  formatCurrency 
} from '@/lib/data';
import { ReportData } from '@/types';

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const drawId = params.drawId as string;

  const project = getProjectById(projectId);
  const draws = getDrawsByProject(projectId);
  const draw = draws.find(d => d.id === drawId);

  const [savedReport, setSavedReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!project || !draw) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Not Found</h1>
        <p className="text-text-muted mb-4">Project or draw not found</p>
        <Button variant="secondary" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const handleSaveReport = (reportData: ReportData) => {
    setSavedReport(reportData);
    // In a real app, this would save to a database
    console.log('Report saved:', reportData);
    alert('Report draft saved!');
  };

  const handleGeneratePDF = (reportData: ReportData) => {
    setIsGenerating(true);
    try {
      generateReportPDF(reportData);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button 
          onClick={() => router.push('/projects')}
          className="text-text-muted hover:text-text-primary"
        >
          Projects
        </button>
        <span className="text-text-muted">/</span>
        <button 
          onClick={() => router.push(`/projects/${projectId}`)}
          className="text-text-muted hover:text-text-primary"
        >
          {project.name}
        </button>
        <span className="text-text-muted">/</span>
        <span className="text-text-primary">Draw #{draw.drawNumber} Report</span>
      </div>

      <ReportBuilder
        project={project}
        draw={draw}
        onSave={handleSaveReport}
        onGeneratePDF={handleGeneratePDF}
      />
    </div>
  );
}