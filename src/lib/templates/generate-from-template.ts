/**
 * Generates 8 Fabric.js canvas pages from a BrochureTemplate.
 * Uses layout-variants for positioning and adds layout-specific
 * decorations (sidebars, frames, accent strips, overlays).
 */

import { BrochureTemplate } from './template-registry';
import { BrochurePage, PhotoAnalysis, GeneratedText } from '@/types/brochure';
import { PropertyDetails } from '@/types/property';
import { mapPhotosToPages, PagePhotoAssignment } from '@/lib/photo-mapper';
import { CANVAS, PAGE_NAMES } from '@/lib/constants';
import { getLayout, LayoutVariant } from './layout-variants';

const W = CANVAS.width;
const H = CANVAS.height;

// ──────────────────────────────────────
// Fabric.js object builders
// ──────────────────────────────────────

function text(name: string, left: number, top: number, width: number, height: number, content: string, opts: Record<string, unknown> = {}) {
  return {
    type: 'Textbox', name, left, top, width, height, text: content,
    splitByGrapheme: true, editable: true, selectable: true, evented: true,
    hasControls: true, lockMovementX: false, lockMovementY: false, ...opts,
  };
}

function rect(name: string, left: number, top: number, width: number, height: number, fill: string, selectable = false) {
  return {
    type: 'Rect', name, left, top, width, height, fill,
    selectable, evented: selectable, hasControls: selectable,
    lockMovementX: !selectable, lockMovementY: !selectable,
  };
}

function image(name: string, left: number, top: number, width: number, height: number, url: string) {
  return {
    type: 'Image', name, left, top, width, height,
    src: url, _imageUrl: url, crossOrigin: 'anonymous',
    selectable: true, evented: true, hasControls: true,
    lockMovementX: false, lockMovementY: false,
  };
}

function line(name: string, left: number, top: number, length: number, color: string, sw = 1) {
  return {
    type: 'Line', name, left, top,
    x1: 0, y1: 0, x2: length, y2: 0, stroke: color, strokeWidth: sw,
    selectable: false, evented: false, hasControls: false,
    lockMovementX: true, lockMovementY: true,
  };
}

// ──────────────────────────────────────
// Helpers
// ──────────────────────────────────────

function formatPrice(price: number, qualifier: string): string {
  const f = `£${price.toLocaleString('en-GB')}`;
  const labels: Record<string, string> = {
    guide_price: `Guide Price ${f}`, offers_over: `Offers Over ${f}`,
    offers_in_region: `Offers in the Region of ${f}`, fixed: f,
  };
  return labels[qualifier] || f;
}

function applyCase(s: string, c: string): string {
  if (c === 'uppercase') return s.toUpperCase();
  if (c === 'capitalize') return s.replace(/\b\w/g, (ch) => ch.toUpperCase());
  return s;
}

function hs(t: BrochureTemplate) {
  return { fontFamily: t.fonts.heading, fontSize: 36, fontWeight: t.style.headingWeight, fill: t.colors.headingColor, textAlign: 'left' };
}

function bs(t: BrochureTemplate) {
  return { fontFamily: t.fonts.body, fontSize: 14, lineHeight: 1.7, fill: t.colors.text };
}

function resolveFill(fill: string, t: BrochureTemplate): string {
  if (fill === '__primary__') return t.colors.primary;
  if (fill === '__background__') return t.colors.background;
  return fill;
}

// ──────────────────────────────────────
// Layout decorations - structural elements unique to each layout
// ──────────────────────────────────────

