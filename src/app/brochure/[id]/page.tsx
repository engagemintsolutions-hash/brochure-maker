'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { CanvasEditor } from '@/components/editor/canvas-editor';
import { useEditorStore } from '@/stores/editor-store';
import { generateBrochureTemplate } from '@/lib/templates/knight-frank';

export default function BrochureEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setBrochure = useEditorStore((s) => s.setBrochure);
  const pages = useEditorStore((s) => s.pages);

  useEffect(() => {
    const loadBrochure = async () => {
      try {
        // Try sessionStorage first (for newly created brochures)
        const stored = sessionStorage.getItem(`brochure-${id}`);

        if (stored) {
          const data = JSON.parse(stored);

          // Generate template pages if not already present
          let brochurePages = data.pages;
          if (!brochurePages || brochurePages.length === 0) {
            brochurePages = generateBrochureTemplate(
              data.propertyDetails,
              data.photos,
              data.generatedText,
              data.accentColor || '#D50032',
            );
          }

          setBrochure(
            id,
            data.propertyDetails,
            data.photos,
            data.generatedText,
            brochurePages,
            data.accentColor || '#D50032',
          );

          setIsLoading(false);
          return;
        }

        // TODO: Try loading from Supabase
        // const res = await fetch(`/api/brochure/${id}`);
        // ...

        setError('Brochure not found. Start by creating a new one.');
      } catch (err) {
        console.error('Failed to load brochure:', err);
        setError('Failed to load brochure.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBrochure();
  }, [id, setBrochure]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin mb-4" />
        <p className="text-gray-500">Loading brochure...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-gray-700 mb-4">{error}</p>
        <a
          href="/brochure/new"
          className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Create New Brochure
        </a>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500">No pages to display.</p>
      </div>
    );
  }

  return <CanvasEditor />;
}
