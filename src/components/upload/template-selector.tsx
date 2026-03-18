'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  templates,
  templateCategories,
  BrochureTemplate,
} from '@/lib/templates/template-registry';

interface TemplateSelectorProps {
  selected: string;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered =
    activeCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            activeCategory === 'all'
              ? 'bg-[var(--foreground)] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All (30)
        </button>
        {templateCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeCategory === cat.id
                ? 'bg-[var(--foreground)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            isSelected={selected === t.id}
            onSelect={() => onSelect(t.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: BrochureTemplate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative rounded-lg overflow-hidden border-2 transition-all text-left
        ${isSelected ? 'border-[var(--accent)] shadow-md scale-[1.02]' : 'border-gray-200 hover:border-gray-400'}
      `}
    >
      {/* Color preview */}
      <div
        className="aspect-[1754/1240] relative"
        style={{ background: template.preview.thumbnail }}
      >
        {/* Mini layout preview */}
        <div className="absolute inset-3 flex flex-col">
          {/* Top bar preview */}
          {template.style.topBarStyle !== 'none' && (
            <div
              className="h-1 w-full mb-1 rounded-sm"
              style={{ backgroundColor: template.colors.primary }}
            />
          )}

          {/* Content area preview */}
          <div className="flex-1 bg-white/90 rounded-sm p-2 flex flex-col gap-1">
            <div
              className="h-1.5 w-3/4 rounded-sm"
              style={{ backgroundColor: template.colors.headingColor }}
            />
            <div className="h-1 w-1/2 rounded-sm bg-gray-300" />
            <div className="flex-1 rounded-sm bg-gray-200 mt-1" />
          </div>

          {/* Footer preview */}
          {template.style.footerStyle !== 'none' && (
            <div
              className="h-1.5 w-full mt-1 rounded-sm"
              style={{ backgroundColor: template.colors.primary }}
            />
          )}
        </div>

        {/* Selected check */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 bg-white">
        <p className="text-xs font-medium truncate">{template.name}</p>
        <p className="text-[10px] text-gray-500 truncate">{template.preview.description}</p>
      </div>
    </button>
  );
}
