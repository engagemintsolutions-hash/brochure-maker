'use client';

import { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  '#D50032', // Knight Frank red
  '#002855', // Savills navy
  '#C5A572', // Gold
  '#1B4D3E', // Heritage green
  '#2C3E50', // Dark slate
  '#8B4513', // Saddle brown
  '#4A0E4E', // Deep purple
  '#1A1A1A', // Black
];

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100"
      >
        <div
          className="w-5 h-5 rounded border border-gray-300"
          style={{ backgroundColor: color }}
        />
        {label && <span className="text-xs text-gray-600">{label}</span>}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  onChange(c);
                  setIsOpen(false);
                }}
                className={`w-8 h-8 rounded border-2 transition-transform hover:scale-110 ${
                  c === color ? 'border-gray-900 scale-110' : 'border-gray-200'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8 border-0 p-0 cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => {
                if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                  onChange(e.target.value);
                }
              }}
              className="w-20 text-xs border border-gray-200 rounded px-2 py-1 font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
}
