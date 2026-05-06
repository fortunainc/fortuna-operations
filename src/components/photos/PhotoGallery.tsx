'use client';

import { useState, useMemo } from 'react';
import { Photo, PhotoCategory, PHOTO_CATEGORIES } from './PhotoUpload';

interface PhotoGalleryProps {
  photos: Photo[];
  onPhotoSelect?: (photo: Photo) => void;
  selectable?: boolean;
  selectedIds?: string[];
  showFilters?: boolean;
  compact?: boolean;
}

export default function PhotoGallery({
  photos,
  onPhotoSelect,
  selectable = false,
  selectedIds = [],
  showFilters = true,
  compact = false
}: PhotoGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<PhotoCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);

  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      const matchesCategory = activeCategory === 'all' || photo.category === activeCategory;
      const matchesSearch = !searchQuery || 
        photo.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [photos, activeCategory, searchQuery]);

  const getCategoryCount = (category: PhotoCategory | 'all') => {
    if (category === 'all') return photos.length;
    return photos.filter(p => p.category === category).length;
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <div className="text-4xl mb-3">📷</div>
        <p>No photos uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${activeCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary'
                }
              `}
            >
              All ({getCategoryCount('all')})
            </button>
            {PHOTO_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${activeCategory === cat.value
                    ? 'bg-primary text-white'
                    : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary'
                  }
                `}
              >
                {cat.icon} {cat.label} ({getCategoryCount(cat.value)})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative sm:ml-auto">
            <input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 px-3 py-1.5 pl-8 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <svg 
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      <div className={`grid gap-3 ${
        compact 
          ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6' 
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
      }`}>
        {filteredPhotos.map(photo => (
          <div
            key={photo.id}
            onClick={() => {
              if (selectable && onPhotoSelect) {
                onPhotoSelect(photo);
              } else {
                setViewingPhoto(photo);
              }
            }}
            className={`
              relative group rounded-lg overflow-hidden bg-surface-secondary cursor-pointer
              ${selectedIds.includes(photo.id) ? 'ring-2 ring-primary' : ''}
              ${compact ? 'aspect-square' : 'aspect-[4/3]'}
            `}
          >
            <img
              src={photo.url}
              alt={photo.caption || 'Site photo'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-2">
                {photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {photo.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="text-[9px] bg-card/20 text-text-primary px-1 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {photo.caption && (
                  <p className="text-xs text-white truncate">{photo.caption}</p>
                )}
              </div>
            </div>

            {/* Category Indicator */}
            <div className="absolute top-1 right-1 text-lg opacity-80">
              {PHOTO_CATEGORIES.find(c => c.value === photo.category)?.icon}
            </div>

            {/* Selected Indicator */}
            {selectedIds.includes(photo.id) && (
              <div className="absolute top-1 left-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredPhotos.length === 0 && photos.length > 0 && (
        <div className="text-center py-8 text-text-muted">
          <p>No photos match your filters</p>
        </div>
      )}

      {/* Photo Lightbox */}
      {viewingPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setViewingPhoto(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img
              src={viewingPhoto.url}
              alt={viewingPhoto.caption || 'Site photo'}
              className="max-w-full max-h-[75vh] mx-auto object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Photo Info */}
            <div className="mt-4 text-white text-center" onClick={(e) => e.stopPropagation()}>
              {viewingPhoto.caption && (
                <p className="text-lg mb-2">{viewingPhoto.caption}</p>
              )}
              <div className="flex items-center justify-center gap-3 text-sm text-white/70">
                <span>
                  {PHOTO_CATEGORIES.find(c => c.value === viewingPhoto.category)?.icon}{' '}
                  {PHOTO_CATEGORIES.find(c => c.value === viewingPhoto.category)?.label}
                </span>
                {viewingPhoto.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{viewingPhoto.tags.join(', ')}</span>
                  </>
                )}
                <span>•</span>
                <span>{new Date(viewingPhoto.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Bar */}
      <div className="text-sm text-text-muted">
        Showing {filteredPhotos.length} of {photos.length} photos
      </div>
    </div>
  );
}