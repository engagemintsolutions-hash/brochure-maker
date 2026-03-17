'use client';

import { jsPDF } from 'jspdf';
import * as fabric from 'fabric';
import { BrochurePage } from '@/types/brochure';
import { CANVAS } from '@/lib/constants';

export async function exportToPdf(
  pages: BrochurePage[],
  quality: 'standard' | 'high' = 'standard',
  onProgress?: (current: number, total: number) => void,
): Promise<Blob> {
  const scale = quality === 'high' ? CANVAS.exportScale : 1.5;
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  for (let i = 0; i < pages.length; i++) {
    onProgress?.(i + 1, pages.length);

    const offscreen = new fabric.StaticCanvas(undefined, {
      width: CANVAS.width * scale,
      height: CANVAS.height * scale,
    });

    // Load the page JSON
    await offscreen.loadFromJSON(pages[i].canvasJson);
    offscreen.setZoom(scale);
    offscreen.renderAll();

    const dataUrl = offscreen.toDataURL({
      format: 'jpeg',
      quality: 0.92,
      multiplier: 1,
    });

    if (i > 0) pdf.addPage();
    pdf.addImage(dataUrl, 'JPEG', 0, 0, 297, 210);

    offscreen.dispose();
  }

  return pdf.output('blob');
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
