'use client';

import { useState, useRef } from 'react';
import { Draw, Project, RiskFlag, Photo, BudgetLineItem, ReportData } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import { formatCurrency, formatDate, updateDrawStatusOnReportSent } from '@/lib/data';
import EmailModal from './EmailModal';
import InspectionChecklist from '../inspections/InspectionChecklist';
import { generateAISummary, detectRisks, callAIService, type SummaryInput, type RiskDetectionInput, type SuggestedRiskFlag } from '@/lib/aiServices';

interface ReportBuilderProps {
  project: Project;
  draw: Draw;
  onSave: (reportData: ReportData) => void;
  onGeneratePDF: (reportData: ReportData) => void;
  onSendReport?: (reportData: ReportData) => void;
}

const defaultBudgetItems: BudgetLineItem[] = [
  { category: 'Site Work', budgetAmount: 0, invoicedAmount: 0, observedPercent: 0, status: 'incomplete' },
  { category: 'Foundation', budgetAmount: 0, invoicedAmount: 0, observedPercent: 0, status: 'incomplete' },
  { category: 'Framing', budgetAmount: 0, invoicedAmount: 0, observedPercent: 0, status: 'incomplete' },
  { category: 'Electrical', budgetAmount: 0, invoicedAmount: 0, observedPercent: 0, status: 'incomplete' },
  { category: 'Plumbing', budgetAmount: 0, invoicedAmount: 0, observedPercent: 0, status: 'incomplete' },
  { category: 'HVAC', budgetAmount: 0, invoicedAmount: 0, observedPercent: 0, status: 'incomplete' },
  { category: 'Interior Finish', budgetAmount: 0, invoicedAmount: 0, observedPercent: 0, status: 'incomplete' },
  { category: 'Exterior Finish', budgetAmount: 0, invoicedAmount: 0, observedPercent: 0, status: 'incomplete' },
];

