import { describe, it, expect } from 'vitest';
import { generateFromTemplate } from '@/lib/templates/generate-from-template';
import { getTemplateById, templates } from '@/lib/templates/template-registry';
import { PropertyDetails } from '@/types/property';
import { PhotoAnalysis, GeneratedText } from '@/types/brochure';

const mockProperty: PropertyDetails = {
  address: {
    line1: '14 Elm Park Gardens',
    line2: 'Chelsea',
    city: 'London',
    county: 'Greater London',
    postcode: 'SW3 6PE',
  },
  price: 1250000,
  priceQualifier: 'guide_price',
  bedrooms: 3,
  bathrooms: 2,
  receptions: 2,
  propertyType: 'Terraced House',
  tenure: 'freehold',
  councilTaxBand: 'G',
  epcRating: 'C',
  sqft: 1850,
  agentName: 'John Smith',
  agentPhone: '020 7861 1000',
  agentEmail: 'john@example.com',
};

const mockPhotos: PhotoAnalysis[] = Array.from({ length: 8 }, (_, i) => ({
  id: `photo-${i}`,
  blobUrl: `https://example.com/photo-${i}.jpg`,
  filename: `photo-${i}.jpg`,
  roomType: (['exterior_front', 'living_room', 'kitchen', 'bedroom', 'bathroom', 'garden', 'hallway', 'aerial'] as const)[i],
  caption: `Photo ${i}`,
  features: ['feature1'],
  lighting: 'natural' as const,
  quality: 'high' as const,
  suggestedPage: i,
}));

const mockText: GeneratedText = {
  coverTagline: 'An exceptional family home',
  overviewIntro: 'A beautifully presented three bedroom house.',
  keyFeatures: ['Period features', 'South-facing garden', 'Modern kitchen'],
  situation: 'Located in the heart of Chelsea.',
  accommodation1: 'The ground floor comprises a spacious reception room.',
  accommodation2: 'The first floor features three generous bedrooms.',
  outside: 'The rear garden enjoys a south-westerly aspect.',
  roomCaptions: {},
};

describe('generateFromTemplate', () => {
  it('generates 8 pages', () => {
    const template = getTemplateById('full-bleed-cinematic')!;
    const pages = generateFromTemplate(template, mockProperty, mockPhotos, mockText);
    expect(pages).toHaveLength(8);
  });

  it('assigns correct page names', () => {
    const template = getTemplateById('full-bleed-cinematic')!;
    const pages = generateFromTemplate(template, mockProperty, mockPhotos, mockText);
    expect(pages[0].name).toBe('Cover');
    expect(pages[1].name).toBe('Property Overview');
    expect(pages[6].name).toBe('Details');
    expect(pages[7].name).toBe('Location');
  });

  it('cover page contains address and price', () => {
    const template = getTemplateById('full-bleed-cinematic')!;
    const pages = generateFromTemplate(template, mockProperty, mockPhotos, mockText);
    const cover = pages[0].canvasJson as { objects: { text?: string; name?: string }[] };
    const addressObj = cover.objects.find((o) => o.name === 'cover_address');
    const priceObj = cover.objects.find((o) => o.name === 'cover_price');
    expect(addressObj?.text).toContain('14 Elm Park Gardens');
    expect(priceObj?.text).toContain('1,250,000');
  });

  it('generates different layouts for different variants', () => {
    const template1 = getTemplateById('full-bleed-cinematic')!;
    const template2 = getTemplateById('swiss-grid')!;

    const pages1 = generateFromTemplate(template1, mockProperty, mockPhotos, mockText);
    const pages2 = generateFromTemplate(template2, mockProperty, mockPhotos, mockText);

    // Overview pages should have different object arrangements due to layout variants
    const overview1 = (pages1[1].canvasJson as { objects: object[] }).objects;
    const overview2 = (pages2[1].canvasJson as { objects: object[] }).objects;
    expect(JSON.stringify(overview1)).not.toBe(JSON.stringify(overview2));
  });

  it('applies image frame style from template', () => {
    const template = templates.find((t) => t.style.imageFrameStyle === 'thin-border')!;
    if (!template) return;

    const pages = generateFromTemplate(template, mockProperty, mockPhotos, mockText);
    // thin-border templates should produce border rects around images
    const overview = (pages[1].canvasJson as { objects: { name?: string; stroke?: string }[] }).objects;
    const borderedElements = overview.filter((o) => o.stroke);
    expect(borderedElements.length).toBeGreaterThan(0);
  });

  it('applies divider style from template', () => {
    const accentTemplate = templates.find((t) => t.style.dividerStyle === 'accent-block')!;
    if (!accentTemplate) return;

    const pages = generateFromTemplate(accentTemplate, mockProperty, mockPhotos, mockText);
    const overview = (pages[1].canvasJson as { objects: { name?: string; type?: string }[] }).objects;
    const divider = overview.find((o) => o.name === 'overview_divider');
    expect(divider).toBeDefined();
  });

  it('details page includes tenure and council tax', () => {
    const template = getTemplateById('full-bleed-cinematic')!;
    const pages = generateFromTemplate(template, mockProperty, mockPhotos, mockText);
    const details = (pages[6].canvasJson as { objects: { text?: string; name?: string }[] }).objects;
    const infoObj = details.find((o) => o.name === 'details_info');
    expect(infoObj?.text).toContain('Freehold');
    expect(infoObj?.text).toContain('Band G');
  });

  it('works with minimal photos', () => {
    const template = getTemplateById('full-bleed-cinematic')!;
    const fewPhotos = mockPhotos.slice(0, 3);
    const pages = generateFromTemplate(template, mockProperty, fewPhotos, mockText);
    expect(pages).toHaveLength(8);
  });

  it('every template generates without errors', () => {
    for (const template of templates) {
      expect(() => {
        generateFromTemplate(template, mockProperty, mockPhotos, mockText);
      }).not.toThrow();
    }
  });
});
