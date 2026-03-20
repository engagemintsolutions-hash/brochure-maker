'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '@/stores/editor-store';
import { CANVAS } from '@/lib/constants';
import { getCanvasJson, loadCanvasFromJson, getThumbnailDataUrl } from '@/lib/editor/fabric-helpers';
import { showAlignmentGuides, clearAlignmentGuides } from '@/lib/editor/alignment-guides';
import { fabricRef } from './canvas-page-ref';

// Protected element prefixes - can't be deleted
const PROTECTED = ['footer_bar', 'footer_line', 'top_bar', 'top_line', '_bg', 'overlay', 'sidebar', 'frame', 'accent_strip', 'grid_', 'split_divider', 'cover_panel', 'cover_overlay'];

// Module-level clipboard for copy/paste
let clipboard: fabric.FabricObject | null = null;

export function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLoadingRef = useRef(false);
  const thumbnailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePageIndex = useEditorStore((s) => s.activePageIndex);
  const pages = useEditorStore((s) => s.pages);
  const zoom = useEditorStore((s) => s.zoom);
  const showGrid = useEditorStore((s) => s.showGrid);
  const updatePageCanvas = useEditorStore((s) => s.updatePageCanvas);
  const pushUndo = useEditorStore((s) => s.pushUndo);
  const setSelectedObject = useEditorStore((s) => s.setSelectedObject);

  // ── Initialize Fabric canvas ──
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

    // Auto-zoom to fit viewport
    const editorArea = canvasRef.current?.parentElement?.parentElement;
    if (editorArea) {
      const aw = editorArea.clientWidth - 80;
      const ah = editorArea.clientHeight - 80;
      const fitZoom = Math.min(aw / CANVAS.width, ah / CANVAS.height, 1);
      const rounded = Math.round(fitZoom * 20) / 20;
      if (rounded < 1 && rounded > 0.2) {
        useEditorStore.getState().setZoom(rounded);
      }
    }

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // ── Load page JSON ──
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !pages[activePageIndex]) return;

    isLoadingRef.current = true;
    const pageJson = pages[activePageIndex].canvasJson;

    loadCanvasFromJson(canvas, pageJson)
      .then(() => {
        const objects = canvas.getObjects();
        const imagePromises: Promise<void>[] = [];

        for (const obj of objects) {
          const fabricObj = obj as fabric.FabricObject & { _imageUrl?: string; _targetWidth?: number; _targetHeight?: number; _borderRadius?: number; name?: string };
          if (fabricObj.type === 'Image' && fabricObj._imageUrl) {
            const imageUrl = fabricObj._imageUrl;
            const targetLeft = fabricObj.left || 0;
            const targetTop = fabricObj.top || 0;
            const tw = fabricObj._targetWidth || fabricObj.width || 200;
            const th = fabricObj._targetHeight || fabricObj.height || 200;
            const targetName = fabricObj.name || '';
            const isEditable = fabricObj.selectable !== false;

            const promise = fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
              .then((img) => {
                const iw = img.width || 1;
                const ih = img.height || 1;
                // Cover-fill: scale to fill frame, crop excess
                const scale = Math.max(tw / iw, th / ih) * 1.002; // tiny buffer for sub-pixel gaps
                const offsetX = (iw * scale - tw) / 2;
                const offsetY = (ih * scale - th) / 2;

                img.set({
                  left: targetLeft - offsetX,
                  top: targetTop - offsetY,
                  scaleX: scale,
                  scaleY: scale,
                  name: targetName,
                  selectable: isEditable,
                  hasControls: isEditable,
                  _imageUrl: imageUrl,
                  _targetWidth: tw,
                  _targetHeight: th,
                } as Record<string, unknown>);

                const br = (fabricObj as any)._borderRadius || 0;
                img.clipPath = new fabric.Rect({
                  left: targetLeft,
                  top: targetTop,
                  width: tw,
                  height: th,
                  rx: br,
                  ry: br,
                  absolutePositioned: true,
                });

                canvas.remove(fabricObj);
                canvas.add(img);
              })
              .catch(() => {});

            imagePromises.push(promise);
          }
        }

        Promise.all(imagePromises).then(() => {
          canvas.requestRenderAll();
          isLoadingRef.current = false;
          // Generate thumbnail after load
          debouncedThumbnail();
        });
      })
      .catch(() => { isLoadingRef.current = false; });
  }, [activePageIndex, pages]);

  // ── Zoom ──
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.setZoom(zoom);
    canvas.setDimensions({ width: CANVAS.width * zoom, height: CANVAS.height * zoom });
  }, [zoom]);

  // ── Grid overlay ──
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const drawGrid = () => {
      if (!useEditorStore.getState().showGrid) return;
      const ctx = canvas.getTopContext();
      const step = 50 * zoom;
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= CANVAS.width * zoom; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS.height * zoom); ctx.stroke();
      }
      for (let y = 0; y <= CANVAS.height * zoom; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS.width * zoom, y); ctx.stroke();
      }
    };

    canvas.on('after:render', drawGrid);
    canvas.requestRenderAll();
    return () => { canvas.off('after:render', drawGrid); };
  }, [showGrid, zoom]);

  // ── Save + thumbnail helpers ──
  const saveCurrentPage = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || isLoadingRef.current) return;
    // Exclude guide lines from save
    const guides = canvas.getObjects().filter((o) => (o as unknown as Record<string, unknown>)._isGuide);
    guides.forEach((g) => canvas.remove(g));

    const json = getCanvasJson(canvas);
    updatePageCanvas(activePageIndex, json);
    useEditorStore.getState().bumpCanvasVersion();
    debouncedThumbnail();
  }, [activePageIndex, updatePageCanvas]);

  const debouncedThumbnail = useCallback(() => {
    if (thumbnailTimer.current) clearTimeout(thumbnailTimer.current);
    thumbnailTimer.current = setTimeout(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const dataUrl = getThumbnailDataUrl(canvas, 180);
      useEditorStore.getState().setThumbnail(
        useEditorStore.getState().activePageIndex,
        dataUrl,
      );
    }, 500);
  }, []);

  // ── Event handlers ──
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const handleModified = () => {
      clearAlignmentGuides(canvas);
      pushUndo();
      saveCurrentPage();
    };

    const handleMoving = (e: { target?: fabric.FabricObject }) => {
      if (e.target) showAlignmentGuides(canvas, e.target);
    };

    // Snap rotation to 45-degree increments
    const handleRotating = (e: { target?: fabric.FabricObject }) => {
      if (!e.target) return;
      const angle = e.target.angle || 0;
      const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
      for (const snap of snapAngles) {
        if (Math.abs(angle - snap) < 5) {
          e.target.set('angle', snap === 360 ? 0 : snap);
          break;
        }
      }
    };

    const handleSelection = (e: { selected: fabric.FabricObject[] }) => {
      if (e.selected && e.selected.length > 0) {
        const name = (e.selected[0] as fabric.FabricObject & { name?: string }).name;
        setSelectedObject(name || null);
      }
    };

    const handleDeselect = () => setSelectedObject(null);

    // Hover feedback
    const handleMouseOver = (e: { target?: fabric.FabricObject | null }) => {
      if (e.target && e.target.selectable) {
        e.target.set('shadow', new fabric.Shadow({ color: 'rgba(59,130,246,0.4)', blur: 6, offsetX: 0, offsetY: 0 }));
        canvas.requestRenderAll();
      }
    };
    const handleMouseOut = (e: { target?: fabric.FabricObject | null }) => {
      if (e.target) {
        e.target.set('shadow', null);
        canvas.requestRenderAll();
      }
    };

    canvas.on('object:modified', handleModified);
    canvas.on('object:moving', handleMoving as never);
    canvas.on('object:rotating', handleRotating as never);
    canvas.on('selection:created', handleSelection as never);
    canvas.on('selection:updated', handleSelection as never);
    canvas.on('selection:cleared', handleDeselect);
    canvas.on('text:changed', saveCurrentPage);
    canvas.on('mouse:over', handleMouseOver as never);
    canvas.on('mouse:out', handleMouseOut as never);

    return () => {
      canvas.off('object:modified', handleModified);
      canvas.off('object:moving', handleMoving);
      canvas.off('object:rotating', handleRotating);
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleDeselect);
      canvas.off('text:changed', saveCurrentPage);
      canvas.off('mouse:over', handleMouseOver);
      canvas.off('mouse:out', handleMouseOut);
    };
  }, [pushUndo, saveCurrentPage, setSelectedObject]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) useEditorStore.getState().redo();
        else useEditorStore.getState().undo();
      }

      // Delete (with protection)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const active = canvas.getActiveObject();
        if (active && !((active as fabric.Textbox).isEditing)) {
          const name = ((active as fabric.FabricObject & { name?: string }).name) || '';
          const isProtected = PROTECTED.some((p) => name.includes(p)) || !active.selectable;
          if (!isProtected) {
            canvas.remove(active);
            pushUndo();
            saveCurrentPage();
          }
        }
      }

      // Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCurrentPage();
      }

      // Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const active = canvas.getActiveObject();
        if (active && !((active as fabric.Textbox).isEditing)) {
          active.clone().then((cloned: fabric.FabricObject) => { clipboard = cloned; });
        }
      }

      // Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboard) {
        clipboard.clone().then((pasted: fabric.FabricObject) => {
          pasted.set({ left: (pasted.left || 0) + 20, top: (pasted.top || 0) + 20 });
          canvas.add(pasted);
          canvas.setActiveObject(pasted);
          pushUndo();
          saveCurrentPage();
        });
      }

      // Duplicate (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const active = canvas.getActiveObject();
        if (active && !((active as fabric.Textbox).isEditing)) {
          active.clone().then((cloned: fabric.FabricObject) => {
            cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            pushUndo();
            saveCurrentPage();
          });
        }
      }

      // Select All (Ctrl+A)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        const active = canvas.getActiveObject();
        if (!active || !((active as fabric.Textbox).isEditing)) {
          e.preventDefault();
          const objs = canvas.getObjects().filter((o: any) => o.selectable !== false && !o._isGuide);
          if (objs.length > 0) {
            const sel = new fabric.ActiveSelection(objs, { canvas });
            canvas.setActiveObject(sel);
            canvas.requestRenderAll();
          }
        }
      }

      // Bold (Ctrl+B)
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        const active = canvas.getActiveObject();
        if (active && active.type === 'Textbox') {
          e.preventDefault();
          const tb = active as fabric.Textbox;
          tb.set('fontWeight', tb.fontWeight === 'bold' ? 'normal' : 'bold');
          canvas.requestRenderAll();
          saveCurrentPage();
        }
      }

      // Italic (Ctrl+I)
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        const active = canvas.getActiveObject();
        if (active && active.type === 'Textbox') {
          e.preventDefault();
          const tb = active as fabric.Textbox;
          tb.set('fontStyle', tb.fontStyle === 'italic' ? 'normal' : 'italic');
          canvas.requestRenderAll();
          saveCurrentPage();
        }
      }

      // Bring Forward (Ctrl+])
      if ((e.ctrlKey || e.metaKey) && e.key === ']') {
        const active = canvas.getActiveObject();
        if (active) {
          e.preventDefault();
          canvas.bringObjectForward(active);
          canvas.requestRenderAll();
          pushUndo();
          saveCurrentPage();
        }
      }

      // Send Backward (Ctrl+[)
      if ((e.ctrlKey || e.metaKey) && e.key === '[') {
        const active = canvas.getActiveObject();
        if (active) {
          e.preventDefault();
          canvas.sendObjectBackwards(active);
          canvas.requestRenderAll();
          pushUndo();
          saveCurrentPage();
        }
      }

      // Arrow key nudge (1px, or 10px with Shift)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const active = canvas.getActiveObject();
        if (active && !((active as fabric.Textbox).isEditing)) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          if (e.key === 'ArrowUp') active.set('top', (active.top || 0) - step);
          if (e.key === 'ArrowDown') active.set('top', (active.top || 0) + step);
          if (e.key === 'ArrowLeft') active.set('left', (active.left || 0) - step);
          if (e.key === 'ArrowRight') active.set('left', (active.left || 0) + step);
          active.setCoords();
          canvas.requestRenderAll();
          saveCurrentPage();
        }
      }

      // Escape - deselect
      if (e.key === 'Escape') {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pushUndo, saveCurrentPage]);

  // ── Drag and drop ──
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const canvas = fabricRef.current;
    if (!canvas) return;

    const imageUrl = e.dataTransfer.getData('text/plain');
    const files = e.dataTransfer.files;

    if (imageUrl && imageUrl.startsWith('http')) {
      try {
        const img = await fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        const scale = Math.min(500 / (img.width || 1), 1);

        img.set({
          left: x - ((img.width || 200) * scale) / 2,
          top: y - ((img.height || 200) * scale) / 2,
          scaleX: scale, scaleY: scale,
          selectable: true, hasControls: true,
          name: `photo_dropped_${Date.now()}`,
        });

        pushUndo();
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
        saveCurrentPage();
      } catch (err) { console.error('Failed to drop image:', err); }
    } else if (files.length > 0) {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const reader = new FileReader();
        reader.onload = async (event) => {
          const dataUrl = event.target?.result as string;
          if (!dataUrl) return;
          try {
            const img = await fabric.FabricImage.fromURL(dataUrl);
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = (e.clientX - rect.left) / zoom;
            const y = (e.clientY - rect.top) / zoom;
            const scale = Math.min(500 / (img.width || 1), 1);
            img.set({ left: x, top: y, scaleX: scale, scaleY: scale, selectable: true, hasControls: true, name: `photo_local_${Date.now()}` });
            pushUndo(); canvas.add(img); canvas.setActiveObject(img); canvas.requestRenderAll(); saveCurrentPage();
          } catch (err) { console.error('Failed to load dropped file:', err); }
        };
        reader.readAsDataURL(file);
      }
    }
  }, [zoom, pushUndo, saveCurrentPage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  return (
    <div
      className="flex items-center justify-center p-8 bg-gray-200 min-h-full overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="shadow-2xl" style={{ width: CANVAS.width * zoom, height: CANVAS.height * zoom }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export { fabricRef } from './canvas-page-ref';