export default function ReportBuilder({ project, draw, onSave, onGeneratePDF, onSendReport }: ReportBuilderProps) {
  const [percentComplete, setPercentComplete] = useState(draw.percentComplete || 0);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [siteObservations, setSiteObservations] = useState(draw.notes || '');
  const [documentationReview, setDocumentationReview] = useState('');
  const [budgetItems, setBudgetItems] = useState<BudgetLineItem[]>(defaultBudgetItems);
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [checklistComplete, setChecklistComplete] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [detectingRisks, setDetectingRisks] = useState(false);
  const [suggestedRisks, setSuggestedRisks] = useState<SuggestedRiskFlag[]>([]);
  const [showSuggestedRisks, setShowSuggestedRisks] = useState(false);

  // Auto-generate executive summary based on data
  const generateAutoSummary = () => {
    const summary = `This report covers Draw #${draw.drawNumber} for ${project.name} located at ${project.address}. ` +
      `The project is currently ${percentComplete}% complete. ` +
      `The requested draw amount is ${formatCurrency(draw.requestedAmount)}. ` +
      `${draw.riskFlags.length > 0 ? `There ${draw.riskFlags.length === 1 ? 'is' : 'are'} ${draw.riskFlags.length} risk flag(s) identified that require attention. ` : ''}` +
      `The project status is ${project.status}.`;
    setExecutiveSummary(summary);
  };

  // AI-powered summary generation
  const handleGenerateAISummary = async () => {
    setGeneratingSummary(true);
    try {
      const input: SummaryInput = {
        observedCompletion: percentComplete,
        previousCompletion: percentComplete - 5, // Estimate previous as 5% less
        requestedDraw: Math.round((percentComplete / 100) * (draw.requestedAmount / 0.15)), // Estimate from draw amount
        riskFlags: draw.riskFlags.map(f => f.type),
        siteObservations: siteObservations,
        documentationComplete: documentationReview.length > 0,
        missingDocs: [],
      };
      
      const result = await callAIService<{ summary: string; confidence: number }>(input, 'summary');
      setExecutiveSummary(result.summary);
    } catch (error) {
      console.error('AI summary generation failed:', error);
      // Fallback to auto-generated summary
      generateAutoSummary();
    } finally {
      setGeneratingSummary(false);
    }
  };

  // AI-powered risk detection
  const handleDetectRisks = async () => {
    setDetectingRisks(true);
    try {
      const input: RiskDetectionInput = {
        claimedCompletion: Math.round((draw.requestedAmount / (project.loanAmount || 1)) * 100),
        observedCompletion: percentComplete,
        documentationComplete: documentationReview.length > 0,
        documentationItems: ['Draw Request', 'Budget Update', 'Invoices'],
        timelineOnTrack: true,
        daysBehindSchedule: 0,
        previousCompletions: [percentComplete - 5 || 0],
      };
      
      const risks = await callAIService<SuggestedRiskFlag[]>(input, 'riskDetection');
      setSuggestedRisks(risks);
      setShowSuggestedRisks(risks.length > 0);
    } catch (error) {
      console.error('AI risk detection failed:', error);
    } finally {
      setDetectingRisks(false);
    }
  };

  // Accept suggested risk
  const handleAcceptRisk = (risk: SuggestedRiskFlag) => {
    const timestamp = Date.now();
    const newRisk: RiskFlag = {
      id: `risk-${timestamp}`,
      drawId: draw.id,
      type: risk.type as string,
      description: risk.description,
      severity: risk.severity,
      resolved: false,
      createdAt: new Date(timestamp).toISOString(),
    };
    draw.riskFlags.push(newRisk);
    setSuggestedRisks(prev => prev.filter(r => r !== risk));
  };

  const updateBudgetItem = (index: number, field: keyof BudgetLineItem, value: number | string) => {
    const updated = [...budgetItems];
    (updated[index] as any)[field] = value;
    
    // Auto-update status based on variance
    if (field === 'observedPercent' || field === 'budgetAmount' || field === 'invoicedAmount') {
      const item = updated[index];
      if (item.observedPercent === 0) {
        item.status = 'incomplete';
      } else if (Math.abs(item.observedPercent - (item.invoicedAmount / (item.budgetAmount || 1)) * 100) > 10) {
        item.status = 'variance';
      } else {
        item.status = 'aligned';
      }
    }
    setBudgetItems(updated);
  };

  const reportData: ReportData = {
    projectName: project.name,
    projectNumber: project.projectNumber,
    projectAddress: project.address,
    lenderName: project.lender.name,
    drawNumber: draw.drawNumber,
    reportDate: new Date().toISOString().split('T')[0],
    percentComplete,
    executiveSummary,
    requestedAmount: draw.requestedAmount,
    approvedAmount: draw.approvedAmount,
    drawStatus: draw.status,
    requestedDate: draw.requestedDate,
    docsReceivedDate: draw.docsReceivedDate,
    inspectionDate: draw.inspectionDate,
    reportSentDate: draw.reportSentDate,
    fundsReleasedDate: draw.fundsReleasedDate,
    siteObservations,
    budgetItems,
    documentationReview,
    riskFlags: draw.riskFlags,
    photos: draw.photos,
  };

  const sections = [
    { id: 'checklist', label: 'Inspection Checklist', icon: '✅' },
    { id: 'summary', label: 'Executive Summary', icon: '📋' },
    { id: 'timeline', label: 'Draw Timeline', icon: '📅' },
    { id: 'observations', label: 'Site Observations', icon: '👁️' },
    { id: 'budget', label: 'Budget vs Progress', icon: '💰' },
    { id: 'documentation', label: 'Documentation', icon: '📄' },
    { id: 'risks', label: 'Risk Flags', icon: '⚠️' },
    { id: 'photos', label: 'Photos', icon: '📷' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Report Builder</h2>
          <p className="text-sm text-text-muted">
            {project.projectNumber} • Draw #{draw.drawNumber}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => onSave(reportData)}>
            Save Draft
          </Button>
          <Button variant="secondary" onClick={() => onGeneratePDF(reportData)} disabled={!checklistComplete}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Preview PDF
          </Button>
          {!checklistComplete && (
            <span className="text-xs text-accent-warning flex items-center">
              ⚠️ Complete inspection checklist first
            </span>
          )}
          <Button 
            variant="primary" 
            onClick={() => setShowEmailModal(true)}
            disabled={reportSent}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {reportSent ? 'Report Sent ✓' : 'Send Report'}
          </Button>
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSend={() => {
          setReportSent(true);
          // Update draw status to "Report Sent"
          updateDrawStatusOnReportSent(draw.id);
          onSendReport?.(reportData);
        }}
        type="report"
        data={{
          to: project.lender.email,
          projectName: project.name,
          drawNumber: draw.drawNumber,
        }}
      />

      {/* Progress Completion */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Project Completion: {percentComplete}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={percentComplete}
              onChange={(e) => setPercentComplete(parseInt(e.target.value))}
              className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-accent-primary"
            />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent-primary">{percentComplete}%</p>
            <p className="text-xs text-text-muted">Complete</p>
          </div>
        </div>
      </Card>

      {/* Section Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeSection === section.id
                ? 'bg-accent-primary text-white'
                : 'bg-surface-elevated text-text-muted hover:bg-surface-hover'
            }`}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="min-h-[400px]">
        {activeSection === 'checklist' && (
          <Card>
            <InspectionChecklist onComplete={setChecklistComplete} />
          </Card>
        )}

        {activeSection === 'summary' && (
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Executive Summary</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={generateAutoSummary}
                    disabled={generatingSummary}
                  >
                    ✨ Basic
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleGenerateAISummary}
                    disabled={generatingSummary}
                  >
                    {generatingSummary ? '⏳ Generating...' : '🤖 Generate AI Summary'}
                  </Button>
                </div>
              </div>
              <Textarea
                value={executiveSummary}
                onChange={(e) => setExecutiveSummary(e.target.value)}
                placeholder="Enter executive summary or click Generate AI Summary..."
                rows={6}
              />
              <div className="grid grid-cols-3 gap-4 p-4 bg-surface-elevated rounded-lg">
                <div>
                  <p className="text-xs text-text-muted">Project</p>
                  <p className="text-sm font-medium text-text-primary">{project.name}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Draw Amount</p>
                  <p className="text-sm font-medium text-text-primary">{formatCurrency(draw.requestedAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Lender</p>
                  <p className="text-sm font-medium text-text-primary">{project.lender.name}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'timeline' && (
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Draw Timeline Snapshot</h3>
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border-subtle" />
              
              <div className="space-y-4">
                {[
                  { label: 'Draw Requested', date: draw.requestedDate, completed: true },
                  { label: 'Docs Received', date: draw.docsReceivedDate, completed: !!draw.docsReceivedDate },
                  { label: 'Inspection', date: draw.inspectionDate, completed: !!draw.inspectionDate },
                  { label: 'Report Sent', date: draw.reportSentDate, completed: !!draw.reportSentDate },
                  { label: 'Funds Released', date: draw.fundsReleasedDate, completed: !!draw.fundsReleasedDate },
                ].map((step, index) => (
                  <div key={index} className="relative flex items-center gap-4 pl-10">
                    <div className={`absolute left-2.5 w-3 h-3 rounded-full ${
                      step.completed ? 'bg-accent-success' : 'bg-surface-elevated border-2 border-border-subtle'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{step.label}</p>
                      {step.date && (
                        <p className="text-xs text-text-muted">{formatDate(step.date)}</p>
                      )}
                    </div>
                    {step.completed && (
                      <Badge variant="success" size="sm">Complete</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'observations' && (
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Site Observations</h3>
            <Textarea
              value={siteObservations}
              onChange={(e) => setSiteObservations(e.target.value)}
              placeholder="Enter detailed site observations..."
              rows={10}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <p className="text-xs text-text-muted w-full mb-1">Quick Templates:</p>
              <button
                onClick={() => setSiteObservations(prev => prev + '\n\n• Foundation work observed to be complete.\n• Framing is in progress with approximately 80% complete.\n• Electrical rough-in has begun on first floor.')}
                className="px-3 py-1 text-xs bg-surface-elevated rounded-full text-text-muted hover:bg-surface-hover"
              >
                Standard Progress
              </button>
              <button
                onClick={() => setSiteObservations(prev => prev + '\n\n• Weather delay noted on [date].\n• Material delivery pending.\n• Additional inspection recommended.')}
                className="px-3 py-1 text-xs bg-surface-elevated rounded-full text-text-muted hover:bg-surface-hover"
              >
                Delay Notes
              </button>
            </div>
          </Card>
        )}

        {activeSection === 'budget' && (
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Budget vs Progress Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left px-3 py-2 text-xs font-medium text-text-muted uppercase">Category</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-text-muted uppercase">Budget</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-text-muted uppercase">Invoiced</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-text-muted uppercase">Observed %</th>
                    <th className="text-center px-3 py-2 text-xs font-medium text-text-muted uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {budgetItems.map((item, index) => (
                    <tr key={item.category}>
                      <td className="px-3 py-2 text-sm text-text-primary">{item.category}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.budgetAmount || ''}
                          onChange={(e) => updateBudgetItem(index, 'budgetAmount', parseFloat(e.target.value) || 0)}
                          className="w-24 bg-surface-elevated border border-border-subtle rounded px-2 py-1 text-sm text-right text-text-primary"
                          placeholder="$0"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.invoicedAmount || ''}
                          onChange={(e) => updateBudgetItem(index, 'invoicedAmount', parseFloat(e.target.value) || 0)}
                          className="w-24 bg-surface-elevated border border-border-subtle rounded px-2 py-1 text-sm text-right text-text-primary"
                          placeholder="$0"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.observedPercent || ''}
                          onChange={(e) => updateBudgetItem(index, 'observedPercent', parseInt(e.target.value) || 0)}
                          className="w-16 bg-surface-elevated border border-border-subtle rounded px-2 py-1 text-sm text-right text-text-primary"
                          placeholder="0%"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Badge 
                          variant={
                            item.status === 'aligned' ? 'success' : 
                            item.status === 'variance' ? 'warning' : 'muted'
                          }
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeSection === 'documentation' && (
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Documentation Review</h3>
            <Textarea
              value={documentationReview}
              onChange={(e) => setDocumentationReview(e.target.value)}
              placeholder="Review of submitted documentation (invoices, receipts, lien releases, etc.)..."
              rows={8}
            />
            <div className="mt-4 p-4 bg-surface-elevated rounded-lg">
              <p className="text-xs text-text-muted mb-2">Standard Documents Checklist:</p>
              <div className="grid grid-cols-2 gap-2">
                {['Draw Request Form', 'Budget Update', 'Invoices', 'Receipts', 'Lien Releases', 'Waivers'].map((doc) => (
                  <label key={doc} className="flex items-center gap-2 text-sm text-text-primary">
                    <input type="checkbox" className="rounded border-border-subtle bg-surface" />
                    {doc}
                  </label>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'risks' && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Risk Flags</h3>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleDetectRisks}
                disabled={detectingRisks}
              >
                {detectingRisks ? '⏳ Detecting...' : '🔍 AI Detect Risks'}
              </Button>
            </div>

            {/* Suggested Risks */}
            {showSuggestedRisks && suggestedRisks.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-3">
                  💡 Suggested Risk Flags
                </h4>
                <div className="space-y-3">
                  {suggestedRisks.map((risk, index) => (
                    <div key={index} className="p-3 bg-white rounded border border-blue-100">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-text-primary capitalize">
                          {risk.type}
                        </p>
                        <Badge variant={risk.severity === 'high' ? 'danger' : 'warning'}>
                          {risk.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-muted mb-3">{risk.description}</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleAcceptRisk(risk)}
                        >
                          ✓ Accept
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSuggestedRisks(prev => prev.filter(r => r !== risk))}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {draw.riskFlags.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto mb-3 text-accent-success opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-text-muted">No risk flags identified</p>
              </div>
            ) : (
              <div className="space-y-3">
                {draw.riskFlags.map((flag) => (
                  <div key={flag.id} className="p-4 bg-surface-elevated rounded-lg border-l-4 border-accent-warning">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary capitalize">{flag.type} Risk</p>
                        <p className="text-sm text-text-muted mt-1">{flag.description}</p>
                      </div>
                      <Badge 
                        variant={flag.severity === 'high' ? 'danger' : flag.severity === 'medium' ? 'warning' : 'muted'}
                      >
                        {flag.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeSection === 'photos' && (
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Photos</h3>
            {draw.photos.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-border-subtle rounded-lg">
                <svg className="w-12 h-12 mx-auto mb-3 text-text-muted opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-text-muted mb-4">No photos uploaded yet</p>
                <Button variant="secondary">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload Photos
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {draw.photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="aspect-video bg-surface-elevated rounded-lg overflow-hidden">
                      <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-text-muted">{photo.category}</p>
                      <p className="text-sm text-text-primary">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Legal Disclaimer Preview */}
      <Card className="bg-surface-elevated">
        <p className="text-xs text-text-muted">
          <strong>Legal Disclaimer:</strong> This report is prepared for the exclusive use of {project.lender.name} and contains confidential information. 
          The observations and assessments herein are based on a visual inspection conducted on {draw.inspectionDate ? formatDate(draw.inspectionDate) : '[date]'}. 
          Fortuna Draw Group makes no warranty, expressed or implied, regarding the condition of the property or the accuracy of information provided by third parties.
        </p>
      </Card>
    </div>
  );
}