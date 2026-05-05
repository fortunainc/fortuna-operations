'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { generatePhotoCaption, generateBulkCaptions, callAIService, type PhotoCaptionOutput } from '@/lib/aiServices';

interface PhotoCaptionGeneratorProps {
  photos: Array<{ id: string; category: string; caption?: string; url: string }>;
  onUpdateCaption: (photoId: string, caption: string) => void;
}

export default function PhotoCaptionGenerator({ photos, onUpdateCaption }: PhotoCaptionGeneratorProps) {
  const [generating, setGenerating] = useState(false);

  const handleGenerateAll = async () => {
    setGenerating(true);
    try {
      const inputs = photos.map(p => ({ category: p.category }));
      const results = await callAIService<PhotoCaptionOutput[]>(inputs, 'caption');
      
      results.forEach((result, index) => {
        onUpdateCaption(photos[index].id, result.caption);
      });
    } catch (error) {
      console.error('Failed to generate captions:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleGenerateAll}
        disabled={generating || photos.length === 0}
      >
        {generating ? '⏳ Generating...' : '🖼️ Generate AI Captions'}
      </Button>
    </div>
  );
}