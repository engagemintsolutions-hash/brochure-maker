'use client';

import { Type, Image, Square, Minus, Eye, EyeOff, ArrowUp, ArrowDown, Lock, Unlock } from 'lucide-react';
import { fabricRef } from './canvas-page-ref';
import { useEditorStore } from '@/stores/editor-store';
import { getCanvasJson } from '@/lib/editor/fabric-helpers';

export function LayersPanel() {
  const canvasVersion = useEditorStore((s) => s.canvasVersion);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);

  const canvas = fabricRef.current;
  if (!canvas) return null;

  // Force re-read when canvasVersion changes
  void canvasVersion;

  const objects = canvas.getObjects()
    .filter((o: any) => !o._isGuide)
    .map((obj, index) => {
      const name = (obj as any).name || `Element ${index + 1}`;
      const type = obj.type || 'unknown';
      return { obj, name, type, index, visible: obj.visible !== false, locked: !obj.selectable };
    })
    .reverse(); // Top layer first

  const save = () => {
    const store = useEditorStore.getState();
    store.pushUndo();
    store.updatePageCanvas(store.activePageIndex, getCanvasJson(canvas));
    store.bumpCanvasVersion();
  };

  const getIcon = (type: string) => {
    if (type === 'Textbox') return Type;
    if (type === 'Image') return Image;
    if (type === 'Line') return Minus;
    return Square;
  };

  if (objects.length === 0) return null;

  return (
    <div className="border-t border-gray-200 mt-4 pt-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Layers ({objects.length})
      </h3>
      <div className="max-h-48 overflow-y-auto space-y-0.5">
        {objects.map((item) => {
          const Icon = getIcon(item.type);
          const isSelected = item.name === selectedObjectId;
          return (
            <div
              key={item.index}
              onClick={() => {
                if (item.locked) return;
                canvas.setActiveObject(item.obj);
                canvas.requestRenderAll();
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer ${
                isSelected ? 'bg-[var(--accent)] bg-opacity-10 text-[var(--accent)]' : 'text-gray-600 hover:bg-gray-50'
              } ${item.locked ? 'opacity-50' : ''}`}
            >
              <Icon className="w-3 h-3 flex-shrink-0" />
              <span className="flex-1 truncate">{item.name.replace(/_/g, ' ')}</span>

              {/* Visibility toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.obj.set('visible', !item.visible);
                  canvas.requestRenderAll();
                  save();
                }}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {item.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
              </button>

              {/* Move up */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  canvas.bringObjectForward(item.obj);
                  canvas.requestRenderAll();
                  save();
                }}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                <ArrowUp className="w-3 h-3" />
              </button>

              {/* Move down */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  canvas.sendObjectBackwards(item.obj);
                  canvas.requestRenderAll();
                  save();
                }}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                <ArrowDown className="w-3 h-3" />
              </button>

              {/* Lock toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const lock = !item.locked;
                  item.obj.set({ selectable: !lock, evented: !lock, hasControls: !lock, lockMovementX: lock, lockMovementY: lock });
                  if (lock) canvas.discardActiveObject();
                  canvas.requestRenderAll();
                  save();
                }}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {item.locked ? <Lock className="w-3 h-3 text-gray-400" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
