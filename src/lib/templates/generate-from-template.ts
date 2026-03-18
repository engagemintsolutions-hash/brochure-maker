/**
 * Generates 8 Fabric.js canvas pages from a BrochureTemplate + property data.
 * This replaces the knight-frank.ts hardcoded template with a dynamic system
 * that uses any template from the registry.
 */

import { BrochureTemplate } from './template-registry';
import { BrochurePage, PhotoAnalysis, GeneratedText } from '@/types/brochure';
import { PropertyDetails } from '@/types/property';
import { mapPhotosToPages, PagePhotoAssignment } from '@/lib/photo-mapper';
import { CANVAS, FONTS, PAGE_NAMES } from '@/lib/constants';
import {
  coverLayouts,
  overviewLayouts,
  contentLayouts,
  accommodationLayouts,
} from './layout-variants';

const W = CANVAS.width;
const H = CANVAS.height;
const M = CANVAS.margin;
const CW = CANVAS.contentWidth;
const FH = CANVAS.footerHeight;

function formatPrice(price: number, qualifier: string): string {
  const formatted = `£${price.toLocaleString('en-GB')}`;
  const labels: Record<string, string> = {
    guide_price: `Guide Price ${formatted}`,
    offers_over: `Offers Over ${formatted}`,
    offers_in_region: `Offers in the Region of ${formatted}`,
    fixed: formatted,
  };
  return labels[qualifier] || formatted;
}

function text(
  name: string,
  left: number,
  top: number,
  width: number,
  height: number,
  content: string,
  opts: Record<string, unknown> = {},
) {
  return {
    type: 'Textbox',
    name,
    left,
    top,
    width,
    height,
    text: content,
    splitByGrapheme: true,
    editable: true,
    selectable: true,
    evented: true,
    hasControls: true,
    lockMovementX: false,
    lockMovementY: false,
    ...opts,
  };
}

function rect(
  name: string,
  left: number,
  top: number,
  width: number,
  height: number,
  fill: string,
  opts: Record<string, unknown> = {},
) {
  return {
    type: 'Rect',
    name,
    left,
    top,
    width,
    height,
    fill,
    selectable: false,
    evented: false,
    hasControls: false,
    lockMovementX: true,
    lockMovementY: true,
    ...opts,
  };
}

function image(
  name: string,
  left: number,
  top: number,
  width: number,
  height: number,
  url: string,
) {
  return {
    type: 'Image',
    name,
    left,
    top,
    width,
    height,
    src: url,
    _imageUrl: url,
    crossOrigin: 'anonymous',
    selectable: true,
    evented: true,
    hasControls: true,
    lockMovementX: false,
    lockMovementY: false,
  };
}

function line(
  name: string,
  left: number,
  top: number,
  length: number,
  color: string,
  strokeWidth: number = 1,
) {
  return {
    type: 'Line',
    name,
    left,
    top,
    x1: 0,
    y1: 0,
    x2: length,
    y2: 0,
    stroke: color,
    strokeWidth,
    selectable: false,
    evented: false,
    hasControls: false,
    lockMovementX: true,
    lockMovementY: true,
  };
}

function makeFooter(t: BrochureTemplate, pageNum: number, agentText: string = ''): object[] {
  const elements: object[] = [];

  if (t.style.footerStyle === 'solid') {
    elements.push(rect(`footer_bar_${pageNum}`, 0, H - FH, W, FH, t.colors.primary));
    if (agentText) {
      elements.push(
        text(`footer_text_${pageNum}`, M, H - FH + 10, CW, 20, agentText, {
          fontFamily: t.fonts.body,
          fontSize: 10,
          fill: '#FFFFFF',
          textAlign: 'center',
        }),
      );
    }
  } else if (t.style.footerStyle === 'thin-line') {
    elements.push(line(`footer_line_${pageNum}`, M, H - 30, CW, t.colors.accent, 1));
    if (agentText) {
      elements.push(
        text(`footer_text_${pageNum}`, M, H - 22, CW, 16, agentText, {
          fontFamily: t.fonts.body,
          fontSize: 9,
          fill: t.colors.textLight,
          textAlign: 'center',
        }),
      );
    }
  }

  return elements;
}

function makeTopBar(t: BrochureTemplate, pageNum: number): object[] {
  if (t.style.topBarStyle === 'solid') {
    return [rect(`top_bar_${pageNum}`, 0, 0, W, 8, t.colors.primary)];
  }
  if (t.style.topBarStyle === 'thin-line') {
    return [line(`top_line_${pageNum}`, M, 8, CW, t.colors.accent, 1)];
  }
  return [];
}

