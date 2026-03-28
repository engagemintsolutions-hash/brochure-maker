import { describe, it, expect } from 'vitest';
import { templates, getTemplateById } from '@/lib/templates/template-registry';

describe('template-registry', () => {
  it('has 30 templates', () => {
    expect(templates).toHaveLength(30);
  });

  it('every template has a unique id', () => {
    const ids = templates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every template has required colors', () => {
    for (const t of templates) {
      expect(t.colors.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(t.colors.background).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(t.colors.text).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(t.colors.headingColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('every template has valid style options', () => {
    const validOverlays = ['dark', 'light', 'gradient-bottom', 'none'];
    const validFooters = ['solid', 'thin-line', 'none'];

    for (const t of templates) {
      expect(validOverlays).toContain(t.style.coverOverlay);
      expect(validFooters).toContain(t.style.footerStyle);
      expect(t.layoutVariant).toBeTruthy();
    }
  });

  it('every template has a layoutVariant and description', () => {
    for (const t of templates) {
      expect(t.layoutVariant).toBeTruthy();
      expect(t.description).toBeTruthy();
    }
  });

  it('getTemplateById returns correct template', () => {
    const t = getTemplateById('full-bleed-cinematic');
    expect(t).toBeDefined();
    expect(t?.name).toBe('Cinematic');
  });

  it('getTemplateById returns undefined for invalid id', () => {
    expect(getTemplateById('non-existent')).toBeUndefined();
  });

  it('no template has body text contrast below 4.5:1 on its background', () => {
    function hexToRgb(hex: string) {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b].map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    }

    function luminance(hex: string) {
      const [r, g, b] = hexToRgb(hex);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function contrastRatio(hex1: string, hex2: string) {
      const l1 = luminance(hex1);
      const l2 = luminance(hex2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    for (const t of templates) {
      const ratio = contrastRatio(t.colors.text, t.colors.background);
      expect(ratio, `${t.name}: text ${t.colors.text} on ${t.colors.background} = ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('has diverse layout variants', () => {
    const variants = new Set(templates.map((t) => t.layoutVariant));
    expect(variants.size).toBeGreaterThanOrEqual(5);
  });
});
