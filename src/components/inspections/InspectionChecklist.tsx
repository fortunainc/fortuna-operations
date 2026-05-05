'use client';

import React, { useState } from 'react';

interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  completed: boolean;
  notes?: string;
}

interface InspectionChecklistProps {
  onComplete?: (completed: boolean) => void;
  initialData?: ChecklistItem[];
}

export default function InspectionChecklist({ onComplete, initialData }: InspectionChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    initialData || [
      // Exterior
      { id: 'exterior-1', category: 'Exterior', label: 'Exterior front facade photos', completed: false },
      { id: 'exterior-2', category: 'Exterior', label: 'Exterior rear and side views', completed: false },
      { id: 'exterior-3', category: 'Exterior', label: 'Roofing and foundation photos', completed: false },
      { id: 'exterior-4', category: 'Exterior', label: 'Site conditions and grading', completed: false },
      
      // Interior
      { id: 'interior-1', category: 'Interior', label: 'Living areas photos', completed: false },
      { id: 'interior-2', category: 'Interior', label: 'Bedroom photos', completed: false },
      { id: 'interior-3', category: 'Interior', label: 'Common areas photos', completed: false },
      { id: 'interior-4', category: 'Interior', label: 'Windows and doors inspection', completed: false },
      
      // Kitchen
      { id: 'kitchen-1', category: 'Kitchen', label: 'Kitchen cabinets and fixtures', completed: false },
      { id: 'kitchen-2', category: 'Kitchen', label: 'Countertops and backsplash installed', completed: false },
      { id: 'kitchen-3', category: 'Kitchen', label: 'Appliances installed and functional', completed: false },
      { id: 'kitchen-4', category: 'Kitchen', label: 'Plumbing and electrical rough-in', completed: false },
      
      // Bathroom
      { id: 'bathroom-1', category: 'Bathroom', label: 'Bathroom fixtures and finishes', completed: false },
      { id: 'bathroom-2', category: 'Bathroom', label: 'Tile work completed', completed: false },
      { id: 'bathroom-3', category: 'Bathroom', label: 'Plumbing fixtures tested', completed: false },
      { id: 'bathroom-4', category: 'Bathroom', label: 'Ventilation and waterproofing', completed: false },
      
      // Mechanical
      { id: 'mechanical-1', category: 'Mechanical', label: 'HVAC system verification', completed: false },
      { id: 'mechanical-2', category: 'Mechanical', label: 'Electrical panel and circuits', completed: false },
      { id: 'mechanical-3', category: 'Mechanical', label: 'Plumbing systems and connections', completed: false },
      { id: 'mechanical-4', category: 'Mechanical', label: 'Water heater and utilities', completed: false },
      
      // Progress Validation
      { id: 'progress-1', category: 'Progress Validation', label: 'Draw percentage verified on site', completed: false },
      { id: 'progress-2', category: 'Progress Validation', label: 'Work matches draw schedule', completed: false },
      { id: 'progress-3', category: 'Progress Validation', label: 'No incomplete or missing work', completed: false },
      { id: 'progress-4', category: 'Progress Validation', label: 'Quality standards met', completed: false },
      
      // Documentation Verification
      { id: 'docs-1', category: 'Documentation', label: 'Current draw requirements reviewed', completed: false },
      { id: 'docs-2', category: 'Documentation', label: 'Building permits verified', completed: false },
      { id: 'docs-3', category: 'Documentation', label: 'Inspection certificates collected', completed: false },
      { id: 'docs-4', category: 'Documentation', label: 'Progress photos uploaded', completed: false },
    ]
  );

  const toggleItem = (id: string) => {
    setChecklist(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      
      // Notify parent of completion status
      if (onComplete) {
        const allCompleted = updated.every(item => item.completed);
        onComplete(allCompleted);
      }
      
      return updated;
    });
  };

  const updateNotes = (id: string, notes: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  const categories = Array.from(new Set(checklist.map(item => item.category)));
  const allCompleted = checklist.every(item => item.completed);
  const completionPercentage = Math.round((checklist.filter(item => item.completed).length / checklist.length) * 100);

  return (
    <div className="inspection-checklist">
      <div className="checklist-header">
        <h3>Inspection Checklist</h3>
        <div className="completion-status">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="percentage">{completionPercentage}% Complete</span>
          {allCompleted && (
            <span className="complete-badge">✓ All Items Complete</span>
          )}
        </div>
      </div>

      <div className="checklist-instructions">
        <p><strong>Requirement:</strong> All checklist items must be completed before report generation can proceed.</p>
        <p>This ensures comprehensive verification and consistent quality across all inspections.</p>
      </div>

      <div className="checklist-content">
        {categories.map(category => (
          <div key={category} className="checklist-category">
            <h4>{category}</h4>
            <div className="checklist-items">
              {checklist
                .filter(item => item.category === category)
                .map(item => (
                  <div key={item.id} className={`checklist-item ${item.completed ? 'completed' : ''}`}>
                    <div className="item-main">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={item.completed}
                        onChange={() => toggleItem(item.id)}
                        className="checkbox"
                      />
                      <label htmlFor={item.id} className="item-label">
                        {item.label}
                      </label>
                    </div>
                    <textarea
                      placeholder="Add notes (optional)..."
                      value={item.notes || ''}
                      onChange={(e) => updateNotes(item.id, e.target.value)}
                      className="item-notes"
                      rows={1}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {!allCompleted && (
        <div className="checklist-warning">
          ⚠️ Report generation is blocked until all checklist items are completed.
        </div>
      )}
    </div>
  );
}