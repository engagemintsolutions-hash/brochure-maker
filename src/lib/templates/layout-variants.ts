/**
 * Layout Variants
 *
 * Each variant defines a different spatial arrangement for pages.
 * Templates reference a layoutVariant to get distinct visual structures,
 * not just different colours on the same grid.
 */

import { CANVAS } from '@/lib/constants';

const W = CANVAS.width;
const H = CANVAS.height;
const M = CANVAS.margin;
const CW = CANVAS.contentWidth;

export type LayoutVariant =
  | 'classic'          // Standard KF-style: structured grid, clear hierarchy
  | 'magazine'         // Editorial: asymmetric columns, pull quotes
  | 'gallery'          // Image-dominant: minimal text, big photos
  | 'split'            // 50/50 splits: photo left, text right (or vice versa)
  | 'full-bleed'       // Full-bleed images with text overlays
  | 'minimal';         // Maximum whitespace, small centred content

/** Cover layout positions */
export interface CoverLayout {
  heroImage: { left: number; top: number; width: number; height: number };
  overlayRect?: { left: number; top: number; width: number; height: number; fill: string };
  addressText: { left: number; top: number; width: number; height: number; align: string; fontSize: number };
  priceLine: { left: number; top: number; width: number; height: number; align: string; fontSize: number };
  accentLine?: { left: number; top: number; width: number };
}

/** Overview layout positions */
export interface OverviewLayout {
  heading: { left: number; top: number };
  priceBlock: { left: number; top: number; width: number };
  statsRow: { left: number; top: number; width: number };
  introText: { left: number; top: number; width: number; height: number };
  features: { left: number; top: number; width: number; height: number };
  photos: Array<{ left: number; top: number; width: number; height: number }>;
}

/** Content page layout (situation, accommodation) */
export interface ContentLayout {
  heading: { left: number; top: number };
  textBlocks: Array<{ left: number; top: number; width: number; height: number }>;
  photos: Array<{ left: number; top: number; width: number; height: number }>;
}

// ──────────────────────────────────────
// COVER LAYOUTS
// ──────────────────────────────────────

export const coverLayouts: Record<LayoutVariant, CoverLayout> = {
  classic: {
    heroImage: { left: 0, top: 0, width: W, height: H },
    overlayRect: { left: 0, top: H - 340, width: W, height: 340, fill: 'rgba(0,0,0,0.55)' },
    addressText: { left: M, top: H - 280, width: CW, height: 70, align: 'center', fontSize: 54 },
    priceLine: { left: M, top: H - 175, width: CW, height: 40, align: 'center', fontSize: 28 },
    accentLine: { left: W / 2 - 227, top: H - 195, width: 454 },
  },
  magazine: {
    heroImage: { left: 0, top: 0, width: W, height: H },
    overlayRect: { left: 0, top: 0, width: 700, height: H, fill: 'rgba(0,0,0,0.65)' },
    addressText: { left: 80, top: H / 2 - 100, width: 560, height: 70, align: 'left', fontSize: 48 },
    priceLine: { left: 80, top: H / 2 + 10, width: 560, height: 40, align: 'left', fontSize: 24 },
    accentLine: { left: 80, top: H / 2 - 20, width: 120 },
  },
  gallery: {
    heroImage: { left: 0, top: 0, width: W, height: H },
    overlayRect: { left: 0, top: H - 200, width: W, height: 200, fill: 'rgba(0,0,0,0.4)' },
    addressText: { left: M, top: H - 170, width: CW, height: 60, align: 'left', fontSize: 42 },
    priceLine: { left: M, top: H - 100, width: CW, height: 35, align: 'left', fontSize: 22 },
  },
  split: {
    heroImage: { left: W / 2, top: 0, width: W / 2, height: H },
    addressText: { left: M, top: H / 2 - 80, width: W / 2 - M * 2, height: 70, align: 'left', fontSize: 44 },
    priceLine: { left: M, top: H / 2 + 20, width: W / 2 - M * 2, height: 40, align: 'left', fontSize: 24 },
    accentLine: { left: M, top: H / 2 - 10, width: 200 },
  },
  'full-bleed': {
    heroImage: { left: 0, top: 0, width: W, height: H },
    overlayRect: { left: 0, top: 0, width: W, height: H, fill: 'rgba(0,0,0,0.35)' },
    addressText: { left: M, top: H / 2 - 60, width: CW, height: 70, align: 'center', fontSize: 60 },
    priceLine: { left: M, top: H / 2 + 40, width: CW, height: 40, align: 'center', fontSize: 28 },
    accentLine: { left: W / 2 - 150, top: H / 2 + 20, width: 300 },
  },
  minimal: {
    heroImage: { left: M, top: M, width: CW, height: H - 300 },
    addressText: { left: M, top: H - 180, width: CW, height: 60, align: 'center', fontSize: 36 },
    priceLine: { left: M, top: H - 110, width: CW, height: 35, align: 'center', fontSize: 20 },
    accentLine: { left: W / 2 - 100, top: H - 130, width: 200 },
  },
};

