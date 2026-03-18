'use client';

import { Check } from 'lucide-react';
import { templates, BrochureTemplate } from '@/lib/templates/template-registry';

interface TemplateSelectorProps {
  selected: string;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {templates.map((t) => (
        <TemplateCard
          key={t.id}
          template={t}
          isSelected={selected === t.id}
          onSelect={() => onSelect(t.id)}
        />
      ))}
    </div>
  );
}

function TemplateCard({ template, isSelected, onSelect }: { template: BrochureTemplate; isSelected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`relative rounded-lg overflow-hidden border-2 transition-all text-left ${isSelected ? 'border-[var(--accent)] shadow-lg scale-[1.02]' : 'border-gray-200 hover:border-gray-400 hover:shadow-md'}`}
    >
      <div className="aspect-[1754/1240] relative p-3" style={{ background: template.preview.thumbnail }}>
        <LayoutMiniPreview layoutVariant={template.layoutVariant} colors={template.colors} />
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <div className="p-3 bg-white">
        <p className="text-sm font-semibold">{template.name}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{template.description}</p>
      </div>
    </button>
  );
}

function LayoutMiniPreview({ layoutVariant, colors }: { layoutVariant: string; colors: BrochureTemplate['colors'] }) {
  const bg = 'rgba(255,255,255,0.9)';
  const photo = 'rgba(0,0,0,0.15)';
  const textLine = colors.headingColor;
  const textBody = 'rgba(0,0,0,0.2)';

  switch (layoutVariant) {
    case 'full-bleed-cinematic':
      return (
        <div className="w-full h-full relative rounded-sm overflow-hidden" style={{ background: photo }}>
          <div className="absolute bottom-0 left-0 w-1/3 h-2/5 p-1.5 rounded-tr-sm" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="h-1.5 w-4/5 rounded-sm mb-1" style={{ background: '#fff' }} />
            <div className="h-1 w-3/5 rounded-sm" style={{ background: 'rgba(255,255,255,0.5)' }} />
          </div>
        </div>
      );
    case 'swiss-grid':
      return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0.5 rounded-sm overflow-hidden">
          <div className="col-span-2 row-span-2" style={{ background: photo }} />
          <div className="p-1" style={{ background: bg }}><div className="h-1 w-full rounded-sm mb-0.5" style={{ background: textLine }} /><div className="h-0.5 w-3/4 rounded-sm" style={{ background: textBody }} /></div>
          <div className="p-1" style={{ background: bg }}><div className="h-0.5 w-full rounded-sm mb-0.5" style={{ background: textBody }} /></div>
          <div style={{ background: photo }} />
          <div style={{ background: photo }} />
        </div>
      );
    case 'kinfolk-minimalist':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center rounded-sm" style={{ background: bg }}>
          <div className="w-2/5 aspect-[4/3] rounded-sm mb-2" style={{ background: photo }} />
          <div className="h-1 w-1/3 rounded-sm mb-1" style={{ background: textLine }} />
          <div className="h-0.5 w-1/4 rounded-sm" style={{ background: textBody }} />
        </div>
      );
    case 'split-screen':
      return (
        <div className="w-full h-full flex rounded-sm overflow-hidden">
          <div className="w-1/2 h-full" style={{ background: photo }} />
          <div className="w-1/2 h-full flex flex-col justify-center p-2" style={{ background: bg }}>
            <div className="h-1.5 w-4/5 rounded-sm mb-1" style={{ background: textLine }} />
            <div className="h-1 w-1/2 rounded-sm mb-2" style={{ background: colors.accent }} />
            <div className="h-0.5 w-full rounded-sm mb-0.5" style={{ background: textBody }} />
            <div className="h-0.5 w-3/4 rounded-sm" style={{ background: textBody }} />
          </div>
        </div>
      );
    case 'editorial-magazine':
      return (
        <div className="w-full h-full rounded-sm overflow-hidden" style={{ background: bg }}>
          <div className="w-full h-3/5 flex">
            <div className="w-2/5 h-full p-1.5 flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <div className="h-1 w-3/4 rounded-sm mb-0.5" style={{ background: '#fff' }} />
              <div className="h-0.5 w-1/2 rounded-sm" style={{ background: 'rgba(255,255,255,0.5)' }} />
            </div>
            <div className="w-3/5 h-full" style={{ background: photo }} />
          </div>
          <div className="px-1.5 pt-1 flex gap-1">
            <div className="flex-1"><div className="h-0.5 w-full rounded-sm mb-0.5" style={{ background: textBody }} /><div className="h-0.5 w-4/5 rounded-sm" style={{ background: textBody }} /></div>
            <div className="flex-1"><div className="h-0.5 w-full rounded-sm mb-0.5" style={{ background: textBody }} /><div className="h-0.5 w-3/5 rounded-sm" style={{ background: textBody }} /></div>
            <div className="flex-1"><div className="h-0.5 w-full rounded-sm mb-0.5" style={{ background: textBody }} /><div className="h-0.5 w-2/3 rounded-sm" style={{ background: textBody }} /></div>
          </div>
        </div>
      );
    case 'horizontal-bands':
      return (
        <div className="w-full h-full flex flex-col rounded-sm overflow-hidden">
          <div className="w-full flex-[3]" style={{ background: photo }} />
          <div className="w-full h-1" style={{ background: colors.accent }} />
          <div className="w-full flex-[2] flex items-center justify-center" style={{ background: colors.primary }}>
            <div className="h-1.5 w-3/5 rounded-sm" style={{ background: '#fff' }} />
          </div>
        </div>
      );
    case 'framed-gallery':
      return (
        <div className="w-full h-full p-2 rounded-sm" style={{ background: colors.backgroundAlt }}>
          <div className="w-full h-full rounded-sm flex flex-col items-center pt-1.5" style={{ background: bg }}>
            <div className="w-[85%] h-3/5 border rounded-sm" style={{ background: photo, borderColor: textLine }} />
            <div className="h-1 w-2/5 rounded-sm mt-2 mb-0.5" style={{ background: textLine }} />
            <div className="h-0.5 w-1/3 rounded-sm" style={{ background: textBody }} />
          </div>
        </div>
      );
    case 'sidebar-panel':
      return (
        <div className="w-full h-full flex rounded-sm overflow-hidden">
          <div className="w-[15%] h-full" style={{ background: colors.primary }} />
          <div className="flex-1" style={{ background: photo }} />
        </div>
      );
    default:
      return <div className="w-full h-full rounded-sm" style={{ background: photo }} />;
  }
}
