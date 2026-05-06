'use client';

import { useState, useCallback, useRef } from 'react';
import Button from '@/components/ui/Button';

export interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  category: PhotoCategory;
  tags: string[];
  caption: string;
  uploadedAt: string;
  drawId: string;
}

export type PhotoCategory = 
  | 'exterior' 
  | 'interior' 
  | 'kitchen' 
  | 'bathroom' 
  | 'mechanical' 
  | 'misc';

export const PHOTO_CATEGORIES: { value: PhotoCategory; label: string; icon: string }[] = [
  { value: 'exterior', label: 'Exterior', icon: '🏠' },
  { value: 'interior', label: 'Interior', icon: '🚪' },
  { value: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { value: 'bathroom', label: 'Bathroom', icon: '🚿' },
  { value: 'mechanical', label: 'Mechanical', icon: '⚙️' },
  { value: 'misc', label: 'Misc', icon: '📷' },
];

export const QUICK_TAGS: string[] = [
  'Before', 'After', 'In Progress', 'Issue', 'Complete', 
  'Foundation', 'Framing', 'Roofing', 'Flooring', 'Paint',
  'Plumbing', 'Electrical', 'HVAC', 'Inspection', 'Damage'
];

interface PhotoUploadProps {
  drawId: string;
  onPhotosUploaded?: (photos: Photo[]) => void;
  existingPhotos?: Photo[];
}

export default function PhotoUpload({ 
  drawId, 
  onPhotosUploaded,
  existingPhotos = []
}: PhotoUploadProps) {
  const [photos, setPhotos] = useState<Photo[]>(existingPhotos);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory>('misc');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newPhoto: Photo = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url,
          thumbnail: url,
          category: selectedCategory,
          tags: [],
          caption: '',
          uploadedAt: new Date().toISOString(),
          drawId,
        };
        setPhotos(prev => {
          const updated = [...prev, newPhoto];
          onPhotosUploaded?.(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  }, [selectedCategory, drawId, onPhotosUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const updatePhotoCategory = (photoId: string, category: PhotoCategory) => {
    setPhotos(prev => prev.map(p => 
      p.id === photoId ? { ...p, category } : p
    ));
  };

  const toggleTag = (photoId: string, tag: string) => {
    setPhotos(prev => prev.map(p => {
      if (p.id !== photoId) return p;
      const hasTag = p.tags.includes(tag);
      return {
        ...p,
        tags: hasTag 
          ? p.tags.filter(t => t !== tag)
          : [...p.tags, tag]
      };
    }));
  };

  const updateCaption = (photoId: string, caption: string) => {
    setPhotos(prev => prev.map(p => 
      p.id === photoId ? { ...p, caption } : p
    ));
    setEditingCaption(null);
  };

  const deletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const toggleSelectPhoto = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const bulkAssignCategory = (category: PhotoCategory) => {
    setPhotos(prev => prev.map(p => 
      selectedPhotos.includes(p.id) ? { ...p, category } : p
    ));
    setSelectedPhotos([]);
  };

  const getCategoryCounts = () => {
    const counts: Record<PhotoCategory, number> = {
      exterior: 0, interior: 0, kitchen: 0, bathroom: 0, mechanical: 0, misc: 0
    };
    photos.forEach(p => counts[p.category]++);
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 min-h-[200px] flex flex-col items-center justify-center
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-border hover:border-primary/50 hover:bg-surface-secondary'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="text-4xl mb-3">📷</div>
        <p className="text-text-primary font-medium mb-1">
          {isDragging ? 'Drop photos here' : 'Drag & drop photos or click to upload'}
        </p>
        <p className="text-text-muted text-sm">
          Photos will be categorized as: <span className="font-medium">{PHOTO_CATEGORIES.find(c => c.value === selectedCategory)?.label}</span>
        </p>
      </div>

      {/* Category Selection for Upload */}
      <div className="flex flex-wrap gap-2">
        {PHOTO_CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-all
              ${selectedCategory === cat.value
                ? 'bg-primary text-white'
                : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary'
              }
            `}
          >
            {cat.icon} {cat.label}
            {categoryCounts[cat.value] > 0 && (
              <span className="ml-1.5 text-xs opacity-75">({categoryCounts[cat.value]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="space-y-3">
          {/* Bulk Actions */}
          {selectedPhotos.length > 0 && (
            <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-4">
              <span className="text-sm font-medium text-primary">
                {selectedPhotos.length} selected
              </span>
              <div className="flex gap-2">
                {PHOTO_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => bulkAssignCategory(cat.value)}
                    className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                  >
                    {cat.icon} Move to {cat.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedPhotos([])}
                className="ml-auto text-sm text-text-muted hover:text-text-primary"
              >
                Clear selection
              </button>
            </div>
          )}

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {photos.map(photo => (
              <div
                key={photo.id}
                className={`
                  relative group rounded-lg overflow-hidden bg-surface-secondary
                  ${selectedPhotos.includes(photo.id) ? 'ring-2 ring-primary' : ''}
                `}
              >
                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Site photo'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Selection Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectPhoto(photo.id);
                    }}
                    className={`
                      absolute top-2 left-2 w-6 h-6 rounded border-2 
                      flex items-center justify-center transition-all
                      ${selectedPhotos.includes(photo.id)
                        ? 'bg-primary border-primary text-white'
                        : 'bg-card/90 border-border hover:border-primary'
                      }
                    `}
                  >
                    {selectedPhotos.includes(photo.id) && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Category Badge */}
                  <div className="absolute top-2 right-2">
                    <select
                      value={photo.category}
                      onChange={(e) => updatePhotoCategory(photo.id, e.target.value as PhotoCategory)}
                      className="text-xs bg-card/90 rounded px-1.5 py-0.5 border-0 cursor-pointer"
                    >
                      {PHOTO_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setEditingCaption(photo.id)}
                      className="p-2 bg-card rounded-full hover:bg-surface-elevated transition-colors"
                      title="Edit caption"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="p-2 bg-card rounded-full hover:bg-danger/20 transition-colors"
                      title="Delete photo"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Tags & Caption */}
                <div className="p-2">
                  {photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {photo.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {photo.tags.length > 3 && (
                        <span className="text-[10px] text-text-muted">+{photo.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                  {photo.caption && (
                    <p className="text-xs text-text-muted truncate">{photo.caption}</p>
                  )}
                </div>

                {/* Caption Edit Modal */}
                {editingCaption === photo.id && (
                  <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                      if (e.target === e.currentTarget) setEditingCaption(null);
                    }}
                  >
                    <div className="bg-card rounded-lg p-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
                      <img
                        src={photo.url}
                        alt="Edit"
                        className="w-full rounded mb-4"
                      />
                      
                      {/* Caption Input */}
                      <input
                        type="text"
                        placeholder="Add caption..."
                        defaultValue={photo.caption}
                        className="w-full px-3 py-2 border border-border rounded-lg mb-3"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateCaption(photo.id, e.currentTarget.value);
                          }
                        }}
                      />

                      {/* Quick Tags */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-text-primary mb-2">Quick Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {QUICK_TAGS.map(tag => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(photo.id, tag)}
                              className={`
                                text-xs px-2 py-1 rounded-full transition-colors
                                ${photo.tags.includes(tag)
                                  ? 'bg-primary text-white'
                                  : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary'
                                }
                              `}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          onClick={() => setEditingCaption(null)}
                          className="flex-1"
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {photos.length > 0 && (
        <div className="bg-surface-secondary rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-text-muted">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
          </span>
          <div className="flex gap-2 text-xs text-text-muted">
            {PHOTO_CATEGORIES.map(cat => (
              categoryCounts[cat.value] > 0 && (
                <span key={cat.value} className="flex items-center gap-1">
                  {cat.icon} {categoryCounts[cat.value]}
                </span>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}