// ──────────────────────────────────────
// OVERVIEW LAYOUTS
// ──────────────────────────────────────

export const overviewLayouts: Record<LayoutVariant, OverviewLayout> = {
  classic: {
    heading: { left: M, top: 50 },
    priceBlock: { left: M, top: 125, width: 700 },
    statsRow: { left: M, top: 170, width: 700 },
    introText: { left: M, top: 220, width: 700, height: 80 },
    features: { left: M, top: 320, width: 700, height: 300 },
    photos: [
      { left: 820, top: 50, width: 854, height: 520 },
      { left: M, top: 650, width: 780, height: 480 },
      { left: 900, top: 650, width: 780, height: 480 },
    ],
  },
  magazine: {
    heading: { left: M, top: 60 },
    priceBlock: { left: M, top: 130, width: 500 },
    statsRow: { left: M, top: 180, width: 500 },
    introText: { left: M, top: 240, width: 500, height: 120 },
    features: { left: M, top: 700, width: 700, height: 400 },
    photos: [
      { left: 620, top: 60, width: 1054, height: 580 },
      { left: M, top: 400, width: 500, height: 260 },
      { left: 900, top: 680, width: 774, height: 420 },
    ],
  },
  gallery: {
    heading: { left: M, top: 50 },
    priceBlock: { left: M, top: 120, width: CW },
    statsRow: { left: M, top: 160, width: CW },
    introText: { left: M, top: 200, width: CW, height: 60 },
    features: { left: M, top: 280, width: CW, height: 100 },
    photos: [
      { left: M, top: 400, width: 520, height: 380 },
      { left: 520 + M + 20, top: 400, width: 520, height: 380 },
      { left: 1060 + M + 20, top: 400, width: 520, height: 380 },
      { left: M, top: 810, width: 780, height: 340 },
    ],
  },
  split: {
    heading: { left: M, top: 50 },
    priceBlock: { left: M, top: 120, width: 760 },
    statsRow: { left: M, top: 165, width: 760 },
    introText: { left: M, top: 210, width: 760, height: 100 },
    features: { left: M, top: 340, width: 760, height: 350 },
    photos: [
      { left: 900, top: 50, width: 774, height: 560 },
      { left: 900, top: 640, width: 774, height: 480 },
    ],
  },
  'full-bleed': {
    heading: { left: M, top: 50 },
    priceBlock: { left: M, top: 120, width: 600 },
    statsRow: { left: M, top: 165, width: 600 },
    introText: { left: M, top: 210, width: 600, height: 100 },
    features: { left: M, top: 340, width: 600, height: 300 },
    photos: [
      { left: 740, top: 50, width: 934, height: 700 },
      { left: M, top: 700, width: CW, height: 400 },
    ],
  },
  minimal: {
    heading: { left: W / 2 - 350, top: 80 },
    priceBlock: { left: W / 2 - 350, top: 150, width: 700 },
    statsRow: { left: W / 2 - 350, top: 195, width: 700 },
    introText: { left: W / 2 - 350, top: 240, width: 700, height: 80 },
    features: { left: W / 2 - 350, top: 340, width: 700, height: 250 },
    photos: [
      { left: M, top: 620, width: 530, height: 480 },
      { left: 530 + M + 20, top: 620, width: 530, height: 480 },
      { left: 1060 + M + 20, top: 620, width: 530, height: 480 },
    ],
  },
};

