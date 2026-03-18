'use client';

import { useState } from 'react';
import { X, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { exportToPdf, downloadBlob } from '@/lib/editor/pdf-export';

interface ExportDialogProps {
  onClose: () => void;
}

export function ExportDialog({ onClose }: ExportDialogProps) {
  const pages = useEditorStore((s) => s.pages);
  const propertyDetails = useEditorStore((s) => s.propertyDetails);

  const [quality, setQuality] = useState<'standard' | 'high'>('standard');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isDone, setIsDone] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress({ current: 0, total: pages.length });

    try {
      const blob = await exportToPdf(pages, quality, (current, total) => {
        setProgress({ current, total });
      });

      const address = propertyDetails?.address;
      const filename = address
        ? `${address.line1.replace(/[^a-zA-Z0-9]/g, '_')}_Brochure.pdf`
        : 'Property_Brochure.pdf';

      downloadBlob(blob, filename);
      setIsDone(true);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Export PDF</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isExporting && !isDone && (
          <>
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-600">
                Export your {pages.length}-page brochure as a PDF.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="quality"
                      value="standard"
                      checked={quality === 'standard'}
                      onChange={() => setQuality('standard')}
                      className="accent-[var(--accent)]"
                    />
                    <span className="text-sm">Standard (150 DPI)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="quality"
                      value="high"
                      checked={quality === 'high'}
                      onChange={() => setQuality('high')}
                      className="accent-[var(--accent)]"
                    />
                    <span className="text-sm">Print (300 DPI)</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-white py-2.5 rounded-md font-medium hover:bg-[var(--accent-dark)] transition-colors"
            >
              <Download className="w-4 h-4" />
              Generate PDF
            </button>
          </>
        )}

        {isExporting && (
          <div className="text-center py-6">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)] mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              Rendering page {progress.current} of {progress.total}...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-[var(--accent)] h-2 rounded-full transition-all"
                style={{
                  width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}

        {isDone && (
          <div className="text-center py-6">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">PDF downloaded successfully.</p>
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
