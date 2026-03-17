'use client';

import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { PhotoAnalysis } from '@/types/brochure';
import { ROOM_TYPE_LABELS } from '@/lib/constants';

interface UploadedPhoto {
  id: string;
  blobUrl: string;
  filename: string;
  analysis?: PhotoAnalysis;
  analyzing?: boolean;
  error?: string;
}

interface PhotoGridProps {
  photos: UploadedPhoto[];
  onRemove: (id: string) => void;
}

export function PhotoGrid({ photos, onRemove }: PhotoGridProps) {
  if (photos.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-gray-100">
          <div className="aspect-[4/3]">
            <img
              src={photo.blobUrl}
              alt={photo.filename}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove(photo.id)}
            className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Status overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1.5">
            {photo.analyzing ? (
              <div className="flex items-center gap-1.5 text-white text-xs">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Analysing...</span>
              </div>
            ) : photo.analysis ? (
              <div className="flex items-center gap-1.5 text-white text-xs">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span>{ROOM_TYPE_LABELS[photo.analysis.roomType] || photo.analysis.roomType}</span>
              </div>
            ) : photo.error ? (
              <div className="text-red-300 text-xs truncate">{photo.error}</div>
            ) : (
              <div className="text-gray-300 text-xs truncate">{photo.filename}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export type { UploadedPhoto };
