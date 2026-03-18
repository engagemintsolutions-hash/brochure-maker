'use client';

import { Plus, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
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
      </main>
    </div>
  );
}
