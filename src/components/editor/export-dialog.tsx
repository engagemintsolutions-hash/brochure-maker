'use client';

import { useState } from 'react';
import * as fabric from 'fabric';
import { X, Download, Loader2, CheckCircle2, FileImage } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { exportToPdf, downloadBlob } from '@/lib/editor/pdf-export';
import { CANVAS } from '@/lib/constants';

interface ExportDialogProps {
  onClose: () => void;
}

type ExportFormat = 'pdf' | 'png' | 'jpg';

export function ExportDialog({ onClose }: ExportDialogProps) {
  const pages = useEditorStore((s) => s.pages);
  const propertyDetails = useEditorStore((s) => s.propertyDetails);

  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [quality, setQuality] = useState<'standard' | 'high'>('standard');
  const [selectedPages, setSelectedPages] = useState<number[]>(pages.map((_, i) => i));
  const [jpgQuality, setJpgQuality] = useState(92);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isDone, setIsDone] = useState(false);

  const address = propertyDetails?.address;
  const baseName = address ? address.line1.replace(/[^a-zA-Z0-9]/g, '_') : 'Property';

  const togglePage = (i: number) => {
    setSelectedPages((prev) =>
      prev.includes(i) ? prev.filter((p) => p !== i) : [...prev, i].sort(),
    );
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    setProgress({ current: 0, total: selectedPages.length });
    try {
      const filteredPages = selectedPages.map((i) => pages[i]);
      const blob = await exportToPdf(filteredPages, quality, (current, total) => {
        setProgress({ current, total });
      });
      downloadBlob(blob, `${baseName}_Brochure.pdf`);
      setIsDone(true);
    } catch (err) { console.error('Export failed:', err); }
    finally { setIsExporting(false); }
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    const scale = quality === 'high' ? 2 : 1.5;
    setProgress({ current: 0, total: selectedPages.length });

    try {
      for (let idx = 0; idx < selectedPages.length; idx++) {
        const pageIdx = selectedPages[idx];
        setProgress({ current: idx + 1, total: selectedPages.length });

        const offscreen = new fabric.StaticCanvas(undefined, {
          width: CANVAS.width * scale,
          height: CANVAS.height * scale,
        });
        await offscreen.loadFromJSON(pages[pageIdx].canvasJson);
        offscreen.setZoom(scale);
        offscreen.renderAll();

        const dataUrl = offscreen.toDataURL({
          format: format === 'png' ? 'png' : 'jpeg',
          quality: format === 'jpg' ? jpgQuality / 100 : 1,
          multiplier: 1,
        });

        // Download
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${baseName}_Page${pageIdx + 1}.${format}`;
        a.click();

        offscreen.dispose();
        await new Promise((r) => setTimeout(r, 300)); // Small delay between downloads
      }
      setIsDone(true);
    } catch (err) { console.error('Export failed:', err); }
    finally { setIsExporting(false); }
  };

  const handleExport = () => {
    if (format === 'pdf') handleExportPdf();
    else handleExportImage();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[420px] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Export</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isExporting && !isDone && (
          <>
            {/* Format */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div className="flex gap-2">
                {[
                  { id: 'pdf' as const, label: 'PDF', desc: 'Multi-page document' },
                  { id: 'png' as const, label: 'PNG', desc: 'Lossless images' },
                  { id: 'jpg' as const, label: 'JPG', desc: 'Compressed images' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`flex-1 p-2.5 rounded-lg border-2 text-center transition-colors ${
                      format === f.id ? 'border-[var(--accent)] bg-[var(--ivory)]' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{f.label}</div>
                    <div className="text-[10px] text-gray-500">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={quality === 'standard'} onChange={() => setQuality('standard')} className="accent-[var(--accent)]" />
                  <span className="text-sm">Standard (150 DPI)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={quality === 'high'} onChange={() => setQuality('high')} className="accent-[var(--accent)]" />
                  <span className="text-sm">Print (300 DPI)</span>
                </label>
              </div>
            </div>

            {/* JPG quality slider */}
            {format === 'jpg' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compression Quality: {jpgQuality}%
                </label>
                <input
                  type="range" min="50" max="100" value={jpgQuality}
                  onChange={(e) => setJpgQuality(parseInt(e.target.value))}
                  className="w-full h-1.5 accent-[var(--accent)]"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Smaller file</span><span>Higher quality</span>
                </div>
              </div>
            )}

            {/* Page selection */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Pages</label>
                <button
                  onClick={() => setSelectedPages(
                    selectedPages.length === pages.length ? [] : pages.map((_, i) => i),
                  )}
                  className="text-xs text-[var(--accent)] hover:underline"
                >
                  {selectedPages.length === pages.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {pages.map((page, i) => (
                  <button
                    key={i}
                    onClick={() => togglePage(i)}
                    className={`p-1.5 rounded border text-xs text-center transition-colors ${
                      selectedPages.includes(i)
                        ? 'border-[var(--accent)] bg-[var(--ivory)] text-[var(--accent)] font-medium'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={selectedPages.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-white py-2.5 rounded-md font-medium hover:bg-[var(--accent-dark)] disabled:opacity-50 transition-colors"
            >
              {format === 'pdf' ? <Download className="w-4 h-4" /> : <FileImage className="w-4 h-4" />}
              Export {selectedPages.length} {selectedPages.length === 1 ? 'page' : 'pages'} as {format.toUpperCase()}
            </button>
          </>
        )}

        {isExporting && (
          <div className="text-center py-6">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)] mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              {format === 'pdf' ? 'Rendering' : 'Exporting'} page {progress.current} of {progress.total}...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-[var(--accent)] h-2 rounded-full transition-all"
                style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {isDone && (
          <div className="text-center py-6">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">Export complete.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
