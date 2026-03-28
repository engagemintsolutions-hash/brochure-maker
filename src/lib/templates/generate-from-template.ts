/**
 * Generates 8 Fabric.js canvas pages from a BrochureTemplate + property data.
 * This replaces the knight-frank.ts hardcoded template with a dynamic system
 * that uses any template from the registry.
 */

import { BrochureTemplate } from './template-registry';
import { BrochurePage, PhotoAnalysis, GeneratedText } from '@/types/brochure';
import { PropertyDetails } from '@/types/property';
import { mapPhotosToPages, PagePhotoAssignment } from '@/lib/photo-mapper';
import { CANVAS, PAGE_NAMES } from '@/lib/constants';

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

// ──────────────────────────────────────
// IMAGE FRAME SUPPORT
// ──────────────────────────────────────

function imageWithFrame(
  t: BrochureTemplate,
  name: string,
  left: number,
  top: number,
  width: number,
  height: number,
  url: string,
): object[] {
  const elements: object[] = [];
  const style = t.style.imageFrameStyle;

  if (style === 'thin-border') {
    elements.push(
      rect(`${name}_frame`, left - 1, top - 1, width + 2, height + 2, 'transparent', {
        stroke: t.colors.accent,
        strokeWidth: 1,
      }),
    );
  } else if (style === 'shadow') {
    elements.push(
      rect(`${name}_shadow`, left + 4, top + 4, width, height, 'rgba(0,0,0,0.12)'),
    );
  }

  elements.push(image(name, left, top, width, height, url));
  return elements;
}

// ──────────────────────────────────────
// DIVIDER SUPPORT
// ──────────────────────────────────────

function makeDivider(
  t: BrochureTemplate,
  name: string,
  left: number,
  top: number,
  length: number,
): object[] {
  const style = t.style.dividerStyle;

  if (style === 'none') return [];

  if (style === 'accent-block') {
    return [rect(name, left, top - 2, 60, 4, t.colors.accent)];
  }

  if (style === 'dotted') {
    const dots: object[] = [];
    const dotSize = 3;
    const gap = 10;
    const count = Math.min(Math.floor(length / gap), 40);
    for (let i = 0; i < count; i++) {
      dots.push(
        rect(`${name}_dot_${i}`, left + i * gap, top, dotSize, dotSize, t.colors.accent, {
          rx: 1.5,
          ry: 1.5,
        }),
      );
    }
    return dots;
  }

  // Default: line
  return [line(name, left, top, length, t.colors.accent, 1)];
}

// ──────────────────────────────────────
// FOOTER / TOP BAR / HEADING HELPERS
// ──────────────────────────────────────

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
  const textLeft = M;

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

// ──────────────────────────────────────
// OVERVIEW PAGE — 3 layout variants
// ──────────────────────────────────────

function overviewPage(
  t: BrochureTemplate,
  property: PropertyDetails,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const variant = t.style.layoutVariant;
  if (variant === 'B') return overviewPageB(t, property, photos, genText);
  if (variant === 'C') return overviewPageC(t, property, photos, genText);
  return overviewPageA(t, property, photos, genText);
}

