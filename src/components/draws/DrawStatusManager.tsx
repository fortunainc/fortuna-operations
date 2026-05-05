'use client';

import { useState } from 'react';
import { Draw, DrawStatus } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  updateDrawStatusOnDocsReceived,
  updateDrawStatusOnInspectionScheduled,
  updateDrawStatusOnInspectionComplete,
  updateDrawStatusOnReportSent,
  updateDrawStatusOnFundsReleased,
  formatCurrency,
  formatDate,
} from '@/lib/data';

interface DrawStatusManagerProps {
  draw: Draw;
  onUpdate?: (updatedDraw: Draw) => void;
}

const statusProgression: { status: DrawStatus; label: string; action: string }[] = [
  { status: 'Requested', label: 'Requested', action: 'Mark Docs Received' },
  { status: 'Docs Received', label: 'Docs Received', action: 'Schedule Inspection' },
  { status: 'Inspection Scheduled', label: 'Inspection Scheduled', action: 'Complete Inspection' },
  { status: 'Inspected', label: 'Inspected', action: 'Send Report' },
  { status: 'Report Sent', label: 'Report Sent', action: 'Release Funds' },
  { status: 'Funds Released', label: 'Funds Released', action: 'Complete' },
];

export default function DrawStatusManager({ draw, onUpdate }: DrawStatusManagerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [inspectionDate, setInspectionDate] = useState('');
  const [percentComplete, setPercentComplete] = useState(draw.percentComplete || 0);
  const [notes, setNotes] = useState(draw.notes || '');
  const [showModal, setShowModal] = useState(false);

  const currentIndex = statusProgression.findIndex(s => s.status === draw.status);
  const nextStep = currentIndex < statusProgression.length - 1 ? statusProgression[currentIndex + 1] : null;

  const handleAction = async () => {
    setIsProcessing(true);
    let updatedDraw: Draw | null = null;

    switch (draw.status) {
      case 'Requested':
        updatedDraw = updateDrawStatusOnDocsReceived(draw.id);
        break;
      case 'Docs Received':
        // Show modal to schedule inspection
        setShowModal(true);
        setIsProcessing(false);
        return;
      case 'Inspection Scheduled':
        // Show modal to complete inspection
        setShowModal(true);
        setIsProcessing(false);
        return;
      case 'Inspected':
        updatedDraw = updateDrawStatusOnReportSent(draw.id);
        break;
      case 'Report Sent':
        updatedDraw = updateDrawStatusOnFundsReleased(draw.id);
        break;
    }

    if (updatedDraw) {
      onUpdate?.(updatedDraw);
    }
    setIsProcessing(false);
  };

  const handleScheduleInspection = () => {
    if (!inspectionDate) return;
    const updatedDraw = updateDrawStatusOnInspectionScheduled(draw.id, inspectionDate);
    if (updatedDraw) {
      onUpdate?.(updatedDraw);
    }
    setShowModal(false);
  };

  const handleCompleteInspection = () => {
    const updatedDraw = updateDrawStatusOnInspectionComplete(draw.id, percentComplete, notes);
    if (updatedDraw) {
      onUpdate?.(updatedDraw);
    }
    setShowModal(false);
  };

  const getStatusColor = (status: DrawStatus): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
    switch (status) {
      case 'Funds Released': return 'success';
      case 'Report Sent': return 'info';
      case 'Inspection Scheduled': return 'warning';
      case 'Inspected': return 'default';
      case 'On Hold': return 'danger';
      default: return 'default';
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Current Status */}
        <Badge variant={getStatusColor(draw.status)}>{draw.status}</Badge>
        
        {/* Progress Dots */}
        <div className="hidden md:flex items-center gap-1">
          {statusProgression.map((step, index) => (
            <div
              key={step.status}
              className={`w-2 h-2 rounded-full ${
                index <= currentIndex
                  ? 'bg-accent-primary'
                  : index === currentIndex + 1
                  ? 'bg-accent-warning'
                  : 'bg-surface-elevated'
              }`}
              title={step.label}
            />
          ))}
        </div>

        {/* Next Action Button */}
        {nextStep && draw.status !== 'On Hold' && (
          <Button
            variant={draw.status === 'Inspected' ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleAction}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : nextStep.action}
          </Button>
        )}

        {draw.status === 'Funds Released' && (
          <span className="text-xs text-accent-success flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Complete
          </span>
        )}
      </div>

      {/* Schedule Inspection Modal */}
      {showModal && draw.status === 'Docs Received' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Schedule Inspection</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Inspection Date</label>
                <input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="w-full bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleScheduleInspection} disabled={!inspectionDate}>
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Inspection Modal */}
      {showModal && draw.status === 'Inspection Scheduled' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Complete Inspection</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Percent Complete: {percentComplete}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={percentComplete}
                  onChange={(e) => setPercentComplete(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Inspection notes..."
                  className="w-full bg-surface-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary min-h-[80px]"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleCompleteInspection}>
                  Complete Inspection
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}