function decorations(t: BrochureTemplate, pageNum: number, pageTitle: string): { before: object[]; after: object[] } {
  const v = t.layoutVariant;
  const before: object[] = [];
  const after: object[] = [];

  if (v === 'sidebar-panel') {
    before.push(rect(`sidebar_${pageNum}`, 0, 0, 250, H, t.colors.primary));
    // Rotated section title in sidebar
    before.push({
      type: 'Textbox', name: `sidebar_title_${pageNum}`,
      left: -570, top: 600, width: 1200, height: 30,
      text: pageTitle.toUpperCase(), fontFamily: t.fonts.body,
      fontSize: 11, fill: 'rgba(255,255,255,0.5)', textAlign: 'center',
      angle: -90, selectable: false, evented: false,
      hasControls: false, lockMovementX: true, lockMovementY: true,
    });
    // Page number
    before.push(text(`sidebar_pagenum_${pageNum}`, 95, H - 60, 60, 20, `${pageNum + 1}`, {
      fontFamily: t.fonts.body, fontSize: 10, fill: 'rgba(255,255,255,0.4)', textAlign: 'center',
      selectable: false, evented: false, hasControls: false,
    }));
    // Divider line
    before.push(line(`sidebar_divider_${pageNum}`, 250, 0, 0, t.colors.accent, 2));
  }

  if (v === 'framed-gallery') {
    // Outer mat
    before.push(rect(`frame_outer_${pageNum}`, 0, 0, W, H, t.colors.backgroundAlt));
    before.push(rect(`frame_inner_${pageNum}`, 80, 80, 1594, 1080, t.colors.background));
  }

  if (v === 'horizontal-bands' && pageNum > 0) {
    // Accent strips between content sections
    after.push(rect(`accent_strip_top_${pageNum}`, 0, 500, W, 12, t.colors.accent));
    if (pageNum < 7) {
      after.push(rect(`accent_strip_mid_${pageNum}`, 0, 920, W, 12, t.colors.accent));
    }
  }

  if (v === 'horizontal-bands' && pageNum === 0) {
    // Cover accent strip between photo and text band
    after.push(rect('accent_strip_cover', 0, 900, W, 12, t.colors.accent));
  }

  if (v === 'split-screen' && pageNum > 0 && pageNum < 7) {
    // Vertical divider
    after.push(rect(`split_divider_${pageNum}`, 873, 0, 4, H, t.colors.accent));
  }

  // Standard footer/top bar for layouts that use them
  if (v !== 'full-bleed-cinematic' && v !== 'sidebar-panel' && v !== 'horizontal-bands') {
    if (t.style.topBarStyle === 'solid' && pageNum > 0) {
      before.push(rect(`top_bar_${pageNum}`, 0, 0, W, 8, t.colors.primary));
    }
    if (t.style.topBarStyle === 'thin-line' && pageNum > 0) {
      before.push(line(`top_line_${pageNum}`, 80, 8, 1594, t.colors.accent, 1));
    }
    if (t.style.footerStyle === 'solid' && pageNum > 0) {
      after.push(rect(`footer_bar_${pageNum}`, 0, H - 40, W, 40, t.colors.primary));
    }
    if (t.style.footerStyle === 'thin-line' && pageNum > 0) {
      after.push(line(`footer_line_${pageNum}`, 80, H - 30, 1594, t.colors.accent, 1));
    }
  }

  return { before, after };
}

// ──────────────────────────────────────
// Page generators
// ──────────────────────────────────────

