'use client';

import { useEditorStore } from '@/stores/editor-store';
import { PAGE_NAMES } from '@/lib/constants';

export function PageNavigator() {
  const pages = useEditorStore((s) => s.pages);
  const activePageIndex = useEditorStore((s) => s.activePageIndex);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const thumbnails = useEditorStore((s) => s.thumbnails);

  return (
    <nav className="w-52 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0" aria-label="Pages" data-testid="page-navigator">
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Pages
        </h3>
        <div className="space-y-2" role="list">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => setActivePage(index)}
              role="listitem"
              aria-current={activePageIndex === index ? 'page' : undefined}
              aria-label={`${PAGE_NAMES[index] || `Page ${index + 1}`}${activePageIndex === index ? ' (current)' : ''}`}
              className={`
                w-full text-left rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                ${
                  activePageIndex === index
                    ? 'bg-[var(--accent)] bg-opacity-10 border-2 border-[var(--accent)]'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }
              `}
            >
              <div
                className={`
                  w-full aspect-[1754/1240] rounded overflow-hidden mb-1.5
                  ${!thumbnails[index] ? 'bg-gray-200 flex items-center justify-center text-xs text-gray-400' : ''}
                  ${activePageIndex === index && !thumbnails[index] ? 'bg-[var(--ivory)]' : ''}
                `}
              >
                {thumbnails[index] ? (
                  <img
                    src={thumbnails[index]}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                    draggable={false}
                  />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <p className="text-xs font-medium truncate">
                {PAGE_NAMES[index] || `Page ${index + 1}`}
              </p>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
