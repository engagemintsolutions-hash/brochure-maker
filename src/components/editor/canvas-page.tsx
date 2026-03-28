'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '@/stores/editor-store';
import { CANVAS } from '@/lib/constants';
import { getCanvasJson, loadCanvasFromJson } from '@/lib/editor/fabric-helpers';
import { fabricRef } from './canvas-page-ref';

export function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Using shared fabricRef from canvas-page-ref.ts
  const isLoadingRef = useRef(false);

  const activePageIndex = useEditorStore((s) => s.activePageIndex);
  const pages = useEditorStore((s) => s.pages);
  const zoom = useEditorStore((s) => s.zoom);
  const updatePageCanvas = useEditorStore((s) => s.updatePageCanvas);
  const pushUndo = useEditorStore((s) => s.pushUndo);
  const setSelectedObject = useEditorStore((s) => s.setSelectedObject);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS.width,
      height: CANVAS.height,
      backgroundColor: '#FFFFFF',
      preserveObjectStacking: true,
      selection: true,
    });

    fabricRef.current = canvas;

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Load page JSON when active page changes
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !pages[activePageIndex]) return;

    isLoadingRef.current = true;
    const pageJson = pages[activePageIndex].canvasJson;

    loadCanvasFromJson(canvas, pageJson)
      .then(() => {
        // Load images that need fetching
        const objects = canvas.getObjects();
        const imagePromises: Promise<void>[] = [];

        for (const obj of objects) {
          const fabricObj = obj as fabric.FabricObject & { _imageUrl?: string; name?: string };
          if (fabricObj.type === 'Image' && fabricObj._imageUrl) {
            const imageUrl = fabricObj._imageUrl;
            const targetLeft = fabricObj.left || 0;
            const targetTop = fabricObj.top || 0;
            const targetWidth = fabricObj.width || 200;
            const targetHeight = fabricObj.height || 200;
            const targetName = fabricObj.name || '';
            const isEditable = fabricObj.selectable !== false;

            const promise = fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
              .then((img) => {
                const imgWidth = img.width || 1;
                const imgHeight = img.height || 1;
                const scaleX = targetWidth / imgWidth;
                const scaleY = targetHeight / imgHeight;
                const scale = Math.max(scaleX, scaleY);

                img.set({
                  left: targetLeft,
                  top: targetTop,
                  scaleX: scale,
                  scaleY: scale,
                  name: targetName,
                  selectable: isEditable,
                  hasControls: isEditable,
                });

                canvas.remove(fabricObj);
                canvas.add(img);
              })
              .catch(() => {
                // Keep placeholder if image fails to load
              });

            imagePromises.push(promise);
          }
        }

        Promise.all(imagePromises).then(() => {
          canvas.renderAll();
          isLoadingRef.current = false;
        });
      })
      .catch(() => {
        isLoadingRef.current = false;
      });
  }, [activePageIndex, pages]);

  // Update zoom
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.setZoom(zoom);
    canvas.setDimensions({
      width: CANVAS.width * zoom,
      height: CANVAS.height * zoom,
    });
  }, [zoom]);

  // Event handlers
  const saveCurrentPage = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || isLoadingRef.current) return;
    const json = getCanvasJson(canvas);
    updatePageCanvas(activePageIndex, json);
  }, [activePageIndex, updatePageCanvas]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const handleModified = () => {
      pushUndo();
      saveCurrentPage();
    };

    const handleSelection = (e: { selected: fabric.FabricObject[] }) => {
      if (e.selected && e.selected.length > 0) {
        const name = (e.selected[0] as fabric.FabricObject & { name?: string }).name;
        setSelectedObject(name || null);
      }
    };

    const handleDeselect = () => {
      setSelectedObject(null);
    };

    canvas.on('object:modified', handleModified);
    canvas.on('selection:created', handleSelection as never);
    canvas.on('selection:updated', handleSelection as never);
    canvas.on('selection:cleared', handleDeselect);

    // Text editing events
    canvas.on('text:changed', saveCurrentPage);

    return () => {
      canvas.off('object:modified', handleModified);
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleDeselect);
      canvas.off('text:changed', saveCurrentPage);
    };
  }, [pushUndo, saveCurrentPage, setSelectedObject]);

  // Clipboard for copy/paste
  const clipboardRef = useRef<object | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      // Don't capture when typing in inputs or editing text on canvas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const active = canvas.getActiveObject();
      const isEditing = active && (active as fabric.Textbox).isEditing;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          useEditorStore.getState().redo();
        } else {
          useEditorStore.getState().undo();
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (active && !isEditing) {
          const fabricObj = active as fabric.FabricObject & { name?: string };
          const name = fabricObj.name || '';
          if (!name.includes('footer_bar') && !name.includes('top_bar') && !name.includes('_bg') && !name.includes('overlay')) {
            canvas.remove(active);
            pushUndo();
            saveCurrentPage();
          }
        }
      }

      if (e.key === 'Escape') {
        canvas.discardActiveObject();
        canvas.renderAll();
        useEditorStore.getState().setSelectedObject(null);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCurrentPage();
      }

      // Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && active && !isEditing) {
        e.preventDefault();
        active.clone().then((cloned: fabric.FabricObject) => {
          clipboardRef.current = cloned;
        });
      }

      // Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboardRef.current && !isEditing) {
        e.preventDefault();
        const clonedObj = clipboardRef.current as fabric.FabricObject;
        clonedObj.clone().then((pasted: fabric.FabricObject) => {
          pasted.set({
            left: (pasted.left || 0) + 20,
            top: (pasted.top || 0) + 20,
          });
          canvas.add(pasted);
          canvas.setActiveObject(pasted);
          canvas.renderAll();
          pushUndo();
          saveCurrentPage();
        });
      }

      // Arrow key nudging
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && active && !isEditing) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        switch (e.key) {
          case 'ArrowUp': active.set('top', (active.top || 0) - step); break;
          case 'ArrowDown': active.set('top', (active.top || 0) + step); break;
          case 'ArrowLeft': active.set('left', (active.left || 0) - step); break;
          case 'ArrowRight': active.set('left', (active.left || 0) + step); break;
        }
        active.setCoords();
        canvas.renderAll();
        saveCurrentPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pushUndo, saveCurrentPage]);

  return (
    <div className="flex items-center justify-center p-8 bg-gray-200 min-h-full overflow-auto">
      <div
        className="shadow-2xl"
        style={{
          width: CANVAS.width * zoom,
          height: CANVAS.height * zoom,
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

// Re-export for sibling components
export { fabricRef } from './canvas-page-ref';
