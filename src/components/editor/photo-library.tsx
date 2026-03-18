'use client';

import { useState, useCallback, useRef } from 'react';
import { Images, Upload, GripVertical, Plus } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { fabricRef } from './canvas-page-ref';
import * as fabric from 'fabric';
import { ROOM_TYPE_LABELS } from '@/lib/constants';

export function PhotoLibrary() {
  const photos = useEditorStore((s) => s.photos);
  const pushUndo = useEditorStore((s) => s.pushUndo);
  const updatePageCanvas = useEditorStore((s) => s.updatePageCanvas);
  const activePageIndex = useEditorStore((s) => s.activePageIndex);
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null);
  const [isAddingLocal, setIsAddingLocal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragStart = (e: React.DragEvent, photoUrl: string) => {
    setDraggedPhoto(photoUrl);
    e.dataTransfer.setData('text/plain', photoUrl);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedPhoto(null);
  };

  const handleAddToCanvas = useCallback(async (imageUrl: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    try {
      const img = await fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });

      // Scale to fit nicely on canvas (max 600px wide)
      const maxWidth = 600;
      const scale = Math.min(maxWidth / (img.width || 1), 1);

      img.set({
        left: 100 + Math.random() * 200,
        top: 100 + Math.random() * 200,
        scaleX: scale,
        scaleY: scale,
        selectable: true,
        hasControls: true,
        name: `photo_added_${Date.now()}`,
      });

      pushUndo();
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();

      // Save state
      const json = canvas.toJSON();
      updatePageCanvas(activePageIndex, json);
    } catch (err) {
      console.error('Failed to add image:', err);
    }
  }, [pushUndo, updatePageCanvas, activePageIndex]);

  const handleLocalFileAdd = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsAddingLocal(true);

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          await handleAddToCanvas(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }

    setIsAddingLocal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [handleAddToCanvas]);

  return (
    <div className="border-t border-gray-200 mt-4 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <Images className="w-3.5 h-3.5" />
          Photos
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1 rounded hover:bg-gray-100 text-gray-500"
          title="Add photo from device"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleLocalFileAdd}
      />

      <p className="text-[10px] text-gray-400 mb-2">
        Drag onto canvas or click to add
      </p>

      {/* Photo thumbnails */}
      <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto">
        {photos.map((photo) => (
          <div
            key={photo.id}
            draggable
            onDragStart={(e) => handleDragStart(e, photo.blobUrl)}
            onDragEnd={handleDragEnd}
            onClick={() => handleAddToCanvas(photo.blobUrl)}
            className={`
              relative group rounded overflow-hidden cursor-grab active:cursor-grabbing border border-gray-200
              hover:border-[var(--accent)] transition-colors
              ${draggedPhoto === photo.blobUrl ? 'opacity-50 ring-2 ring-[var(--accent)]' : ''}
            `}
          >
            <div className="aspect-[4/3]">
              <img
                src={photo.blobUrl}
                alt={photo.caption}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-white drop-shadow-md" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
              <span className="text-[9px] text-white truncate block">
                {ROOM_TYPE_LABELS[photo.roomType] || photo.roomType}
              </span>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--accent)] transition-colors"
        >
          <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
          <span className="text-xs text-gray-500">Add photos</span>
        </button>
      )}
    </div>
  );
}
