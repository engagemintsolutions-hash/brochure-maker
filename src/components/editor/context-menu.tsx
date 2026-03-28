'use client';

import { useEffect, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { Copy, Clipboard, Trash2, CopyPlus, Lock, Unlock, ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { fabricRef } from './canvas-page-ref';
import { useEditorStore } from '@/stores/editor-store';
import { getCanvasJson } from '@/lib/editor/fabric-helpers';

interface MenuPos { x: number; y: number }

const PROTECTED = ['footer_bar', 'footer_line', 'top_bar', 'top_line', '_bg', 'overlay', 'sidebar', 'frame', 'accent_strip', 'grid_', 'split_divider', 'cover_panel', 'cover_overlay'];

export function ContextMenu() {
  const [pos, setPos] = useState<MenuPos | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const save = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const store = useEditorStore.getState();
    store.pushUndo();
    store.updatePageCanvas(store.activePageIndex, getCanvasJson(canvas));
  }, []);

  useEffect(() => {
    const handleContext = (e: MouseEvent) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      // Only show on the canvas area
      const canvasEl = canvas.getElement();
      const wrapper = canvasEl.parentElement;
      if (!wrapper || !wrapper.contains(e.target as Node)) return;

      e.preventDefault();
      const active = canvas.getActiveObject();
      setHasSelection(!!active);
      setIsLocked(active ? !active.selectable : false);
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => setPos(null);

    window.addEventListener('contextmenu', handleContext);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('contextmenu', handleContext);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  if (!pos) return null;

  const canvas = fabricRef.current;
  const active = canvas?.getActiveObject();
  const name = ((active as any)?.name || '') as string;
  const isProtected = PROTECTED.some((p) => name.includes(p));

  const items = [
    ...(hasSelection ? [
      { label: 'Copy', icon: Copy, shortcut: 'Ctrl+C', action: () => { active?.clone().then((c: any) => { (window as any).__clipboard = c; }); } },
      { label: 'Duplicate', icon: CopyPlus, shortcut: 'Ctrl+D', action: () => {
        active?.clone().then((c: any) => {
          c.set({ left: (c.left || 0) + 20, top: (c.top || 0) + 20 });
          canvas?.add(c); canvas?.setActiveObject(c); save();
        });
      }},
      { label: 'divider' },
      { label: 'Bring Forward', icon: ArrowUp, shortcut: 'Ctrl+]', action: () => { if (active) { canvas?.bringObjectForward(active); canvas?.requestRenderAll(); save(); } } },
      { label: 'Bring to Front', icon: ArrowUpToLine, action: () => { if (active) { canvas?.bringObjectToFront(active); canvas?.requestRenderAll(); save(); } } },
      { label: 'Send Backward', icon: ArrowDown, shortcut: 'Ctrl+[', action: () => { if (active) { canvas?.sendObjectBackwards(active); canvas?.requestRenderAll(); save(); } } },
      { label: 'Send to Back', icon: ArrowDownToLine, action: () => { if (active) { canvas?.sendObjectToBack(active); canvas?.requestRenderAll(); save(); } } },
      { label: 'divider' },
      { label: isLocked ? 'Unlock' : 'Lock', icon: isLocked ? Unlock : Lock, action: () => {
        if (active) {
          const lock = !isLocked;
          active.set({ selectable: !lock, evented: !lock, hasControls: !lock, lockMovementX: lock, lockMovementY: lock });
          canvas?.discardActiveObject(); canvas?.requestRenderAll(); save();
        }
      }},
      ...(!isProtected ? [{ label: 'Delete', icon: Trash2, shortcut: 'Del', action: () => { if (active) { canvas?.remove(active); save(); } }, danger: true }] : []),
    ] : [
      { label: 'Paste', icon: Clipboard, shortcut: 'Ctrl+V', action: () => {
        const clip = (window as any).__clipboard;
        if (clip) { clip.clone().then((c: any) => { c.set({ left: (c.left || 0) + 20, top: (c.top || 0) + 20 }); canvas?.add(c); canvas?.setActiveObject(c); save(); }); }
      }},
      { label: 'Select All', shortcut: 'Ctrl+A', action: () => {
        if (!canvas) return;
        const objs = canvas.getObjects().filter((o: any) => o.selectable !== false && !(o as any)._isGuide);
        if (objs.length > 0) {
          const sel = new fabric.ActiveSelection(objs, { canvas });
          canvas.setActiveObject(sel);
          canvas.requestRenderAll();
        }
      }},
    ]),
  ];

  return (
    <div
      className="fixed z-[100] bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[200px]"
      style={{ left: pos.x, top: pos.y }}
    >
      {items.map((item, i) => {
        if (item.label === 'divider') {
          return <div key={i} className="border-t border-gray-100 my-1" />;
        }
        const Icon = (item as any).icon;
        return (
          <button
            key={i}
            onClick={() => { (item as any).action?.(); setPos(null); }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 text-sm hover:bg-gray-50 ${(item as any).danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {!Icon && <span className="w-3.5" />}
            <span className="flex-1 text-left">{item.label}</span>
            {(item as any).shortcut && <span className="text-xs text-gray-400">{(item as any).shortcut}</span>}
          </button>
        );
      })}
    </div>
  );
}
