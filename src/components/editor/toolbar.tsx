'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Undo2, Redo2, ZoomIn, ZoomOut, Save, Download, Loader2, Grid3X3 } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { ExportDialog } from './export-dialog';
import { ColorPicker } from './color-picker';

export function Toolbar() {
  const [showExport, setShowExport] = useState(false);

  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const undoStack = useEditorStore((s) => s.undoStack);
  const redoStack = useEditorStore((s) => s.redoStack);
  const isDirty = useEditorStore((s) => s.isDirty);
  const isSaving = useEditorStore((s) => s.isSaving);
  const accentColor = useEditorStore((s) => s.accentColor);
  const setAccentColor = useEditorStore((s) => s.setAccentColor);
  const showGrid = useEditorStore((s) => s.showGrid);
  const setShowGrid = useEditorStore((s) => s.setShowGrid);
  const pages = useEditorStore((s) => s.pages);
  const activePageIndex = useEditorStore((s) => s.activePageIndex);

  const zoomPercent = Math.round(zoom * 100);

  return (
    <>
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        {/* Left: undo/redo */}
        <div className="flex items-center gap-1">
          <Image src="/doorstep-logo.png" alt="Doorstep" width={100} height={28} className="h-6 w-auto mr-3" />
          <div className="w-px h-6 bg-gray-200 mr-2" />
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* Zoom */}
          <button
            onClick={() => setZoom(zoom - 0.1)}
            disabled={zoom <= 0.3}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 w-12 text-center">{zoomPercent}%</span>
          <button
            onClick={() => setZoom(zoom + 0.1)}
            disabled={zoom >= 2}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded transition-colors ${showGrid ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-500'}`}
            title="Toggle grid"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>

        {/* Center: page indicator */}
        <div className="text-sm text-gray-500">
          Page {activePageIndex + 1} of {pages.length}
        </div>

        {/* Right: accent color, save, export */}
        <div className="flex items-center gap-2">
          <ColorPicker color={accentColor} onChange={setAccentColor} label="Accent" />

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <button
            onClick={() => {
              // Save will be wired up with Supabase later
              // For now, saves to sessionStorage
              const store = useEditorStore.getState();
              const data = {
                id: store.brochureId,
                propertyDetails: store.propertyDetails,
                photos: store.photos,
                generatedText: store.generatedText,
                pages: store.pages,
                accentColor: store.accentColor,
              };
              sessionStorage.setItem(`brochure-${store.brochureId}`, JSON.stringify(data));
              store.markClean();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded hover:bg-gray-100"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isDirty ? 'Save' : 'Saved'}</span>
          </button>

          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-dark)] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
    </>
  );
}