function headingStyle(t: BrochureTemplate) {
  return {
    fontFamily: t.fonts.heading,
    fontSize: 36,
    fontWeight: t.style.headingWeight,
    fill: t.colors.headingColor,
    textAlign: 'left' as const,
  };
}

function bodyStyle(t: BrochureTemplate) {
  return {
    fontFamily: t.fonts.body,
    fontSize: 14,
    lineHeight: 1.7,
    fill: t.colors.text,
  };
}

function applyCase(text: string, caseStyle: string): string {
  if (caseStyle === 'uppercase') return text.toUpperCase();
  if (caseStyle === 'capitalize')
    return text.replace(/\b\w/g, (c) => c.toUpperCase());
  return text;
}

// ──────────────────────────────────────
// PAGE GENERATORS
// ──────────────────────────────────────

function coverPage(
  t: BrochureTemplate,
  property: PropertyDetails,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const hero = photos[0];
  const addr = property.address;
  const price = formatPrice(property.price, property.priceQualifier);
  const layout = coverLayouts[t.layoutVariant];
  const objects: object[] = [];

  // Hero image using layout positions
  if (hero) {
    objects.push(image('cover_hero', layout.heroImage.left, layout.heroImage.top, layout.heroImage.width, layout.heroImage.height, hero.blobUrl));
  }

  // Overlay from layout
  if (layout.overlayRect) {
    objects.push(rect('cover_overlay', layout.overlayRect.left, layout.overlayRect.top, layout.overlayRect.width, layout.overlayRect.height, layout.overlayRect.fill));
  }

  // For split layout, add a coloured panel on the text side
  if (t.layoutVariant === 'split') {
    objects.push(rect('cover_panel', 0, 0, W / 2, H, t.colors.background));
  }

  const isLight = t.style.coverOverlay === 'light' || t.layoutVariant === 'split';
  const textColor = isLight ? t.colors.headingColor : '#FFFFFF';
  const subColor = isLight ? t.colors.textLight : 'rgba(255,255,255,0.8)';

  // Address using layout positions
  objects.push(
    text('cover_address', layout.addressText.left, layout.addressText.top, layout.addressText.width, layout.addressText.height,
      `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}`, {
      fontFamily: t.fonts.heading,
      fontSize: layout.addressText.fontSize,
      fontWeight: t.style.headingWeight === '300' ? '300' : '700',
      fill: textColor,
      textAlign: layout.addressText.align,
    }),
  );

  // Accent line
  if (layout.accentLine) {
    objects.push(line('cover_line', layout.accentLine.left, layout.accentLine.top, layout.accentLine.width, t.colors.accent, 2));
  }

  // Price
  objects.push(
    text('cover_price', layout.priceLine.left, layout.priceLine.top, layout.priceLine.width, layout.priceLine.height, price, {
      fontFamily: t.fonts.body,
      fontSize: layout.priceLine.fontSize,
      fill: textColor,
      textAlign: layout.priceLine.align,
    }),
  );

  // Tagline
  if (genText.coverTagline) {
    objects.push(
      text('cover_tagline', layout.priceLine.left, layout.priceLine.top + 50, layout.priceLine.width, 30, genText.coverTagline, {
        fontFamily: t.fonts.body,
        fontSize: 16,
        fontStyle: 'italic',
        fill: subColor,
        textAlign: layout.priceLine.align,
      }),
    );
  }

  // City
  objects.push(
    text('cover_city', layout.priceLine.left, layout.priceLine.top + 90, layout.priceLine.width, 30,
      `${addr.city}${addr.county ? ', ' + addr.county : ''}`, {
      fontFamily: t.fonts.body,
      fontSize: 14,
      fill: subColor,
      textAlign: layout.priceLine.align,
    }),
  );

  return {
    version: '6.0.0',
    objects,
    background: t.layoutVariant === 'split' ? t.colors.background : t.colors.primary,
  };
}