// Variant A: Classic left-text, right-photo layout (original)
function overviewPageA(
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
    ...makeDivider(t, 'overview_divider', M, 110, 600),
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

  if (photos[0]) objects.push(...imageWithFrame(t, 'overview_photo_main', 820, 50, 854, 520, photos[0].blobUrl));
  if (photos[1]) objects.push(...imageWithFrame(t, 'overview_photo_2', M, 650, 780, 480, photos[1].blobUrl));
  if (photos[2]) objects.push(...imageWithFrame(t, 'overview_photo_3', 900, 650, 780, 480, photos[2].blobUrl));

  if (agentLine) {
    objects.push(text('overview_agent', M, H - 80, 600, 30, agentLine, {
      fontFamily: t.fonts.body, fontSize: 11, fill: t.colors.textLight,
    }));
  }

  objects.push(...makeFooter(t, 1, agentLine));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// Variant B: Full-width hero at top, text and features below in two columns
function overviewPageB(
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
  ];

  // Full-width hero image at top
  if (photos[0]) objects.push(...imageWithFrame(t, 'overview_photo_main', M, 20, CW, 540, photos[0].blobUrl));

  // Two-column text section below
  objects.push(
    text('overview_heading', M, 590, 700, 50, applyCase('Property Overview', t.style.headingCase), headingStyle(t)),
    ...makeDivider(t, 'overview_divider', M, 645, 600),
    text('overview_price', M, 660, 700, 35, price, {
      fontFamily: t.fonts.body, fontSize: 22, fontWeight: '600', fill: t.colors.accent,
    }),
    text('overview_stats', M, 705, 700, 25, `${property.bedrooms} Bedrooms  |  ${property.bathrooms} Bathrooms  |  ${property.receptions} Receptions${property.sqft ? `  |  ${property.sqft.toLocaleString()} sq ft` : ''}`, {
      fontFamily: t.fonts.body, fontSize: 14, fill: t.colors.textLight,
    }),
    // Left column: intro
    text('overview_intro', M, 750, 740, 160, genText.overviewIntro || '', bodyStyle(t)),
    // Right column: features
    text('overview_features', 880, 750, 740, 360, features, {
      ...bodyStyle(t), fontSize: 13, lineHeight: 1.8,
    }),
  );

  // Two smaller photos at bottom
  if (photos[1]) objects.push(...imageWithFrame(t, 'overview_photo_2', M, 940, 760, 200, photos[1].blobUrl));
  if (photos[2]) objects.push(...imageWithFrame(t, 'overview_photo_3', 880, 940, 760, 200, photos[2].blobUrl));

  if (agentLine) {
    objects.push(text('overview_agent', M, H - 80, 600, 30, agentLine, {
      fontFamily: t.fonts.body, fontSize: 11, fill: t.colors.textLight,
    }));
  }

  objects.push(...makeFooter(t, 1, agentLine));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// Variant C: Side-by-side split — left panel with coloured background, right with large photo
function overviewPageC(
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

  const splitX = 700;
  const objects: object[] = [
    ...makeTopBar(t, 1),
    // Coloured left panel
    rect('overview_panel_bg', 0, 8, splitX, H - 8, t.colors.backgroundAlt),
    text('overview_heading', M, 60, splitX - M * 2, 50, applyCase('Property Overview', t.style.headingCase), headingStyle(t)),
    ...makeDivider(t, 'overview_divider', M, 120, splitX - M * 2),
    text('overview_price', M, 140, splitX - M * 2, 35, price, {
      fontFamily: t.fonts.body, fontSize: 22, fontWeight: '600', fill: t.colors.accent,
    }),
    text('overview_stats', M, 185, splitX - M * 2, 25, `${property.bedrooms} Beds  |  ${property.bathrooms} Baths  |  ${property.receptions} Receps${property.sqft ? `  |  ${property.sqft.toLocaleString()} sqft` : ''}`, {
      fontFamily: t.fonts.body, fontSize: 13, fill: t.colors.textLight,
    }),
    text('overview_intro', M, 235, splitX - M * 2, 120, genText.overviewIntro || '', bodyStyle(t)),
    text('overview_features', M, 380, splitX - M * 2, 400, features, {
      ...bodyStyle(t), fontSize: 13, lineHeight: 1.8,
    }),
  ];

  // Large right photo
  if (photos[0]) objects.push(...imageWithFrame(t, 'overview_photo_main', splitX, 8, W - splitX, 740, photos[0].blobUrl));

  // Two bottom photos spanning full width
  if (photos[1]) objects.push(...imageWithFrame(t, 'overview_photo_2', M, 820, 760, 320, photos[1].blobUrl));
  if (photos[2]) objects.push(...imageWithFrame(t, 'overview_photo_3', 880, 820, 760, 320, photos[2].blobUrl));

  if (agentLine) {
    objects.push(text('overview_agent', M, H - 80, 600, 30, agentLine, {
      fontFamily: t.fonts.body, fontSize: 11, fill: t.colors.textLight,
    }));
  }

  objects.push(...makeFooter(t, 1, agentLine));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// ──────────────────────────────────────
// SITUATION PAGE — 3 layout variants
// ──────────────────────────────────────

function situationPage(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const variant = t.style.layoutVariant;
  if (variant === 'B') return situationPageB(t, photos, genText);
  if (variant === 'C') return situationPageC(t, photos, genText);
  return situationPageA(t, photos, genText);
}

// Variant A: Text left, tall photo right (original)
function situationPageA(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const objects: object[] = [
    ...makeTopBar(t, 2),
    text('situation_heading', M, 50, 700, 50, applyCase('The Situation', t.style.headingCase), headingStyle(t)),
    ...makeDivider(t, 'situation_divider', M, 110, 600),
    text('situation_text', M, 140, 760, H - 240, genText.situation || '', bodyStyle(t)),
  ];

  if (photos[0]) objects.push(...imageWithFrame(t, 'situation_photo', 900, 50, 774, H - 140, photos[0].blobUrl));

  objects.push(...makeFooter(t, 2));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// Variant B: Full-width photo top, text below spanning width
function situationPageB(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const objects: object[] = [
    ...makeTopBar(t, 2),
  ];

  if (photos[0]) objects.push(...imageWithFrame(t, 'situation_photo', 0, 0, W, 680, photos[0].blobUrl));

  objects.push(
    rect('situation_text_bg', 0, 680, W, H - 680, t.colors.background),
    text('situation_heading', M, 710, 700, 50, applyCase('The Situation', t.style.headingCase), headingStyle(t)),
    ...makeDivider(t, 'situation_divider', M, 765, 400),
    text('situation_text', M, 790, CW, H - 870, genText.situation || '', bodyStyle(t)),
    ...makeFooter(t, 2),
  );

  return { version: '6.0.0', objects, background: t.colors.background };
}

// Variant C: Two-column text with photo inset right
function situationPageC(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const situationText = genText.situation || '';
  const midpoint = Math.floor(situationText.length / 2);
  const splitAt = situationText.indexOf('. ', midpoint);
  const col1 = splitAt > 0 ? situationText.slice(0, splitAt + 1) : situationText;
  const col2 = splitAt > 0 ? situationText.slice(splitAt + 2) : '';

  const objects: object[] = [
    ...makeTopBar(t, 2),
    text('situation_heading', M, 50, CW, 50, applyCase('The Situation', t.style.headingCase), {
      ...headingStyle(t), textAlign: 'left',
    }),
    ...makeDivider(t, 'situation_divider', M, 110, CW),
    // Two text columns
    text('situation_text', M, 140, 740, 500, col1, bodyStyle(t)),
    text('situation_text_2', 880, 140, 740, 500, col2, bodyStyle(t)),
  ];

  // Wide photo at bottom
  if (photos[0]) objects.push(...imageWithFrame(t, 'situation_photo', M, 680, CW, 460, photos[0].blobUrl));

  objects.push(...makeFooter(t, 2));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// ──────────────────────────────────────
// ACCOMMODATION PAGE 1 — 3 layout variants
// ──────────────────────────────────────

function accommodation1Page(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const variant = t.style.layoutVariant;
  if (variant === 'B') return accommodation1PageB(t, photos, genText);
  if (variant === 'C') return accommodation1PageC(t, photos, genText);
  return accommodation1PageA(t, photos, genText);
}

// Variant A: Hero top, text + photo bottom (original)
function accommodation1PageA(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const objects: object[] = [
    ...makeTopBar(t, 3),
    text('accom1_heading', M, 50, 700, 50, applyCase('The Accommodation', t.style.headingCase), headingStyle(t)),
  ];

  if (photos[0]) objects.push(...imageWithFrame(t, 'accom1_hero', M, 120, CW, 520, photos[0].blobUrl));

  objects.push(text('accom1_text', M, 670, 760, 400, genText.accommodation1 || '', bodyStyle(t)));

  if (photos[1]) objects.push(...imageWithFrame(t, 'accom1_photo2', 900, 670, 774, 420, photos[1].blobUrl));

  objects.push(...makeFooter(t, 3));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// Variant B: Two equal photos top, full-width text bottom
function accommodation1PageB(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const gap = 20;
  const photoW = (CW - gap) / 2;

  const objects: object[] = [
    ...makeTopBar(t, 3),
    text('accom1_heading', M, 50, 700, 50, applyCase('The Accommodation', t.style.headingCase), headingStyle(t)),
    ...makeDivider(t, 'accom1_divider', M, 110, 400),
  ];

  if (photos[0]) objects.push(...imageWithFrame(t, 'accom1_hero', M, 130, photoW, 520, photos[0].blobUrl));
  if (photos[1]) objects.push(...imageWithFrame(t, 'accom1_photo2', M + photoW + gap, 130, photoW, 520, photos[1].blobUrl));

  objects.push(text('accom1_text', M, 680, CW, 400, genText.accommodation1 || '', bodyStyle(t)));

  objects.push(...makeFooter(t, 3));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// Variant C: Large photo left, text right with coloured panel
function accommodation1PageC(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const photoW = 900;

  const objects: object[] = [
    ...makeTopBar(t, 3),
    // Coloured right panel
    rect('accom1_panel_bg', photoW, 8, W - photoW, H - 8, t.colors.backgroundAlt),
  ];

  if (photos[0]) objects.push(...imageWithFrame(t, 'accom1_hero', 0, 8, photoW, H - 48, photos[0].blobUrl));

  objects.push(
    text('accom1_heading', photoW + 40, 50, W - photoW - 80, 50, applyCase('The Accommodation', t.style.headingCase), headingStyle(t)),
    ...makeDivider(t, 'accom1_divider', photoW + 40, 110, W - photoW - 120),
    text('accom1_text', photoW + 40, 140, W - photoW - 80, 600, genText.accommodation1 || '', bodyStyle(t)),
  );

  if (photos[1]) objects.push(...imageWithFrame(t, 'accom1_photo2', photoW + 40, 780, W - photoW - 80, 340, photos[1].blobUrl));

  objects.push(...makeFooter(t, 3));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// ──────────────────────────────────────
// ACCOMMODATION PAGE 2 — 3 layout variants
// ──────────────────────────────────────

function accommodation2Page(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const variant = t.style.layoutVariant;
  if (variant === 'B') return accommodation2PageB(t, photos, genText);
  if (variant === 'C') return accommodation2PageC(t, photos, genText);
  return accommodation2PageA(t, photos, genText);
}

// Variant A: 2x2 grid top, text middle, 2 small bottom (original)
function accommodation2PageA(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const objects: object[] = [
    ...makeTopBar(t, 4),
    text('accom2_heading', M, 50, 700, 50, applyCase('Bedrooms & Bathrooms', t.style.headingCase), headingStyle(t)),
  ];

  if (photos[0]) objects.push(...imageWithFrame(t, 'accom2_photo1', M, 120, 820, 500, photos[0].blobUrl));
  if (photos[1]) objects.push(...imageWithFrame(t, 'accom2_photo2', 940, 120, 734, 500, photos[1].blobUrl));

  objects.push(text('accom2_text', M, 660, CW, 350, genText.accommodation2 || '', bodyStyle(t)));

  if (photos[2]) objects.push(...imageWithFrame(t, 'accom2_photo3', M, 900, 500, 240, photos[2].blobUrl));
  if (photos[3]) objects.push(...imageWithFrame(t, 'accom2_photo4', 620, 900, 500, 240, photos[3].blobUrl));

  objects.push(...makeFooter(t, 4));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// Variant B: Mosaic grid — 1 large + 2 stacked right, text below
function accommodation2PageB(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const gap = 16;
  const largeW = 1000;
  const smallW = CW - largeW - gap;
  const smallH = (640 - gap) / 2;

  const objects: object[] = [
    ...makeTopBar(t, 4),
    text('accom2_heading', M, 50, 700, 50, applyCase('Bedrooms & Bathrooms', t.style.headingCase), headingStyle(t)),
    ...makeDivider(t, 'accom2_divider', M, 110, 400),
  ];

  if (photos[0]) objects.push(...imageWithFrame(t, 'accom2_photo1', M, 130, largeW, 640, photos[0].blobUrl));
  if (photos[1]) objects.push(...imageWithFrame(t, 'accom2_photo2', M + largeW + gap, 130, smallW, smallH, photos[1].blobUrl));
  if (photos[2]) objects.push(...imageWithFrame(t, 'accom2_photo3', M + largeW + gap, 130 + smallH + gap, smallW, smallH, photos[2].blobUrl));

  objects.push(text('accom2_text', M, 800, CW, 300, genText.accommodation2 || '', bodyStyle(t)));

  if (photos[3]) objects.push(...imageWithFrame(t, 'accom2_photo4', M, 1020, CW, 120, photos[3].blobUrl));

  objects.push(...makeFooter(t, 4));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// Variant C: Three equal columns of photos at top, text spans full width below
function accommodation2PageC(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const gap = 20;
  const colW = (CW - gap * 2) / 3;

  const objects: object[] = [
    ...makeTopBar(t, 4),
    text('accom2_heading', M, 50, 700, 50, applyCase('Bedrooms & Bathrooms', t.style.headingCase), headingStyle(t)),
  ];

  if (photos[0]) objects.push(...imageWithFrame(t, 'accom2_photo1', M, 120, colW, 540, photos[0].blobUrl));
  if (photos[1]) objects.push(...imageWithFrame(t, 'accom2_photo2', M + colW + gap, 120, colW, 540, photos[1].blobUrl));
  if (photos[2]) objects.push(...imageWithFrame(t, 'accom2_photo3', M + (colW + gap) * 2, 120, colW, 540, photos[2].blobUrl));

  objects.push(text('accom2_text', M, 700, CW, 350, genText.accommodation2 || '', bodyStyle(t)));

  if (photos[3]) objects.push(...imageWithFrame(t, 'accom2_photo4', M, 960, CW, 180, photos[3].blobUrl));

  objects.push(...makeFooter(t, 4));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// ──────────────────────────────────────
// OUTSIDE PAGE — 3 layout variants
// ──────────────────────────────────────

function outsidePage(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const variant = t.style.layoutVariant;
  if (variant === 'B') return outsidePageB(t, photos, genText);
  if (variant === 'C') return outsidePageC(t, photos, genText);
  return outsidePageA(t, photos, genText);
}

// Variant A: Full-width hero top, text below (original)
function outsidePageA(
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

// Variant B: Photo right side, text left with heading at top
function outsidePageB(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const textW = 680;
  const objects: object[] = [
    ...makeTopBar(t, 5),
    text('outside_heading', M, 50, textW - M, 50, applyCase('Outside & Garden', t.style.headingCase), headingStyle(t)),
    ...makeDivider(t, 'outside_divider', M, 110, 400),
    text('outside_text', M, 140, textW - M, H - 240, genText.outside || '', bodyStyle(t)),
  ];

  if (photos[0]) objects.push(...imageWithFrame(t, 'outside_hero', textW, 20, W - textW, H - 80, photos[0].blobUrl));

  objects.push(...makeFooter(t, 5));
  return { version: '6.0.0', objects, background: t.colors.background };
}

// Variant C: Full-bleed photo with text overlay at bottom
function outsidePageC(
  t: BrochureTemplate,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): object {
  const objects: object[] = [];

  if (photos[0]) objects.push(image('outside_hero', 0, 0, W, H, photos[0].blobUrl));

  objects.push(
    rect('outside_overlay', 0, H - 360, W, 360, 'rgba(0,0,0,0.5)'),
    text('outside_heading', M, H - 330, 700, 50, applyCase('Outside & Garden', t.style.headingCase), {
      ...headingStyle(t), fontSize: 32, fill: '#FFFFFF',
    }),
    text('outside_text', M, H - 270, CW, 200, genText.outside || '', {
      ...bodyStyle(t), fill: 'rgba(255,255,255,0.9)',
    }),
    ...makeFooter(t, 5),
  );

  return { version: '6.0.0', objects, background: t.colors.background };
}

// ──────────────────────────────────────
// DETAILS & LOCATION (no variants needed — these are data pages)
// ──────────────────────────────────────

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
    ...makeDivider(t, 'details_divider', M, 110, 600),
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
