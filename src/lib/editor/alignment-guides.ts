import * as fabric from 'fabric';
import { CANVAS } from '@/lib/constants';

const SNAP_THRESHOLD = 8;
const GUIDE_COLOR = 'rgba(59, 130, 246, 0.8)';
const GUIDE_DASH = [4, 4];

type Extent = { cx: number; cy: number; left: number; right: number; top: number; bottom: number };

function getExtent(obj: fabric.FabricObject): Extent {
  const bound = obj.getBoundingRect();
  return {
    cx: bound.left + bound.width / 2,
    cy: bound.top + bound.height / 2,
    left: bound.left,
    right: bound.left + bound.width,
    top: bound.top,
    bottom: bound.top + bound.height,
  };
}

function makeGuide(x1: number, y1: number, x2: number, y2: number): fabric.FabricObject {
  const line = new fabric.Line([x1, y1, x2, y2], {
    stroke: GUIDE_COLOR,
    strokeWidth: 1,
    strokeDashArray: GUIDE_DASH,
    selectable: false,
    evented: false,
    excludeFromExport: true,
  });
  (line as unknown as Record<string, unknown>)._isGuide = true;
  return line;
}

export function showAlignmentGuides(canvas: fabric.Canvas, target: fabric.FabricObject | undefined): void {
  if (!target) return;

  clearAlignmentGuides(canvas);

  const moving = getExtent(target);
  const guides: fabric.FabricObject[] = [];

  // Canvas centre guides
  const canvasCX = CANVAS.width / 2;
  const canvasCY = CANVAS.height / 2;

  if (Math.abs(moving.cx - canvasCX) < SNAP_THRESHOLD) {
    guides.push(makeGuide(canvasCX, 0, canvasCX, CANVAS.height));
    target.set('left', (target.left || 0) + (canvasCX - moving.cx));
  }
  if (Math.abs(moving.cy - canvasCY) < SNAP_THRESHOLD) {
    guides.push(makeGuide(0, canvasCY, CANVAS.width, canvasCY));
    target.set('top', (target.top || 0) + (canvasCY - moving.cy));
  }

  // Canvas margin guides
  const M = CANVAS.margin;
  if (Math.abs(moving.left - M) < SNAP_THRESHOLD) {
    guides.push(makeGuide(M, 0, M, CANVAS.height));
    target.set('left', (target.left || 0) + (M - moving.left));
  }
  if (Math.abs(moving.top - M) < SNAP_THRESHOLD) {
    guides.push(makeGuide(0, M, CANVAS.width, M));
    target.set('top', (target.top || 0) + (M - moving.top));
  }

  // Align with other objects
  const objects = canvas.getObjects().filter(
    (o) => o !== target && !(o as unknown as Record<string, unknown>)._isGuide && o.selectable !== false,
  );

  for (const other of objects) {
    const ext = getExtent(other);

    // Centre-X alignment
    if (Math.abs(moving.cx - ext.cx) < SNAP_THRESHOLD) {
      guides.push(makeGuide(ext.cx, Math.min(moving.top, ext.top), ext.cx, Math.max(moving.bottom, ext.bottom)));
      target.set('left', (target.left || 0) + (ext.cx - moving.cx));
    }
    // Centre-Y alignment
    if (Math.abs(moving.cy - ext.cy) < SNAP_THRESHOLD) {
      guides.push(makeGuide(Math.min(moving.left, ext.left), ext.cy, Math.max(moving.right, ext.right), ext.cy));
      target.set('top', (target.top || 0) + (ext.cy - moving.cy));
    }
    // Left edge alignment
    if (Math.abs(moving.left - ext.left) < SNAP_THRESHOLD) {
      guides.push(makeGuide(ext.left, Math.min(moving.top, ext.top), ext.left, Math.max(moving.bottom, ext.bottom)));
      target.set('left', (target.left || 0) + (ext.left - moving.left));
    }
    // Top edge alignment
    if (Math.abs(moving.top - ext.top) < SNAP_THRESHOLD) {
      guides.push(makeGuide(Math.min(moving.left, ext.left), ext.top, Math.max(moving.right, ext.right), ext.top));
      target.set('top', (target.top || 0) + (ext.top - moving.top));
    }
  }

  for (const guide of guides) {
    canvas.add(guide);
  }
}

export function clearAlignmentGuides(canvas: fabric.Canvas): void {
  const guides = canvas.getObjects().filter(
    (o) => (o as unknown as Record<string, unknown>)._isGuide === true,
  );
  for (const guide of guides) {
    canvas.remove(guide);
  }
}
