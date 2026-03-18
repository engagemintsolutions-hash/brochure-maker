import * as fabric from 'fabric';
import { CANVAS } from '@/lib/constants';

export async function loadCanvasFromJson(
  canvas: fabric.Canvas | fabric.StaticCanvas,
  json: object,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      canvas.loadFromJSON(json).then(() => {
        canvas.renderAll();
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

export function getCanvasJson(canvas: fabric.Canvas): object {
  const json = canvas.toJSON() as { objects: Record<string, unknown>[] };
  // Preserve custom properties that Fabric strips by default
  const objects = canvas.getObjects();
  json.objects.forEach((obj, i) => {
    const src = objects[i] as unknown as Record<string, unknown>;
    if (src.name) obj.name = src.name;
    if (src._imageUrl) obj._imageUrl = src._imageUrl;
    if (src._targetWidth) obj._targetWidth = src._targetWidth;
    if (src._targetHeight) obj._targetHeight = src._targetHeight;
  });
  return json;
}

export function updateAccentColor(
  canvas: fabric.Canvas,
  oldColor: string,
  newColor: string,
): void {
  const objects = canvas.getObjects();
  for (const obj of objects) {
    const name = (obj as fabric.FabricObject & { name?: string }).name || '';

    // Update footer bars and top accent bars
    if (name.includes('footer_bar') || name.includes('top_bar')) {
      obj.set('fill', newColor);
    }

    // Update accent-colored text (prices, etc.)
    if (obj.type === 'Textbox' && obj.fill === oldColor) {
      obj.set('fill', newColor);
    }

    // Update accent lines
    if (obj.type === 'Line' && obj.stroke === oldColor) {
      obj.set('stroke', newColor);
    }
  }
  canvas.renderAll();
}

export function getThumbnailDataUrl(
  canvas: fabric.Canvas,
  width: number = 200,
): string {
  const scale = width / CANVAS.width;
  return canvas.toDataURL({
    format: 'jpeg',
    quality: 0.5,
    multiplier: scale,
  });
}

export async function loadImageIntoFrame(
  canvas: fabric.Canvas,
  targetName: string,
  imageUrl: string,
): Promise<void> {
  const target = canvas.getObjects().find(
    (obj) => (obj as fabric.FabricObject & { name?: string }).name === targetName,
  );

  if (!target) return;

  const img = await fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });

  // Scale to fill the frame
  const frameWidth = target.width || 100;
  const frameHeight = target.height || 100;
  const scaleX = frameWidth / (img.width || 1);
  const scaleY = frameHeight / (img.height || 1);
  const scale = Math.max(scaleX, scaleY);

  img.set({
    left: target.left,
    top: target.top,
    scaleX: scale,
    scaleY: scale,
    name: targetName,
    selectable: true,
    hasControls: true,
  });

  // Add clip path to constrain to frame
  img.clipPath = new fabric.Rect({
    width: frameWidth / scale,
    height: frameHeight / scale,
    absolutePositioned: false,
  });

  // Replace the placeholder
  canvas.remove(target);
  canvas.add(img);
  canvas.renderAll();
}
