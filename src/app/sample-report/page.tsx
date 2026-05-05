'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { generateReportPDF, generateSampleReportData } from '@/components/reports/PDFGenerator';

export default function SampleReportPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSample = () => {
    setIsGenerating(true);
    
    const sampleData = generateSampleReportData();
    generateReportPDF(sampleData);
    
    setTimeout(() => setIsGenerating(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Sample Report Generator</h1>
        <p className="text-text-muted mt-1">
          Generate a professional sample report for marketing and client outreach
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Institutional-Quality Reports</h2>
            <p className="text-sm text-text-muted mt-1">
              Our reports are designed to meet lender requirements with clear sections, 
              professional formatting, and comprehensive documentation. Each report includes 
              executive summary, timeline, budget analysis, risk flags, and photo documentation.
            </p>
          </div>
        </div>
      </Card>

      {/* Sample Data Preview */}
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Sample Report Contents</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-secondary rounded-lg p-3">
              <p className="text-xs text-text-muted uppercase">Project</p>
              <p className="text-sm font-medium text-text-primary">Sunset Apartments</p>
            </div>
            <div className="bg-surface-secondary rounded-lg p-3">
              <p className="text-xs text-text-muted uppercase">Draw</p>
              <p className="text-sm font-medium text-text-primary">#3</p>
            </div>
            <div className="bg-surface-secondary rounded-lg p-3">
              <p className="text-xs text-text-muted uppercase">Completion</p>
              <p className="text-sm font-medium text-accent-success">62%</p>
            </div>
            <div className="bg-surface-secondary rounded-lg p-3">
              <p className="text-xs text-text-muted uppercase">Requested</p>
              <p className="text-sm font-medium text-text-primary">$425,000</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-text-primary mb-2">Report Sections:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                'Executive Summary',
                'Draw Timeline',
                'Site Observations',
                'Photo Documentation',
                'Budget vs Progress',
                'Documentation Review',
                'Risk Flags',
                'Legal Disclaimer'
              ].map((section) => (
                <div key={section} className="flex items-center gap-2 text-sm text-text-muted">
                  <svg className="w-4 h-4 text-accent-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {section}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-text-primary mb-2">Budget Line Items (Sample):</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-text-muted">Category</th>
                    <th className="text-right py-2 px-2 text-text-muted">Budget</th>
                    <th className="text-right py-2 px-2 text-text-muted">Invoiced</th>
                    <th className="text-right py-2 px-2 text-text-muted">% Complete</th>
                    <th className="text-center py-2 px-2 text-text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'Site Work', budget: 85000, invoiced: 78000, pct: 90, status: 'Aligned' },
                    { cat: 'Foundation', budget: 145000, invoiced: 145000, pct: 100, status: 'Aligned' },
                    { cat: 'Framing', budget: 195000, invoiced: 165000, pct: 85, status: 'Aligned' },
                    { cat: 'Plumbing', budget: 95000, invoiced: 58000, pct: 55, status: 'Variance' },
                  ].map((item) => (
                    <tr key={item.cat} className="border-b border-border-subtle">
                      <td className="py-2 px-2 text-text-primary">{item.cat}</td>
                      <td className="py-2 px-2 text-right text-text-muted">${item.budget.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right text-text-muted">${item.invoiced.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-medium">{item.pct}%</td>
                      <td className="py-2 px-2 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'Aligned' 
                            ? 'bg-accent-success/10 text-accent-success' 
                            : 'bg-accent-warning/10 text-accent-warning'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerateSample}
          disabled={isGenerating}
          className="px-8"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Generate Sample Report PDF
            </>
          )}
        </Button>
      </div>

      {/* Usage Info */}
      <Card className="bg-surface-secondary">
        <h3 className="text-sm font-semibold text-text-primary mb-2">Usage</h3>
        <ul className="text-sm text-text-muted space-y-1">
          <li>• Click "Generate Sample Report PDF" to create a professional sample report</li>
          <li>• The PDF will open in a new window for printing or saving</li>
          <li>• Use this sample for website展示, client presentations, or marketing materials</li>
          <li>• All data is realistic mock data - no actual project information</li>
        </ul>
      </Card>
    </div>
  );
}