function overviewPage(
  t: BrochureTemplate,
  property: PropertyDetails,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const price = formatPrice(property.price, property.priceQualifier);
  const features = (genText.keyFeatures || []).map((f) => `•  ${f}`).join('\n');
  const agentLine = property.agentName
    ? `${property.agentName}  |  ${property.agentPhone || ''}  |  ${property.agentEmail || ''}`
    : '';
  const layout = overviewLayouts[t.layoutVariant];

  const objects: object[] = [
    ...makeTopBar(t, 1),
    text('overview_heading', layout.heading.left, layout.heading.top, 700, 50, applyCase('Property Overview', t.style.headingCase), headingStyle(t)),
    line('overview_divider', layout.heading.left, layout.heading.top + 60, 600, t.colors.accent, 1),
    text('overview_price', layout.priceBlock.left, layout.priceBlock.top, layout.priceBlock.width, 35, price, {
      fontFamily: t.fonts.body, fontSize: 22, fontWeight: '600', fill: t.colors.accent,
    }),
    text('overview_stats', layout.statsRow.left, layout.statsRow.top, layout.statsRow.width, 25,
      `${property.bedrooms} Bedrooms  |  ${property.bathrooms} Bathrooms  |  ${property.receptions} Receptions${property.sqft ? `  |  ${property.sqft.toLocaleString()} sq ft` : ''}`, {
      fontFamily: t.fonts.body, fontSize: 14, fill: t.colors.textLight,
    }),
    text('overview_intro', layout.introText.left, layout.introText.top, layout.introText.width, layout.introText.height, genText.overviewIntro || '', bodyStyle(t)),
    text('overview_features', layout.features.left, layout.features.top, layout.features.width, layout.features.height, features, {
      ...bodyStyle(t), fontSize: 13, lineHeight: 1.8,
    }),
  ];

  // Photos from layout
  layout.photos.forEach((photoSlot, i) => {
    if (photos[i]) {
      objects.push(image(`overview_photo_${i}`, photoSlot.left, photoSlot.top, photoSlot.width, photoSlot.height, photos[i].blobUrl));
    }
  });

  if (agentLine) {
    objects.push(text('overview_agent', M, H - 80, 600, 30, agentLine, {
      fontFamily: t.fonts.body, fontSize: 11, fill: t.colors.textLight,
    }));
  }

  objects.push(...makeFooter(t, 1, agentLine));

  return { version: '6.0.0', objects, background: t.colors.background };
}

function situationPage(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const layout = contentLayouts[t.layoutVariant];
  const objects: object[] = [
    ...makeTopBar(t, 2),
    text('situation_heading', layout.heading.left, layout.heading.top, 700, 50, applyCase('The Situation', t.style.headingCase), headingStyle(t)),
    line('situation_divider', layout.heading.left, layout.heading.top + 60, 600, t.colors.accent, 1),
  ];

  layout.textBlocks.forEach((tb, i) => {
    objects.push(text(`situation_text_${i}`, tb.left, tb.top, tb.width, tb.height, i === 0 ? (genText.situation || '') : '', bodyStyle(t)));
  });

  layout.photos.forEach((ps, i) => {
    if (photos[i]) objects.push(image(`situation_photo_${i}`, ps.left, ps.top, ps.width, ps.height, photos[i].blobUrl));
  });

  objects.push(...makeFooter(t, 2));
  return { version: '6.0.0', objects, background: t.colors.background };
}

function accommodation1Page(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const layout = accommodationLayouts[t.layoutVariant];
  const objects: object[] = [
    ...makeTopBar(t, 3),
    text('accom1_heading', layout.heading.left, layout.heading.top, 700, 50, applyCase('The Accommodation', t.style.headingCase), headingStyle(t)),
  ];

  layout.textBlocks.forEach((tb, i) => {
    objects.push(text(`accom1_text_${i}`, tb.left, tb.top, tb.width, tb.height, i === 0 ? (genText.accommodation1 || '') : '', bodyStyle(t)));
  });

  layout.photos.forEach((ps, i) => {
    if (photos[i]) objects.push(image(`accom1_photo_${i}`, ps.left, ps.top, ps.width, ps.height, photos[i].blobUrl));
  });

  objects.push(...makeFooter(t, 3));
  return { version: '6.0.0', objects, background: t.colors.background };
}

function accommodation2Page(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const layout = accommodationLayouts[t.layoutVariant];
  const objects: object[] = [
    ...makeTopBar(t, 4),
    text('accom2_heading', layout.heading.left, layout.heading.top, 700, 50, applyCase('Bedrooms & Bathrooms', t.style.headingCase), headingStyle(t)),
  ];

  layout.textBlocks.forEach((tb, i) => {
    objects.push(text(`accom2_text_${i}`, tb.left, tb.top, tb.width, tb.height, i === 0 ? (genText.accommodation2 || '') : '', bodyStyle(t)));
  });

  layout.photos.forEach((ps, i) => {
    if (photos[i]) objects.push(image(`accom2_photo_${i}`, ps.left, ps.top, ps.width, ps.height, photos[i].blobUrl));
  });

  objects.push(...makeFooter(t, 4));
  return { version: '6.0.0', objects, background: t.colors.background };
}

function outsidePage(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const objects: object[] = [];

  if (photos[0]) objects.push(image('outside_hero', 0, 0, W, 780, photos[0].blobUrl));

  objects.push(
    rect('outside_bg', 0, 780, W, H - 780, t.colors.background),
    text('outside_heading', M, 810, 700, 50, applyCase('Outside & Garden', t.style.headingCase), {
      ...headingStyle(t), fontSize: 32,
    }),
    text('outside_text', M, 870, CW, 280, genText.outside || '', bodyStyle(t)),
    ...makeFooter(t, 5),
  );

  return { version: '6.0.0', objects, background: t.colors.background };
}

