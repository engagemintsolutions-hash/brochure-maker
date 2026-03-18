'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, ImagePlus } from 'lucide-react';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE, MAX_PHOTOS } from '@/lib/constants';

interface PhotoUploaderProps {
  onUpload: (files: File[]) => void;
  currentCount: number;
  isUploading: boolean;
}

export function PhotoUploader({ onUpload, currentCount, isUploading }: PhotoUploaderProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const remaining = MAX_PHOTOS - currentCount;
      const toUpload = accepted.slice(0, remaining);
      if (toUpload.length > 0) {
        onUpload(toUpload);
      }
    },
    [onUpload, currentCount],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxSize: MAX_IMAGE_SIZE,
    disabled: isUploading || currentCount >= MAX_PHOTOS,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-[var(--accent)] bg-[var(--ivory)]' : 'border-gray-300 hover:border-gray-400'}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <ImagePlus className="w-12 h-12 text-[var(--accent)]" />
        ) : (
          <Upload className="w-12 h-12 text-gray-400" />
        )}
        <div>
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop photos here' : 'Drag and drop property photos'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse. JPEG, PNG, WebP up to 10MB each.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {currentCount}/{MAX_PHOTOS} photos uploaded
          </p>
        </div>
      </div>
    </div>
  );
}