// ──────────────────────────────────────
// CONTENT PAGE LAYOUTS (situation, accommodation)
// ──────────────────────────────────────

export const contentLayouts: Record<LayoutVariant, ContentLayout> = {
  classic: {
    heading: { left: M, top: 50 },
    textBlocks: [{ left: M, top: 140, width: 760, height: H - 240 }],
    photos: [{ left: 900, top: 50, width: 774, height: H - 140 }],
  },
  magazine: {
    heading: { left: M, top: 60 },
    textBlocks: [
      { left: M, top: 140, width: 500, height: 400 },
      { left: M, top: 700, width: CW, height: 250 },
    ],
    photos: [
      { left: 620, top: 60, width: 1054, height: 580 },
    ],
  },
  gallery: {
    heading: { left: M, top: 50 },
    textBlocks: [{ left: M, top: 120, width: CW, height: 200 }],
    photos: [
      { left: M, top: 350, width: 780, height: 500 },
      { left: 900, top: 350, width: 774, height: 500 },
      { left: M, top: 880, width: CW, height: 260 },
    ],
  },
  split: {
    heading: { left: M, top: 50 },
    textBlocks: [{ left: M, top: 140, width: 760, height: H - 240 }],
    photos: [{ left: 900, top: 50, width: 774, height: H - 140 }],
  },
  'full-bleed': {
    heading: { left: M, top: 50 },
    textBlocks: [{ left: M, top: 550, width: CW, height: 400 }],
    photos: [{ left: 0, top: 100, width: W, height: 420 }],
  },
  minimal: {
    heading: { left: W / 2 - 350, top: 60 },
    textBlocks: [{ left: W / 2 - 350, top: 140, width: 700, height: 400 }],
    photos: [{ left: M, top: 580, width: CW, height: 520 }],
  },
};

// ──────────────────────────────────────
// ACCOMMODATION LAYOUTS (photos + text mix)
// ──────────────────────────────────────

export const accommodationLayouts: Record<LayoutVariant, ContentLayout> = {
  classic: {
    heading: { left: M, top: 50 },
    textBlocks: [{ left: M, top: 670, width: 760, height: 400 }],
    photos: [
      { left: M, top: 120, width: CW, height: 520 },
      { left: 900, top: 670, width: 774, height: 420 },
    ],
  },
  magazine: {
    heading: { left: M, top: 60 },
    textBlocks: [{ left: M, top: 500, width: 560, height: 400 }],
    photos: [
      { left: 620, top: 60, width: 1054, height: 420 },
      { left: M, top: 130, width: 500, height: 340 },
      { left: 620, top: 520, width: 1054, height: 400 },
    ],
  },
  gallery: {
    heading: { left: M, top: 50 },
    textBlocks: [{ left: M, top: 880, width: CW, height: 240 }],
    photos: [
      { left: M, top: 120, width: 530, height: 360 },
      { left: 530 + M + 20, top: 120, width: 530, height: 360 },
      { left: 1060 + M + 20, top: 120, width: 530, height: 360 },
      { left: M, top: 510, width: 800, height: 340 },
      { left: 820 + M, top: 510, width: 774, height: 340 },
    ],
  },
  split: {
    heading: { left: M, top: 50 },
    textBlocks: [{ left: 900, top: 140, width: 774, height: 500 }],
    photos: [
      { left: M, top: 120, width: 780, height: 520 },
      { left: M, top: 680, width: 780, height: 420 },
      { left: 900, top: 680, width: 774, height: 420 },
    ],
  },
  'full-bleed': {
    heading: { left: M, top: 50 },
    textBlocks: [{ left: M, top: 600, width: CW, height: 300 }],
    photos: [
      { left: 0, top: 100, width: W, height: 480 },
      { left: M, top: 930, width: 780, height: 220 },
      { left: 900, top: 930, width: 774, height: 220 },
    ],
  },
  minimal: {
    heading: { left: W / 2 - 350, top: 60 },
    textBlocks: [{ left: W / 2 - 350, top: 140, width: 700, height: 200 }],
    photos: [
      { left: M, top: 380, width: 780, height: 460 },
      { left: 900, top: 380, width: 774, height: 460 },
      { left: M, top: 870, width: CW, height: 260 },
    ],
  },
};