function detailsPage(
  t: BrochureTemplate,
  property: PropertyDetails,
): object {
  const tenure = property.tenure.charAt(0).toUpperCase() + property.tenure.slice(1).replace(/_/g, ' ');
  const leftDetails = [
    `Tenure: ${tenure}`,
    `Council Tax: Band ${property.councilTaxBand || 'TBC'}`,
    `EPC Rating: ${property.epcRating || 'TBC'}`,
    property.sqft ? `Approximate Size: ${property.sqft.toLocaleString()} sq ft` : '',
  ].filter(Boolean).join('\n\n');

  const legal = `IMPORTANT NOTICE: These particulars are for guidance only and do not form any part of any contract. The details provided should not be relied upon as statements or representations of fact. All measurements are approximate and should not be relied upon. Prospective purchasers are advised to seek their own professional advice.`;

  const objects: object[] = [
    ...makeTopBar(t, 6),
    text('details_heading', M, 50, 700, 50, applyCase('Details', t.style.headingCase), headingStyle(t)),
    line('details_divider', M, 110, 600, t.colors.accent, 1),
    text('details_info', M, 140, 760, 600, leftDetails, {
      ...bodyStyle(t), fontSize: 15, lineHeight: 1.8,
    }),
    text('details_services', 920, 140, 754, 400, 'Services\nAll mains services are connected.\n\nViewing\nStrictly by appointment through the sole agents.', {
      ...bodyStyle(t), fontSize: 15, lineHeight: 1.8,
    }),
    text('details_legal', M, H - 200, CW, 120, legal, {
      fontFamily: t.fonts.body, fontSize: 9, lineHeight: 1.5, fill: t.colors.textLight,
    }),
    ...makeFooter(t, 6),
  ];

  return { version: '6.0.0', objects, background: t.colors.background };
}

function locationPage(
  t: BrochureTemplate,
  property: PropertyDetails,
  photos: PhotoAnalysis[],
): object {
  const agentLine = property.agentName
    ? `${property.agentName}  |  ${property.agentPhone || ''}  |  ${property.agentEmail || ''}`
    : '';

  const objects: object[] = [];

  if (photos[0]) objects.push(image('location_hero', 0, 0, W, H - 160, photos[0].blobUrl));

  objects.push(
    rect('location_strip', 0, H - 160, W, 160, t.colors.background),
    text('location_address', M, H - 140, 800, 40, `${property.address.line1}, ${property.address.city}, ${property.address.postcode}`, {
      fontFamily: t.fonts.heading, fontSize: 22, fontWeight: '600', fill: t.colors.headingColor,
    }),
  );

  if (agentLine) {
    objects.push(text('location_agent', M, H - 90, 800, 30, agentLine, {
      fontFamily: t.fonts.body, fontSize: 12, fill: t.colors.textLight,
    }));
  }

  objects.push(...makeFooter(t, 7, agentLine));

  return { version: '6.0.0', objects, background: t.colors.background };
}

// ──────────────────────────────────────
// MAIN EXPORT
// ──────────────────────────────────────

export function generateFromTemplate(
  template: BrochureTemplate,
  property: PropertyDetails,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): BrochurePage[] {
  const assignments = mapPhotosToPages(photos);
  const getPhotos = (i: number) =>
    assignments.find((a: PagePhotoAssignment) => a.pageIndex === i)?.photos || [];

  return [
    { pageNumber: 0, name: PAGE_NAMES[0], canvasJson: coverPage(template, property, getPhotos(0), genText) },
    { pageNumber: 1, name: PAGE_NAMES[1], canvasJson: overviewPage(template, property, getPhotos(1), genText) },
    { pageNumber: 2, name: PAGE_NAMES[2], canvasJson: situationPage(template, getPhotos(2), genText) },
    { pageNumber: 3, name: PAGE_NAMES[3], canvasJson: accommodation1Page(template, getPhotos(3), genText) },
    { pageNumber: 4, name: PAGE_NAMES[4], canvasJson: accommodation2Page(template, getPhotos(4), genText) },
    { pageNumber: 5, name: PAGE_NAMES[5], canvasJson: outsidePage(template, getPhotos(5), genText) },
    { pageNumber: 6, name: PAGE_NAMES[6], canvasJson: detailsPage(template, property) },
    { pageNumber: 7, name: PAGE_NAMES[7], canvasJson: locationPage(template, property, getPhotos(7)) },
  ];
}
