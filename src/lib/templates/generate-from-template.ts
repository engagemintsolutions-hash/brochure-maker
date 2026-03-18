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
  const objects: object[] = [];

  // Hero image
  if (hero) objects.push(image('cover_hero', 0, 0, W, H, hero.blobUrl));

  // Overlay
  if (t.style.coverOverlay === 'dark') {
    objects.push(rect('cover_overlay', 0, H - 340, W, 340, 'rgba(0,0,0,0.55)'));
  } else if (t.style.coverOverlay === 'gradient-bottom') {
    objects.push(rect('cover_overlay', 0, H - 400, W, 400, 'rgba(0,0,0,0.45)'));
  } else if (t.style.coverOverlay === 'light') {
    objects.push(rect('cover_overlay', 0, H - 340, W, 340, 'rgba(255,255,255,0.75)'));
  }

  const isLight = t.style.coverOverlay === 'light';
  const textColor = isLight ? t.colors.headingColor : '#FFFFFF';
  const subColor = isLight ? t.colors.textLight : 'rgba(255,255,255,0.8)';

  // Text positioning based on template style
  let textTop = H - 280;
  let textAlign = 'center';
  let textLeft = M;

  if (t.style.coverTextPosition === 'bottom-left') {
    textAlign = 'left';
  } else if (t.style.coverTextPosition === 'top-left') {
    textTop = 80;
    textAlign = 'left';
  } else if (t.style.coverTextPosition === 'center') {
    textTop = H / 2 - 60;
  }

  // Address
  objects.push(
    text('cover_address', textLeft, textTop, CW, 70, `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}`, {
      fontFamily: t.fonts.heading,
      fontSize: 54,
      fontWeight: t.style.headingWeight === '300' ? '300' : '700',
      fill: textColor,
      textAlign,
    }),
  );

  // Accent line
  if (textAlign === 'center') {
    objects.push(line('cover_line', W / 2 - 227, textTop + 85, 454, t.colors.accent, 2));
  } else {
    objects.push(line('cover_line', textLeft, textTop + 85, 300, t.colors.accent, 2));
  }

  // Price
  objects.push(
    text('cover_price', textLeft, textTop + 100, CW, 40, price, {
      fontFamily: t.fonts.body,
      fontSize: 28,
      fill: textColor,
      textAlign,
    }),
  );

  // Tagline
  if (genText.coverTagline) {
    objects.push(
      text('cover_tagline', textLeft, textTop + 150, CW, 30, genText.coverTagline, {
        fontFamily: t.fonts.body,
        fontSize: 16,
        fontStyle: 'italic',
        fill: subColor,
        textAlign,
      }),
    );
  }

  // City
  objects.push(
    text('cover_city', textLeft, textTop + 190, CW, 30, `${addr.city}${addr.county ? ', ' + addr.county : ''}`, {
      fontFamily: t.fonts.body,
      fontSize: 14,
      fill: subColor,
      textAlign,
    }),
  );

  return {
    version: '6.0.0',
    objects,
    background: t.colors.primary,
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

  const objects: object[] = [
    ...makeTopBar(t, 1),
    text('overview_heading', M, 50, 700, 50, applyCase('Property Overview', t.style.headingCase), headingStyle(t)),
    line('overview_divider', M, 110, 600, t.colors.accent, 1),
    text('overview_price', M, 125, 700, 35, price, {
      fontFamily: t.fonts.body, fontSize: 22, fontWeight: '600', fill: t.colors.accent,
    }),
    text('overview_stats', M, 170, 700, 25, `${property.bedrooms} Bedrooms  |  ${property.bathrooms} Bathrooms  |  ${property.receptions} Receptions${property.sqft ? `  |  ${property.sqft.toLocaleString()} sq ft` : ''}`, {
      fontFamily: t.fonts.body, fontSize: 14, fill: t.colors.textLight,
    }),
    text('overview_intro', M, 220, 700, 80, genText.overviewIntro || '', bodyStyle(t)),
    text('overview_features', M, 320, 700, 300, features, {
      ...bodyStyle(t), fontSize: 13, lineHeight: 1.8,
    }),
  ];

  // Photos
  if (photos[0]) objects.push(image('overview_photo_main', 820, 50, 854, 520, photos[0].blobUrl));
  if (photos[1]) objects.push(image('overview_photo_2', M, 650, 780, 480, photos[1].blobUrl));
  if (photos[2]) objects.push(image('overview_photo_3', 900, 650, 780, 480, photos[2].blobUrl));

  // Agent
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
  const objects: object[] = [
    ...makeTopBar(t, 2),
    text('situation_heading', M, 50, 700, 50, applyCase('The Situation', t.style.headingCase), headingStyle(t)),
    line('situation_divider', M, 110, 600, t.colors.accent, 1),
    text('situation_text', M, 140, 760, H - 240, genText.situation || '', bodyStyle(t)),
  ];

  if (photos[0]) objects.push(image('situation_photo', 900, 50, 774, H - 140, photos[0].blobUrl));

  objects.push(...makeFooter(t, 2));
  return { version: '6.0.0', objects, background: t.colors.background };
}

function accommodation1Page(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const objects: object[] = [
    ...makeTopBar(t, 3),
    text('accom1_heading', M, 50, 700, 50, applyCase('The Accommodation', t.style.headingCase), headingStyle(t)),
  ];

  if (photos[0]) objects.push(image('accom1_hero', M, 120, CW, 520, photos[0].blobUrl));

  objects.push(text('accom1_text', M, 670, 760, 400, genText.accommodation1 || '', bodyStyle(t)));

  if (photos[1]) objects.push(image('accom1_photo2', 900, 670, 774, 420, photos[1].blobUrl));

  objects.push(...makeFooter(t, 3));
  return { version: '6.0.0', objects, background: t.colors.background };
}

function accommodation2Page(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const objects: object[] = [
    ...makeTopBar(t, 4),
    text('accom2_heading', M, 50, 700, 50, applyCase('Bedrooms & Bathrooms', t.style.headingCase), headingStyle(t)),
  ];

  if (photos[0]) objects.push(image('accom2_photo1', M, 120, 820, 500, photos[0].blobUrl));
  if (photos[1]) objects.push(image('accom2_photo2', 940, 120, 734, 500, photos[1].blobUrl));

  objects.push(text('accom2_text', M, 660, CW, 350, genText.accommodation2 || '', bodyStyle(t)));

  if (photos[2]) objects.push(image('accom2_photo3', M, 900, 500, 240, photos[2].blobUrl));
  if (photos[3]) objects.push(image('accom2_photo4', 620, 900, 500, 240, photos[3].blobUrl));

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