function coverPage(t: BrochureTemplate, property: PropertyDetails, photos: PhotoAnalysis[], genText: GeneratedText): object {
  const layout = getLayout(t.layoutVariant);
  const cl = layout.cover;
  const { before, after } = decorations(t, 0, 'Cover');
  const addr = property.address;
  const price = formatPrice(property.price, property.priceQualifier);
  const objects: object[] = [...before];

  // Panel for split-screen
  if (cl.panelRect) {
    objects.push(rect('cover_panel', cl.panelRect.left, cl.panelRect.top, cl.panelRect.width, cl.panelRect.height, resolveFill(cl.panelRect.fill, t)));
  }

  // Hero
  if (photos[0]) {
    objects.push(image('cover_hero', cl.heroImage.left, cl.heroImage.top, cl.heroImage.width, cl.heroImage.height, photos[0].blobUrl));
  }

  // Overlay
  if (cl.overlayRect) {
    objects.push(rect('cover_overlay', cl.overlayRect.left, cl.overlayRect.top, cl.overlayRect.width, cl.overlayRect.height, resolveFill(cl.overlayRect.fill, t)));
  }

  const textColor = cl.textColorLight ? '#FFFFFF' : t.colors.headingColor;
  const subColor = cl.textColorLight ? 'rgba(255,255,255,0.7)' : t.colors.textLight;

  objects.push(text('cover_address', cl.addressText.left, cl.addressText.top, cl.addressText.width, cl.addressText.height || 70,
    `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}`, {
    fontFamily: t.fonts.heading, fontSize: cl.addressText.fontSize || 54,
    fontWeight: t.style.headingWeight === '300' ? '300' : '700',
    fill: textColor, textAlign: cl.addressText.align || 'center',
  }));

  if (cl.accentLine) {
    objects.push(line('cover_line', cl.accentLine.left, cl.accentLine.top, cl.accentLine.width, t.colors.accent, 2));
  }

  objects.push(text('cover_price', cl.priceLine.left, cl.priceLine.top, cl.priceLine.width, cl.priceLine.height || 40,
    price, { fontFamily: t.fonts.body, fontSize: cl.priceLine.fontSize || 28, fill: textColor, textAlign: cl.priceLine.align || 'center' }));

  if (genText.coverTagline) {
    objects.push(text('cover_tagline', cl.priceLine.left, cl.priceLine.top + 50, cl.priceLine.width, 30,
      genText.coverTagline, { fontFamily: t.fonts.body, fontSize: 16, fontStyle: 'italic', fill: subColor, textAlign: cl.priceLine.align || 'center' }));
  }

  objects.push(text('cover_city', cl.priceLine.left, cl.priceLine.top + 90, cl.priceLine.width, 30,
    `${addr.city}${addr.county ? ', ' + addr.county : ''}`, { fontFamily: t.fonts.body, fontSize: 14, fill: subColor, textAlign: cl.priceLine.align || 'center' }));

  objects.push(...after);

  const bg = t.layoutVariant === 'split-screen' ? t.colors.background
    : t.layoutVariant === 'framed-gallery' ? t.colors.backgroundAlt
    : t.layoutVariant === 'kinfolk-minimalist' ? '#FFFFFF'
    : t.colors.primary;

  return { version: '6.0.0', objects, background: bg };
}

function overviewPage(t: BrochureTemplate, property: PropertyDetails, photos: PhotoAnalysis[], genText: GeneratedText): object {
  const layout = getLayout(t.layoutVariant);
  const ol = layout.overview;
  const { before, after } = decorations(t, 1, 'Property Overview');
  const price = formatPrice(property.price, property.priceQualifier);
  const features = (genText.keyFeatures || []).map((f) => `•  ${f}`).join('\n');
  const agentLine = property.agentName ? `${property.agentName}  |  ${property.agentPhone || ''}  |  ${property.agentEmail || ''}` : '';

  // For cinematic layout, add the background overlay panel
  const objects: object[] = [...before];

  if (t.layoutVariant === 'full-bleed-cinematic' && photos[0]) {
    objects.push(image('overview_bg', 0, 0, W, H, photos[0].blobUrl));
    objects.push(rect('overview_panel', 0, 0, 600, H, 'rgba(0,0,0,0.6)'));
  }

  objects.push(
    text('overview_heading', ol.heading.left, ol.heading.top, 700, 50, applyCase('Property Overview', t.style.headingCase), hs(t)),
    line('overview_divider', ol.heading.left, ol.heading.top + 60, 600, t.colors.accent, 1),
    text('overview_price', ol.priceBlock.left, ol.priceBlock.top, ol.priceBlock.width, 35, price, { fontFamily: t.fonts.body, fontSize: 22, fontWeight: '600', fill: t.colors.accent }),
    text('overview_stats', ol.statsRow.left, ol.statsRow.top, ol.statsRow.width, 25,
      `${property.bedrooms} Bedrooms  |  ${property.bathrooms} Bathrooms  |  ${property.receptions} Receptions${property.sqft ? `  |  ${property.sqft.toLocaleString()} sq ft` : ''}`,
      { fontFamily: t.fonts.body, fontSize: 14, fill: t.colors.textLight }),
    text('overview_intro', ol.introText.left, ol.introText.top, ol.introText.width, ol.introText.height, genText.overviewIntro || '', bs(t)),
    text('overview_features', ol.features.left, ol.features.top, ol.features.width, ol.features.height, features, { ...bs(t), fontSize: 13, lineHeight: 1.8 }),
  );

  ol.photos.forEach((p, i) => {
    if (photos[i]) objects.push(image(`overview_photo_${i}`, p.left, p.top, p.width, p.height, photos[i].blobUrl));
  });

  if (agentLine) {
    objects.push(text('overview_agent', 80, H - 80, 600, 30, agentLine, { fontFamily: t.fonts.body, fontSize: 11, fill: t.colors.textLight }));
  }

  objects.push(...after);
  return { version: '6.0.0', objects, background: t.colors.background };
}

