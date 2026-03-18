'use client';

import { useEditorStore } from '@/stores/editor-store';
import { PAGE_NAMES } from '@/lib/constants';

export function PageNavigator() {
  const pages = useEditorStore((s) => s.pages);
  const activePageIndex = useEditorStore((s) => s.activePageIndex);
  const setActivePage = useEditorStore((s) => s.setActivePage);

  return (
    <div data-testid="page-navigator" className="w-52 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Pages
        </h3>
        <div className="space-y-2">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => setActivePage(index)}
              className={`
                w-full text-left rounded-lg p-2 transition-colors
                ${
                  activePageIndex === index
                    ? 'bg-[var(--accent)] bg-opacity-10 border-2 border-[var(--accent)]'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }
              `}
            >
              {/* Thumbnail placeholder */}
              <div
                className={`
                  w-full aspect-[1754/1240] rounded bg-gray-200 mb-1.5 flex items-center justify-center text-xs text-gray-400
                  ${activePageIndex === index ? 'bg-red-50' : ''}
                `}
              >
                {index + 1}
              </div>
              <p className="text-xs font-medium truncate">
                {PAGE_NAMES[index] || `Page ${index + 1}`}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
