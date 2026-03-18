'use client';

import { useState } from 'react';
import * as fabric from 'fabric';
import { Sparkles, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { fabricRef } from './canvas-page-ref';

export function PropertiesPanel() {
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const [rewriteInstruction, setRewriteInstruction] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);

  const canvas = fabricRef.current;
  const selectedObject = canvas
    ?.getObjects()
    .find((o) => (o as fabric.FabricObject & { name?: string }).name === selectedObjectId);

  const isText = selectedObject?.type === 'Textbox';
  const isImage = selectedObject?.type === 'Image';

  const handleRewrite = async () => {
    if (!selectedObject || !isText || !rewriteInstruction) return;

    const currentText = (selectedObject as fabric.Textbox).text || '';
    setIsRewriting(true);

    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentText, instruction: rewriteInstruction }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        (selectedObject as fabric.Textbox).set('text', data.text);
        canvas?.renderAll();
        setRewriteInstruction('');

        // Save the change
        const store = useEditorStore.getState();
        const json = canvas?.toJSON();
        if (json) {
          store.pushUndo();
          store.updatePageCanvas(store.activePageIndex, json);
        }
      }
    } catch (err) {
      console.error('Rewrite failed:', err);
    } finally {
      setIsRewriting(false);
    }
  };

  if (!selectedObjectId) {
    return (
      <div data-testid="properties-panel" className="w-64 bg-white border-l border-gray-200 p-4 flex-shrink-0">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Properties
        </h3>
        <p className="text-sm text-gray-400">Select an element on the canvas to edit its properties.</p>
        <div className="mt-6 text-xs text-gray-400 space-y-2">
          <p><strong>Double-click</strong> text to edit inline</p>
          <p><strong>Drag</strong> to move elements</p>
          <p><strong>Corners</strong> to resize</p>
          <p><strong>Ctrl+Z</strong> to undo</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="properties-panel" className="w-64 bg-white border-l border-gray-200 p-4 flex-shrink-0 overflow-y-auto">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Properties
      </h3>

      <div className="text-xs text-gray-500 mb-4">
        Selected: <span className="font-medium text-gray-700">{selectedObjectId}</span>
      </div>

      {/* Text properties */}
      {isText && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
            <select
              value={(selectedObject as fabric.Textbox).fontFamily || 'Inter'}
              onChange={(e) => {
                (selectedObject as fabric.Textbox).set('fontFamily', e.target.value);
                canvas?.renderAll();
              }}
              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
            >
              <option value="Inter">Inter</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Georgia">Georgia</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
              <input
                type="number"
                value={(selectedObject as fabric.Textbox).fontSize || 14}
                onChange={(e) => {
                  (selectedObject as fabric.Textbox).set('fontSize', parseInt(e.target.value) || 14);
                  canvas?.renderAll();
                }}
                className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                min="8"
                max="120"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Weight</label>
              <select
                value={String((selectedObject as fabric.Textbox).fontWeight || 'normal')}
                onChange={(e) => {
                  (selectedObject as fabric.Textbox).set('fontWeight', e.target.value);
                  canvas?.renderAll();
                }}
                className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="300">Light</option>
                <option value="600">Semibold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
            <input
              type="color"
              value={String((selectedObject as fabric.Textbox).fill || '#000000')}
              onChange={(e) => {
                (selectedObject as fabric.Textbox).set('fill', e.target.value);
                canvas?.renderAll();
              }}
              className="w-full h-8 border border-gray-200 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Alignment</label>
            <div className="flex gap-1">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => {
                    (selectedObject as fabric.Textbox).set('textAlign', align);
                    canvas?.renderAll();
                  }}
                  className={`flex-1 py-1 text-xs rounded border ${
                    (selectedObject as fabric.Textbox).textAlign === align
                      ? 'bg-gray-100 border-gray-400'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* AI Rewrite */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Rewrite with AI
            </label>
            <textarea
              value={rewriteInstruction}
              onChange={(e) => setRewriteInstruction(e.target.value)}
              placeholder="e.g. Make it shorter, More formal, Add mention of the garden..."
              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm resize-none h-16"
            />
            <button
              onClick={handleRewrite}
              disabled={!rewriteInstruction || isRewriting}
              className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRewriting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Rewriting...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  Rewrite
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Image properties */}
      {isImage && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Drag to reposition. Use corner handles to resize.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>X: {Math.round(selectedObject?.left || 0)}</div>
            <div>Y: {Math.round(selectedObject?.top || 0)}</div>
            <div>W: {Math.round((selectedObject?.width || 0) * (selectedObject?.scaleX || 1))}</div>
            <div>H: {Math.round((selectedObject?.height || 0) * (selectedObject?.scaleY || 1))}</div>
          </div>
        </div>
      )}
    </div>
  );
}