function contentPage(t: BrochureTemplate, pageNum: number, title: string, bodyText: string, photos: PhotoAnalysis[], pageKey: 'situation' | 'accom1' | 'accom2' | 'outside'): object {
  const layout = getLayout(t.layoutVariant);
  const cl = layout[pageKey];
  const { before, after } = decorations(t, pageNum, title);
  const objects: object[] = [...before];

  // For cinematic, the first photo IS the background
  if (t.layoutVariant === 'full-bleed-cinematic' && photos[0]) {
    objects.push(image(`${pageKey}_bg`, 0, 0, W, H, photos[0].blobUrl));
    // Add overlay for text area
    const textBlock = cl.textBlocks[0];
    if (textBlock) {
      objects.push(rect(`${pageKey}_overlay`, textBlock.left - 30, textBlock.top - 50, textBlock.width + 60, textBlock.height + 100, 'rgba(0,0,0,0.55)'));
    }
  }

  objects.push(text(`${pageKey}_heading`, cl.heading.left, cl.heading.top, 700, 50, applyCase(title, t.style.headingCase), hs(t)));

  cl.textBlocks.forEach((tb, i) => {
    objects.push(text(`${pageKey}_text_${i}`, tb.left, tb.top, tb.width, tb.height, i === 0 ? bodyText : '', bs(t)));
  });

  // Skip photos for cinematic (they're the background) except additional ones
  const photoStartIndex = t.layoutVariant === 'full-bleed-cinematic' ? 1 : 0;
  cl.photos.forEach((p, i) => {
    const photoIndex = i + photoStartIndex;
    if (photos[photoIndex]) {
      objects.push(image(`${pageKey}_photo_${i}`, p.left, p.top, p.width, p.height, photos[photoIndex].blobUrl));
    }
  });

  objects.push(...after);
  return { version: '6.0.0', objects, background: t.colors.background };
}

function detailsPage(t: BrochureTemplate, property: PropertyDetails): object {
  const layout = getLayout(t.layoutVariant);
  const dl = layout.details;
  const { before, after } = decorations(t, 6, 'Details');
  const tenure = property.tenure.charAt(0).toUpperCase() + property.tenure.slice(1).replace(/_/g, ' ');
  const leftDetails = [`Tenure: ${tenure}`, `Council Tax: Band ${property.councilTaxBand || 'TBC'}`, `EPC Rating: ${property.epcRating || 'TBC'}`, property.sqft ? `Approximate Size: ${property.sqft.toLocaleString()} sq ft` : ''].filter(Boolean).join('\n\n');
  const legal = 'IMPORTANT NOTICE: These particulars are for guidance only and do not form any part of any contract. The details provided should not be relied upon as statements or representations of fact. All measurements are approximate and should not be relied upon. Prospective purchasers are advised to seek their own professional advice.';

  const objects: object[] = [
    ...before,
    text('details_heading', dl.heading.left, dl.heading.top, 700, 50, applyCase('Details', t.style.headingCase), hs(t)),
    line('details_divider', dl.heading.left, dl.heading.top + 60, 600, t.colors.accent, 1),
    text('details_info', dl.leftColumn.left, dl.leftColumn.top, dl.leftColumn.width, dl.leftColumn.height, leftDetails, { ...bs(t), fontSize: 15, lineHeight: 1.8 }),
  ];

  if (dl.rightColumn) {
    objects.push(text('details_services', dl.rightColumn.left, dl.rightColumn.top, dl.rightColumn.width, dl.rightColumn.height,
      'Services\nAll mains services are connected.\n\nViewing\nStrictly by appointment through the sole agents.', { ...bs(t), fontSize: 15, lineHeight: 1.8 }));
  }

  objects.push(text('details_legal', dl.legalText.left, dl.legalText.top, dl.legalText.width, dl.legalText.height, legal, { fontFamily: t.fonts.body, fontSize: 9, lineHeight: 1.5, fill: t.colors.textLight }));
  objects.push(...after);

  return { version: '6.0.0', objects, background: t.colors.background };
}

