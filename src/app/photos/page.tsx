'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PhotoUpload, { Photo } from '@/components/photos/PhotoUpload';
import PhotoGallery from '@/components/photos/PhotoGallery';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getProjectById, getDrawsByProject, getProjects } from '@/lib/data';

function PhotosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const drawId = searchParams.get('drawId');

  const projects = getProjects();
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '');
  const [selectedDrawId, setSelectedDrawId] = useState(drawId || '');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');

  const selectedProject = selectedProjectId ? getProjectById(selectedProjectId) : null;
  const draws = selectedProjectId ? getDrawsByProject(selectedProjectId) : [];

  const handlePhotosUploaded = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Photo Management</h1>
          <p className="text-text-muted">Upload, organize, and tag site photos</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'upload' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('upload')}
          >
            📷 Upload
          </Button>
          <Button
            variant={activeTab === 'gallery' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('gallery')}
          >
            🖼️ Gallery
          </Button>
        </div>
      </div>

      {/* Project/Draw Selection */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedDrawId('');
              }}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Select a project...</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name} - {project.address}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Draw
            </label>
            <select
              value={selectedDrawId}
              onChange={(e) => setSelectedDrawId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              disabled={!selectedProjectId}
            >
              <option value="">Select a draw...</option>
              {draws.map(draw => (
                <option key={draw.id} value={draw.id}>
                  Draw #{draw.drawNumber} - {draw.status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedProject && (
          <div className="mt-3 p-3 bg-surface-secondary rounded-lg">
            <p className="text-sm text-text-muted">
              <span className="font-medium text-text-primary">{selectedProject.name}</span>
              {' • '}Lender: {selectedProject.lender.name}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      {!selectedProjectId || !selectedDrawId ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">📷</div>
          <p className="text-text-muted mb-4">Select a project and draw to manage photos</p>
        </Card>
      ) : activeTab === 'upload' ? (
        <Card>
          <PhotoUpload
            drawId={selectedDrawId}
            onPhotosUploaded={handlePhotosUploaded}
          />
        </Card>
      ) : (
        <Card>
          <PhotoGallery
            photos={photos}
            showFilters={true}
          />
        </Card>
      )}

      {/* Quick Stats */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'Total Photos', value: photos.length, icon: '📷' },
            { label: 'Exterior', value: photos.filter(p => p.category === 'exterior').length, icon: '🏠' },
            { label: 'Interior', value: photos.filter(p => p.category === 'interior').length, icon: '🚪' },
            { label: 'Kitchen', value: photos.filter(p => p.category === 'kitchen').length, icon: '🍳' },
            { label: 'Bathroom', value: photos.filter(p => p.category === 'bathroom').length, icon: '🚿' },
            { label: 'Mechanical', value: photos.filter(p => p.category === 'mechanical').length, icon: '⚙️' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-lg border border-border p-3 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PhotosPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-text-muted mt-2">Loading...</p>
        </div>
      </div>
    }>
      <PhotosContent />
    </Suspense>
  );
}