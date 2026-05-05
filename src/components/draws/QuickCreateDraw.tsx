'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Project, Draw } from '@/types';

interface QuickCreateDrawProps {
  projects: Project[];
  onCreateDraw: (draw: Partial<Draw>) => void;
  onStartReport?: (drawId: string) => void;
}

export default function QuickCreateDraw({ projects, onCreateDraw, onStartReport }: QuickCreateDrawProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'details' | 'photos' | 'complete'>('select');
  
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [percentComplete, setPercentComplete] = useState(0);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [newDrawId, setNewDrawId] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleCreateDraw = () => {
    const existingDraws = selectedProject?.numberOfDraws || 0;
    const drawId = `draw-new-${Date.now()}`;
    
    const newDraw: Partial<Draw> = {
      id: drawId,
      projectId: selectedProjectId,
      drawNumber: existingDraws + 1,
      requestedAmount: 0, // To be filled later
      status: 'Requested',
      requestedDate: new Date().toISOString().split('T')[0],
      percentComplete,
      notes,
      riskFlags: [],
      photos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onCreateDraw(newDraw);
    setNewDrawId(drawId);
    setStep('photos');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setPhotos(prev => [...prev, ...Array.from(files) as File[]]);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    setStep('select');
    setSelectedProjectId('');
    setPercentComplete(0);
    setNotes('');
    setPhotos([]);
    
    if (newDrawId && onStartReport) {
      onStartReport(newDrawId);
    }
  };

  const resetModal = () => {
    setIsOpen(false);
    setStep('select');
    setSelectedProjectId('');
    setPercentComplete(0);
    setNotes('');
    setPhotos([]);
    setNewDrawId(null);
  };

  if (!isOpen) {
    return (
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Quick Create Draw
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Quick Create Draw</h2>
            <p className="text-sm text-text-muted">
              {step === 'select' && 'Select a project'}
              {step === 'details' && 'Enter draw details'}
              {step === 'photos' && 'Upload photos (optional)'}
              {step === 'complete' && 'Draw created!'}
            </p>
          </div>
          <button
            onClick={resetModal}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Step 1: Select Project */}
          {step === 'select' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Select Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Choose a project...</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.projectNumber})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProject && (
                <div className="bg-surface-secondary rounded-lg p-3">
                  <p className="text-sm text-text-muted">
                    <span className="font-medium text-text-primary">{selectedProject.name}</span><br />
                    {selectedProject.address}<br />
                    Lender: {selectedProject.lender.name}
                  </p>
                </div>
              )}

              <Button
                variant="primary"
                fullWidth
                disabled={!selectedProjectId}
                onClick={() => setStep('details')}
              >
                Continue →
              </Button>
            </div>
          )}

          {/* Step 2: Enter Details */}
          {step === 'details' && (
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-primary">
                  {selectedProject?.name} • Draw #{(selectedProject?.numberOfDraws || 0) + 1}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Completion Percentage
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={percentComplete}
                    onChange={(e) => setPercentComplete(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg font-bold text-primary w-16 text-right">{percentComplete}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Quick Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Current status, observations, issues..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setStep('select')}
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateDraw}
                  className="flex-1"
                >
                  Create Draw
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Upload Photos */}
          {step === 'photos' && (
            <div className="space-y-4">
              <div className="bg-accent-success/10 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">✓</div>
                <p className="text-accent-success font-medium">Draw Created Successfully!</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Upload Photos (Optional)
                </label>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <input
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-text-muted">Tap to upload photos</p>
                  <p className="text-xs text-text-muted mt-1">Photos will be auto-organized by category</p>
                </div>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="aspect-square bg-surface-secondary rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleComplete}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  variant="primary"
                  onClick={handleComplete}
                  className="flex-1"
                >
                  {photos.length > 0 ? 'Save & Start Report →' : 'Start Report →'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <div className="space-y-4 text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-text-primary">Ready to Inspect!</h3>
              <p className="text-text-muted">
                Your draw has been created. Would you like to start the report now?
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  if (newDrawId && onStartReport) {
                    onStartReport(newDrawId);
                  }
                  resetModal();
                }}
                fullWidth
              >
                Start Report →
              </Button>
            </div>
          )}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 p-4 border-t border-border">
          {['select', 'details', 'photos'].map((s, i) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                step === s ? 'bg-primary' : step === 'complete' ? 'bg-accent-success' : 'bg-surface-tertiary'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}