function locationPage(t: BrochureTemplate, property: PropertyDetails, photos: PhotoAnalysis[]): object {
  const layout = getLayout(t.layoutVariant);
  const ll = layout.location;
  const { before, after } = decorations(t, 7, 'Location');
  const agentLine = property.agentName ? `${property.agentName}  |  ${property.agentPhone || ''}  |  ${property.agentEmail || ''}` : '';
  const objects: object[] = [...before];

  if (photos[0]) objects.push(image('location_hero', ll.photo.left, ll.photo.top, ll.photo.width, ll.photo.height, photos[0].blobUrl));

  if (ll.strip) objects.push(rect('location_strip', ll.strip.left, ll.strip.top, ll.strip.width, ll.strip.height, t.colors.background));

  objects.push(text('location_address', ll.addressText.left, ll.addressText.top, ll.addressText.width, 40,
    `${property.address.line1}, ${property.address.city}, ${property.address.postcode}`,
    { fontFamily: t.fonts.heading, fontSize: 22, fontWeight: '600', fill: t.colors.headingColor }));

  if (agentLine) {
    objects.push(text('location_agent', ll.agentText.left, ll.agentText.top, ll.agentText.width, 30,
      agentLine, { fontFamily: t.fonts.body, fontSize: 12, fill: t.colors.textLight }));
  }

  objects.push(...after);
  return { version: '6.0.0', objects, background: t.colors.background };
}

// ──────────────────────────────────────
// Main export
// ──────────────────────────────────────

export function generateFromTemplate(
  template: BrochureTemplate,
  property: PropertyDetails,
  photos: PhotoAnalysis[],
  genText: GeneratedText,
): BrochurePage[] {
  const assignments = mapPhotosToPages(photos);
  const getPhotos = (i: number) => assignments.find((a: PagePhotoAssignment) => a.pageIndex === i)?.photos || [];

  return [
    { pageNumber: 0, name: PAGE_NAMES[0], canvasJson: coverPage(template, property, getPhotos(0), genText) },
    { pageNumber: 1, name: PAGE_NAMES[1], canvasJson: overviewPage(template, property, getPhotos(1), genText) },
    { pageNumber: 2, name: PAGE_NAMES[2], canvasJson: contentPage(template, 2, 'The Situation', genText.situation || '', getPhotos(2), 'situation') },
    { pageNumber: 3, name: PAGE_NAMES[3], canvasJson: contentPage(template, 3, 'The Accommodation', genText.accommodation1 || '', getPhotos(3), 'accom1') },
    { pageNumber: 4, name: PAGE_NAMES[4], canvasJson: contentPage(template, 4, 'Bedrooms & Bathrooms', genText.accommodation2 || '', getPhotos(4), 'accom2') },
    { pageNumber: 5, name: PAGE_NAMES[5], canvasJson: contentPage(template, 5, 'Outside & Garden', genText.outside || '', getPhotos(5), 'outside') },
    { pageNumber: 6, name: PAGE_NAMES[6], canvasJson: detailsPage(template, property) },
    { pageNumber: 7, name: PAGE_NAMES[7], canvasJson: locationPage(template, property, getPhotos(7)) },
  ];
}
