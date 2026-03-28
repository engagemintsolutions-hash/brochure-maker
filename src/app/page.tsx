'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { listBrochures, deleteBrochure } from '@/lib/supabase/brochures';

interface SavedBrochure {
  id: string;
  address: string;
  price: string;
  photoCount: number;
}

export default function DashboardPage() {
  const [brochures, setBrochures] = useState<SavedBrochure[]>([]);

  useEffect(() => {
    let cancelled = false;
    listBrochures().then((list) => {
      if (!cancelled) setBrochures(list);
    });
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (id: string) => {
    await deleteBrochure(id);
    const list = await listBrochures();
    setBrochures(list);
  };

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/doorstep-logo.png" alt="Doorstep" width={140} height={40} className="h-9 w-auto" />
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <h1 className="text-lg font-semibold font-[family-name:var(--font-playfair)]">
                Brochure Maker
              </h1>
            </div>
          </div>
          <Link
            href="/brochure/new"
            className="flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-md font-medium hover:bg-[var(--accent-dark)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Brochure
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {brochures.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No brochures yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Upload property photos and let AI generate a professional brochure in the style of
              leading estate agents. Edit everything afterward.
            </p>
            <Link
              href="/brochure/new"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--accent-dark)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Brochure
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Your Brochures</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {brochures.map((b) => (
                <div
                  key={b.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <Link href={`/brochure/${b.id}`} className="block p-5">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{b.address}</h3>
                        {b.price && (
                          <p className="text-sm text-[var(--accent)] font-medium mt-1">{b.price}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {b.photoCount} photo{b.photoCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <FileText className="w-8 h-8 text-gray-200 flex-shrink-0 ml-3" />
                    </div>
                  </Link>
                  <div className="border-t border-gray-100 px-5 py-2 flex justify-between items-center">
                    <Link
                      href={`/brochure/${b.id}`}
                      className="text-xs text-[var(--accent)] font-medium hover:underline"
                    >
                      Open in editor
                    </Link>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete brochure"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
