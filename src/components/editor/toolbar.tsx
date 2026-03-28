'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Undo2, Redo2, ZoomIn, ZoomOut, Save, Download, Loader2, Check } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { ExportDialog } from './export-dialog';
import { ColorPicker } from './color-picker';
import { useToast } from '@/components/ui/toast';
import { saveBrochure } from '@/lib/supabase/brochures';

export function Toolbar() {
  const [showExport, setShowExport] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const { toast } = useToast();

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
  const pages = useEditorStore((s) => s.pages);
  const activePageIndex = useEditorStore((s) => s.activePageIndex);

  const zoomPercent = Math.round(zoom * 100);

  const handleSave = useCallback(async () => {
    const store = useEditorStore.getState();
    store.setSaving(true);
    const data = {
      id: store.brochureId,
      propertyDetails: store.propertyDetails!,
      photos: store.photos,
      generatedText: store.generatedText!,
      pages: store.pages,
      accentColor: store.accentColor,
    };

    const result = await saveBrochure(data);
    store.setSaving(false);

    if (result.ok) {
      store.markClean();
      const now = new Date();
      setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      toast('Brochure saved', 'success');
    } else {
      toast('Save failed. Changes kept locally.', 'error');
    }
  }, [toast]);

  // Warn before closing with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (useEditorStore.getState().isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

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
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* Zoom */}
          <button
            onClick={() => setZoom(zoom - 0.1)}
            disabled={zoom <= 0.3}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 w-12 text-center" aria-live="polite">{zoomPercent}%</span>
          <button
            onClick={() => setZoom(zoom + 0.1)}
            disabled={zoom >= 2}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Center: page indicator */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Page {activePageIndex + 1} of {pages.length}
          </span>
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))}
            className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-1.5 py-0.5"
            title="Keyboard shortcuts"
          >
            ?
          </button>
        </div>

        {/* Right: accent color, save, export */}
        <div className="flex items-center gap-2">
          <ColorPicker color={accentColor} onChange={setAccentColor} label="Accent" />

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            title="Save (Ctrl+S)"
            aria-label={isDirty ? 'Save brochure' : 'Brochure saved'}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isDirty ? (
              <Save className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4 text-green-600" />
            )}
            <span>{isDirty ? 'Save' : 'Saved'}</span>
            {lastSaved && !isDirty && (
              <span className="text-xs text-gray-400 ml-1">{lastSaved}</span>
            )}
          </button>

          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-dark)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            aria-label="Export as PDF"
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
