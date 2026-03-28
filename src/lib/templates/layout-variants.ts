/**
 * 8 fundamentally different layout structures for property brochures.
 * Each defines exact pixel positions for all 8 page types.
 * Canvas: 1754x1240px (A4 landscape at 150 DPI).
 */

export type LayoutVariant =
  | 'full-bleed-cinematic'
  | 'swiss-grid'
  | 'kinfolk-minimalist'
  | 'split-screen'
  | 'editorial-magazine'
  | 'horizontal-bands'
  | 'framed-gallery'
  | 'sidebar-panel'
  | 'dark-luxury'
  | 'photo-mosaic'
  | 'classic-two-column'
  | 'panoramic-strip'
  | 'card-stack'
  | 'corner-accent'
  | 'savills-structured'
  | 'hamptons-warm'
  | 'sothebys-auction'
  | 'foxtons-bold'
  | 'country-estate'
  | 'townhouse-narrow'
  | 'penthouse-dramatic'
  | 'cottage-rustic'
  | 'new-build-clean'
  | 'art-deco'
  | 'scandinavian-light'
  | 'brutalist-raw'
  | 'japanese-zen'
  | 'coastal-breezy'
  | 'victorian-heritage'
  | 'loft-industrial';

// ──────────────────────────────────────
// Shared position types
// ──────────────────────────────────────

export interface Pos { left: number; top: number; width: number; height: number }
export interface TextPos { left: number; top: number; width: number; height?: number; align?: string; fontSize?: number }

export interface CoverLayout {
  heroImage: Pos;
  overlayRect?: Pos & { fill: string };
  panelRect?: Pos & { fill: string }; // for split-screen coloured panel
  addressText: TextPos;
  priceLine: TextPos;
  accentLine?: { left: number; top: number; width: number };
  textColorLight: boolean; // true = white text on dark, false = dark text on light
}

export interface OverviewLayout {
  heading: { left: number; top: number };
  priceBlock: TextPos;
  statsRow: TextPos;
  introText: Pos;
  features: Pos;
  photos: Pos[];
}

export interface ContentLayout {
  heading: { left: number; top: number };
  textBlocks: Pos[];
  photos: Pos[];
}

export interface DetailsLayout {
  heading: { left: number; top: number };
  leftColumn: Pos;
  rightColumn?: Pos;
  legalText: Pos;
}

export interface LocationLayout {
  photo: Pos;
  strip?: Pos;
  addressText: TextPos;
  agentText: TextPos;
}

// ──────────────────────────────────────
// 1. FULL-BLEED CINEMATIC
// Every page = full photo + overlay text panel
// ──────────────────────────────────────

const cinematic = {
  cover: {
    heroImage: { left: 0, top: 0, width: 1754, height: 1240 },
    overlayRect: { left: 0, top: 850, width: 1754, height: 390, fill: 'rgba(0,0,0,0.6)' },
    addressText: { left: 250, top: 910, width: 1254, height: 70, align: 'center', fontSize: 52 },
    priceLine: { left: 250, top: 1020, width: 1254, height: 40, align: 'center', fontSize: 26 },
    accentLine: { left: 727, top: 995, width: 300 },
    textColorLight: true,
  } as CoverLayout,
  overview: {
    heading: { left: 50, top: 60 },
    priceBlock: { left: 50, top: 140, width: 520 },
    statsRow: { left: 50, top: 185, width: 520 },
    introText: { left: 50, top: 240, width: 520, height: 200 },
    features: { left: 50, top: 470, width: 520, height: 400 },
    photos: [{ left: 650, top: 50, width: 1054, height: 580 }, { left: 650, top: 660, width: 1054, height: 530 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 1234, top: 60 },
    textBlocks: [{ left: 1234, top: 150, width: 470, height: 1000 }],
    photos: [{ left: 0, top: 0, width: 1200, height: 1240 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 50, top: 780 },
    textBlocks: [{ left: 50, top: 860, width: 520, height: 340 }],
    photos: [{ left: 0, top: 0, width: 1754, height: 1240 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 1184, top: 50 },
    textBlocks: [{ left: 1184, top: 130, width: 520, height: 530 }],
    photos: [{ left: 0, top: 0, width: 1150, height: 1240 }],
  } as ContentLayout,
  outside: {
    heading: { left: 50, top: 50 },
    textBlocks: [{ left: 50, top: 130, width: 460, height: 330 }],
    photos: [{ left: 0, top: 0, width: 1754, height: 1240 }],
  } as ContentLayout,
  details: {
    heading: { left: 80, top: 60 },
    leftColumn: { left: 80, top: 150, width: 760, height: 600 },
    rightColumn: { left: 920, top: 150, width: 754, height: 400 },
    legalText: { left: 80, top: 1040, width: 1594, height: 120 },
  } as DetailsLayout,
  location: {
    photo: { left: 0, top: 0, width: 1754, height: 1080 },
    strip: { left: 0, top: 1080, width: 1754, height: 160 },
    addressText: { left: 80, top: 1100, width: 800 },
    agentText: { left: 80, top: 1150, width: 800 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 2. SWISS GRID
// 3x3 modular grid, 40px margins, 20px gutters
// Cell: 545w x 373h
// ──────────────────────────────────────

const C = { x: [40, 605, 1170], y: [40, 433, 826], w: 545, h: 373 };
const cell = (col: number, row: number, cw = 1, ch = 1): Pos => ({
  left: C.x[col], top: C.y[row],
  width: C.w * cw + 20 * (cw - 1), height: C.h * ch + 20 * (ch - 1),
});

const swissGrid = {
  cover: {
    heroImage: cell(0, 0, 2, 2),
    panelRect: { left: 1170, top: 40, width: 545, height: 766, fill: '__primary__' },
    addressText: { left: 1200, top: 200, width: 485, height: 70, align: 'left', fontSize: 32 },
    priceLine: { left: 1200, top: 300, width: 485, height: 40, align: 'left', fontSize: 18 },
    accentLine: { left: 1200, top: 280, width: 150 },
    textColorLight: true,
  } as CoverLayout,
  overview: {
    heading: { left: 40, top: 50 },
    priceBlock: { left: 40, top: 120, width: 545 },
    statsRow: { left: 40, top: 165, width: 545 },
    introText: { left: 40, top: 220, width: 545, height: 180 },
    features: { ...cell(0, 2, 2, 1) },
    photos: [cell(1, 0, 2, 1), cell(0, 1), cell(1, 1, 2, 1)],
  } as OverviewLayout,
  situation: {
    heading: { left: 40, top: 50 },
    textBlocks: [{ ...cell(0, 0, 1, 2), top: 100 }],
    photos: [cell(1, 0, 2, 2), { ...cell(0, 2, 3, 1) }],
  } as ContentLayout,
  accom1: {
    heading: { left: 40, top: 50 },
    textBlocks: [cell(2, 1, 1, 2)],
    photos: [cell(0, 0, 2, 1), cell(0, 1, 2, 1), cell(0, 2, 2, 1)],
  } as ContentLayout,
  accom2: {
    heading: { left: 40, top: 50 },
    textBlocks: [cell(0, 2, 2, 1)],
    photos: [cell(0, 0), cell(1, 0), cell(2, 0), cell(0, 1, 2, 1), cell(2, 1)],
  } as ContentLayout,
  outside: {
    heading: { left: 40, top: 50 },
    textBlocks: [cell(0, 2, 2, 1)],
    photos: [{ left: 40, top: 40, width: 1674, height: 766 }],
  } as ContentLayout,
  details: {
    heading: { left: 40, top: 50 },
    leftColumn: { ...cell(0, 0, 1, 2), top: 100 },
    rightColumn: { ...cell(1, 0, 1, 2), top: 100 },
    legalText: { left: 40, top: 870, width: 1674, height: 330 },
  } as DetailsLayout,
  location: {
    photo: { left: 40, top: 40, width: 1674, height: 766 },
    addressText: { left: 40, top: 846, width: 1110 },
    agentText: { left: 40, top: 896, width: 1110 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 3. KINFOLK MINIMALIST
// 50%+ white space, small offset photos, narrow text
// ──────────────────────────────────────

const kinfolk = {
  cover: {
    heroImage: { left: 377, top: 60, width: 1000, height: 620 },
    addressText: { left: 377, top: 740, width: 1000, height: 60, align: 'center', fontSize: 38 },
    priceLine: { left: 377, top: 840, width: 1000, height: 35, align: 'center', fontSize: 18 },
    accentLine: { left: 827, top: 815, width: 100 },
    textColorLight: false,
  } as CoverLayout,
  overview: {
    heading: { left: 120, top: 100 },
    priceBlock: { left: 120, top: 170, width: 400 },
    statsRow: { left: 120, top: 215, width: 400 },
    introText: { left: 120, top: 280, width: 300, height: 200 },
    features: { left: 120, top: 510, width: 300, height: 400 },
    photos: [{ left: 900, top: 120, width: 700, height: 500 }, { left: 700, top: 700, width: 500, height: 400 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 120, top: 100 },
    textBlocks: [{ left: 120, top: 800, width: 300, height: 340 }],
    photos: [{ left: 800, top: 100, width: 820, height: 580 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 120, top: 100 },
    textBlocks: [{ left: 1300, top: 700, width: 300, height: 400 }],
    photos: [{ left: 120, top: 150, width: 650, height: 460 }, { left: 850, top: 300, width: 400, height: 300 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 120, top: 100 },
    textBlocks: [{ left: 120, top: 700, width: 300, height: 400 }],
    photos: [{ left: 600, top: 120, width: 550, height: 400 }, { left: 1200, top: 200, width: 400, height: 350 }],
  } as ContentLayout,
  outside: {
    heading: { left: 120, top: 100 },
    textBlocks: [{ left: 120, top: 180, width: 300, height: 300 }],
    photos: [{ left: 700, top: 300, width: 900, height: 600 }],
  } as ContentLayout,
  details: {
    heading: { left: 527, top: 80 },
    leftColumn: { left: 527, top: 170, width: 700, height: 500 },
    legalText: { left: 527, top: 750, width: 700, height: 150 },
  } as DetailsLayout,
  location: {
    photo: { left: 300, top: 120, width: 1154, height: 700 },
    addressText: { left: 527, top: 880, width: 700 },
    agentText: { left: 527, top: 930, width: 700 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 4. SPLIT-SCREEN
// Vertical 50/50 divide, alternating sides
// Left: 0-877, Right: 877-1754
// ──────────────────────────────────────

const L = 877; // split point

const splitScreen = {
  cover: {
    heroImage: { left: 0, top: 0, width: L, height: 1240 },
    panelRect: { left: L, top: 0, width: L, height: 1240, fill: '__background__' },
    addressText: { left: 957, top: 380, width: 717, height: 90, align: 'left', fontSize: 46 },
    priceLine: { left: 957, top: 520, width: 717, height: 40, align: 'left', fontSize: 22 },
    accentLine: { left: 957, top: 490, width: 180 },
    textColorLight: false,
  } as CoverLayout,
  overview: {
    heading: { left: 60, top: 60 },
    priceBlock: { left: 60, top: 140, width: 757 },
    statsRow: { left: 60, top: 185, width: 757 },
    introText: { left: 60, top: 240, width: 757, height: 200 },
    features: { left: 60, top: 470, width: 757, height: 500 },
    photos: [{ left: L, top: 0, width: L, height: 620 }, { left: L, top: 620, width: L, height: 620 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 937, top: 60 },
    textBlocks: [{ left: 937, top: 150, width: 757, height: 1000 }],
    photos: [{ left: 0, top: 0, width: L, height: 1240 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 60, top: 40 },
    textBlocks: [{ left: 60, top: 130, width: 757, height: 1050 }],
    photos: [{ left: L, top: 0, width: L, height: 1240 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 937, top: 40 },
    textBlocks: [{ left: 937, top: 130, width: 757, height: 1050 }],
    photos: [{ left: 0, top: 0, width: L, height: 620 }, { left: 0, top: 620, width: L, height: 620 }],
  } as ContentLayout,
  outside: {
    heading: { left: 937, top: 60 },
    textBlocks: [{ left: 937, top: 150, width: 757, height: 500 }],
    photos: [{ left: 0, top: 0, width: L, height: 1240 }],
  } as ContentLayout,
  details: {
    heading: { left: 60, top: 60 },
    leftColumn: { left: 60, top: 150, width: 757, height: 600 },
    rightColumn: { left: 937, top: 150, width: 757, height: 400 },
    legalText: { left: 60, top: 1040, width: 1634, height: 120 },
  } as DetailsLayout,
  location: {
    photo: { left: 0, top: 0, width: L, height: 1240 },
    addressText: { left: 937, top: 440, width: 757 },
    agentText: { left: 937, top: 500, width: 757 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 5. EDITORIAL MAGAZINE
// 3-column text, mixed photo sizes, pull quotes
// Cols: 80-570, 610-1100, 1140-1630
// ──────────────────────────────────────

const editorial = {
  cover: {
    heroImage: { left: 0, top: 0, width: 1754, height: 1240 },
    overlayRect: { left: 0, top: 0, width: 520, height: 1240, fill: 'rgba(0,0,0,0.7)' },
    addressText: { left: 60, top: 440, width: 440, height: 100, align: 'left', fontSize: 42 },
    priceLine: { left: 60, top: 580, width: 440, height: 40, align: 'left', fontSize: 20 },
    accentLine: { left: 60, top: 555, width: 80 },
    textColorLight: true,
  } as CoverLayout,
  overview: {
    heading: { left: 80, top: 60 },
    priceBlock: { left: 80, top: 140, width: 490 },
    statsRow: { left: 80, top: 185, width: 490 },
    introText: { left: 80, top: 240, width: 490, height: 150 },
    features: { left: 610, top: 240, width: 1020, height: 200 },
    photos: [{ left: 80, top: 480, width: 1594, height: 420 }, { left: 80, top: 930, width: 760, height: 250 }, { left: 880, top: 930, width: 794, height: 250 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 80, top: 60 },
    textBlocks: [
      { left: 80, top: 150, width: 490, height: 500 },
      { left: 610, top: 150, width: 490, height: 500 },
      { left: 1140, top: 150, width: 490, height: 500 },
    ],
    photos: [{ left: 80, top: 700, width: 1594, height: 440 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 80, top: 30 },
    textBlocks: [
      { left: 80, top: 620, width: 490, height: 520 },
      { left: 610, top: 620, width: 490, height: 520 },
      { left: 1140, top: 620, width: 490, height: 520 },
    ],
    photos: [{ left: 80, top: 90, width: 1594, height: 500 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 80, top: 30 },
    textBlocks: [{ left: 80, top: 620, width: 490, height: 520 }, { left: 610, top: 620, width: 1020, height: 520 }],
    photos: [{ left: 80, top: 90, width: 1020, height: 500 }, { left: 1140, top: 90, width: 534, height: 240 }, { left: 1140, top: 350, width: 534, height: 240 }],
  } as ContentLayout,
  outside: {
    heading: { left: 80, top: 30 },
    textBlocks: [{ left: 80, top: 620, width: 1594, height: 520 }],
    photos: [{ left: 0, top: 80, width: 1754, height: 510 }],
  } as ContentLayout,
  details: {
    heading: { left: 80, top: 60 },
    leftColumn: { left: 80, top: 150, width: 490, height: 600 },
    rightColumn: { left: 610, top: 150, width: 490, height: 400 },
    legalText: { left: 80, top: 1040, width: 1594, height: 120 },
  } as DetailsLayout,
  location: {
    photo: { left: 0, top: 0, width: 1754, height: 900 },
    strip: { left: 0, top: 900, width: 1754, height: 340 },
    addressText: { left: 80, top: 930, width: 800 },
    agentText: { left: 80, top: 990, width: 800 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 6. HORIZONTAL BANDS
// Full-width strips, accent dividers
// ──────────────────────────────────────

const bands = {
  cover: {
    heroImage: { left: 0, top: 0, width: 1754, height: 840 },
    overlayRect: { left: 0, top: 855, width: 1754, height: 385, fill: '__primary__' },
    addressText: { left: 120, top: 895, width: 1514, height: 70, align: 'center', fontSize: 50 },
    priceLine: { left: 120, top: 1000, width: 1514, height: 40, align: 'center', fontSize: 24 },
    textColorLight: true,
  } as CoverLayout,
  overview: {
    heading: { left: 80, top: 30 },
    priceBlock: { left: 80, top: 110, width: 757 },
    statsRow: { left: 877, top: 110, width: 757 },
    introText: { left: 80, top: 165, width: 757, height: 150 },
    features: { left: 877, top: 165, width: 757, height: 250 },
    photos: [{ left: 0, top: 432, width: 877, height: 400 }, { left: 877, top: 432, width: 877, height: 400 }, { left: 0, top: 844, width: 1754, height: 356 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 80, top: 540 },
    textBlocks: [{ left: 80, top: 620, width: 757, height: 400 }, { left: 877, top: 620, width: 757, height: 400 }],
    photos: [{ left: 0, top: 0, width: 1754, height: 500 }, { left: 0, top: 1072, width: 1754, height: 168 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 80, top: 510 },
    textBlocks: [{ left: 80, top: 590, width: 757, height: 300 }, { left: 877, top: 590, width: 757, height: 300 }],
    photos: [{ left: 0, top: 0, width: 1754, height: 480 }, { left: 0, top: 932, width: 877, height: 308 }, { left: 877, top: 932, width: 877, height: 308 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 80, top: 530 },
    textBlocks: [{ left: 80, top: 610, width: 757, height: 350 }, { left: 877, top: 610, width: 757, height: 350 }],
    photos: [{ left: 0, top: 0, width: 585, height: 500 }, { left: 585, top: 0, width: 585, height: 500 }, { left: 1170, top: 0, width: 584, height: 500 }, { left: 0, top: 1012, width: 1754, height: 228 }],
  } as ContentLayout,
  outside: {
    heading: { left: 80, top: 740 },
    textBlocks: [{ left: 80, top: 820, width: 757, height: 340 }, { left: 877, top: 820, width: 757, height: 340 }],
    photos: [{ left: 0, top: 0, width: 1754, height: 700 }],
  } as ContentLayout,
  details: {
    heading: { left: 80, top: 30 },
    leftColumn: { left: 80, top: 120, width: 757, height: 600 },
    rightColumn: { left: 877, top: 120, width: 757, height: 400 },
    legalText: { left: 80, top: 1030, width: 1594, height: 150 },
  } as DetailsLayout,
  location: {
    photo: { left: 0, top: 0, width: 1754, height: 900 },
    strip: { left: 0, top: 912, width: 1754, height: 328 },
    addressText: { left: 80, top: 940, width: 800 },
    agentText: { left: 80, top: 1000, width: 800 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 7. FRAMED GALLERY
// 80px mat border, keylined photos, centred text
// Inner area: 80,80 -> 1674,1160
// ──────────────────────────────────────

const framed = {
  cover: {
    heroImage: { left: 82, top: 82, width: 1590, height: 760 },
    addressText: { left: 577, top: 880, width: 600, height: 60, align: 'center', fontSize: 36 },
    priceLine: { left: 577, top: 960, width: 600, height: 35, align: 'center', fontSize: 20 },
    accentLine: { left: 777, top: 940, width: 200 },
    textColorLight: false,
  } as CoverLayout,
  overview: {
    heading: { left: 577, top: 100 },
    priceBlock: { left: 577, top: 170, width: 600 },
    statsRow: { left: 577, top: 215, width: 600 },
    introText: { left: 577, top: 270, width: 600, height: 150 },
    features: { left: 577, top: 440, width: 600, height: 250 },
    photos: [{ left: 82, top: 740, width: 786, height: 400 }, { left: 888, top: 740, width: 786, height: 400 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 577, top: 100 },
    textBlocks: [{ left: 577, top: 180, width: 600, height: 350 }],
    photos: [{ left: 82, top: 580, width: 1590, height: 560 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 577, top: 100 },
    textBlocks: [{ left: 200, top: 620, width: 1250, height: 480 }],
    photos: [{ left: 82, top: 160, width: 1590, height: 420 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 577, top: 100 },
    textBlocks: [{ left: 200, top: 620, width: 1250, height: 480 }],
    photos: [{ left: 82, top: 160, width: 786, height: 400 }, { left: 888, top: 160, width: 786, height: 400 }],
  } as ContentLayout,
  outside: {
    heading: { left: 577, top: 100 },
    textBlocks: [{ left: 200, top: 720, width: 1250, height: 380 }],
    photos: [{ left: 82, top: 160, width: 1590, height: 520 }],
  } as ContentLayout,
  details: {
    heading: { left: 577, top: 100 },
    leftColumn: { left: 200, top: 190, width: 600, height: 500 },
    rightColumn: { left: 950, top: 190, width: 600, height: 400 },
    legalText: { left: 200, top: 980, width: 1354, height: 150 },
  } as DetailsLayout,
  location: {
    photo: { left: 82, top: 82, width: 1590, height: 860 },
    addressText: { left: 577, top: 1000, width: 600 },
    agentText: { left: 577, top: 1050, width: 600 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 8. SIDEBAR PANEL
// 250px dark sidebar, 1504px main area
// ──────────────────────────────────────

const sidebar = {
  cover: {
    heroImage: { left: 250, top: 0, width: 1504, height: 1240 },
    overlayRect: { left: 250, top: 800, width: 1504, height: 440, fill: 'rgba(0,0,0,0.55)' },
    addressText: { left: 320, top: 860, width: 900, height: 70, align: 'left', fontSize: 46 },
    priceLine: { left: 320, top: 970, width: 900, height: 40, align: 'left', fontSize: 22 },
    accentLine: { left: 320, top: 945, width: 150 },
    textColorLight: true,
  } as CoverLayout,
  overview: {
    heading: { left: 310, top: 60 },
    priceBlock: { left: 310, top: 140, width: 680 },
    statsRow: { left: 310, top: 185, width: 680 },
    introText: { left: 310, top: 240, width: 680, height: 200 },
    features: { left: 310, top: 470, width: 680, height: 400 },
    photos: [{ left: 1050, top: 60, width: 644, height: 540 }, { left: 1050, top: 630, width: 644, height: 530 }, { left: 310, top: 900, width: 700, height: 260 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 310, top: 60 },
    textBlocks: [{ left: 310, top: 150, width: 680, height: 1000 }],
    photos: [{ left: 1050, top: 60, width: 644, height: 1100 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 310, top: 60 },
    textBlocks: [{ left: 310, top: 650, width: 1384, height: 500 }],
    photos: [{ left: 310, top: 120, width: 1384, height: 500 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 310, top: 60 },
    textBlocks: [{ left: 310, top: 150, width: 680, height: 500 }],
    photos: [{ left: 1050, top: 120, width: 644, height: 540 }, { left: 310, top: 700, width: 680, height: 460 }, { left: 1050, top: 700, width: 644, height: 460 }],
  } as ContentLayout,
  outside: {
    heading: { left: 310, top: 60 },
    textBlocks: [{ left: 310, top: 850, width: 1384, height: 310 }],
    photos: [{ left: 310, top: 120, width: 1384, height: 700 }],
  } as ContentLayout,
  details: {
    heading: { left: 310, top: 60 },
    leftColumn: { left: 310, top: 150, width: 680, height: 600 },
    rightColumn: { left: 1050, top: 150, width: 644, height: 400 },
    legalText: { left: 310, top: 1040, width: 1384, height: 120 },
  } as DetailsLayout,
  location: {
    photo: { left: 250, top: 0, width: 1504, height: 1040 },
    addressText: { left: 310, top: 1070, width: 800 },
    agentText: { left: 310, top: 1120, width: 800 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 9. DARK LUXURY
// Dark backgrounds, gold text, premium feel
// ──────────────────────────────────────

const darkLuxury = {
  cover: {
    heroImage: { left: 0, top: 0, width: 1754, height: 1240 },
    overlayRect: { left: 0, top: 0, width: 1754, height: 1240, fill: 'rgba(0,0,0,0.4)' },
    addressText: { left: 200, top: 480, width: 1354, height: 90, align: 'center', fontSize: 56 },
    priceLine: { left: 200, top: 620, width: 1354, height: 40, align: 'center', fontSize: 24 },
    accentLine: { left: 777, top: 590, width: 200 },
    textColorLight: true,
  } as CoverLayout,
  overview: {
    heading: { left: 120, top: 80 },
    priceBlock: { left: 120, top: 160, width: 600 },
    statsRow: { left: 120, top: 205, width: 600 },
    introText: { left: 120, top: 260, width: 600, height: 200 },
    features: { left: 120, top: 490, width: 600, height: 400 },
    photos: [{ left: 800, top: 80, width: 874, height: 550 }, { left: 800, top: 660, width: 874, height: 480 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 120, top: 80 },
    textBlocks: [{ left: 120, top: 170, width: 700, height: 950 }],
    photos: [{ left: 880, top: 80, width: 794, height: 1060 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 120, top: 40 },
    textBlocks: [{ left: 120, top: 600, width: 700, height: 540 }],
    photos: [{ left: 120, top: 100, width: 750, height: 470 }, { left: 900, top: 100, width: 734, height: 470 }, { left: 880, top: 600, width: 794, height: 540 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 120, top: 40 },
    textBlocks: [{ left: 900, top: 600, width: 734, height: 540 }],
    photos: [{ left: 120, top: 100, width: 1554, height: 470 }, { left: 120, top: 600, width: 740, height: 540 }],
  } as ContentLayout,
  outside: {
    heading: { left: 120, top: 40 },
    textBlocks: [{ left: 120, top: 700, width: 1514, height: 440 }],
    photos: [{ left: 0, top: 80, width: 1754, height: 590 }],
  } as ContentLayout,
  details: {
    heading: { left: 120, top: 80 },
    leftColumn: { left: 120, top: 170, width: 700, height: 600 },
    rightColumn: { left: 900, top: 170, width: 734, height: 400 },
    legalText: { left: 120, top: 1040, width: 1514, height: 120 },
  } as DetailsLayout,
  location: {
    photo: { left: 0, top: 0, width: 1754, height: 1000 },
    strip: { left: 0, top: 1000, width: 1754, height: 240 },
    addressText: { left: 120, top: 1030, width: 800 },
    agentText: { left: 120, top: 1090, width: 800 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 10. PHOTO MOSAIC
// Asymmetric photo collage, photos at varying sizes
// ──────────────────────────────────────

const mosaic = {
  cover: {
    heroImage: { left: 0, top: 0, width: 1200, height: 1240 },
    panelRect: { left: 1200, top: 0, width: 554, height: 1240, fill: '__primary__' },
    addressText: { left: 1230, top: 300, width: 494, height: 90, align: 'left', fontSize: 36 },
    priceLine: { left: 1230, top: 430, width: 494, height: 40, align: 'left', fontSize: 20 },
    accentLine: { left: 1230, top: 410, width: 150 },
    textColorLight: true,
  } as CoverLayout,
  overview: {
    heading: { left: 80, top: 60 },
    priceBlock: { left: 80, top: 140, width: 500 },
    statsRow: { left: 80, top: 185, width: 500 },
    introText: { left: 80, top: 240, width: 500, height: 160 },
    features: { left: 80, top: 430, width: 500, height: 350 },
    photos: [{ left: 620, top: 60, width: 560, height: 400 }, { left: 1200, top: 60, width: 474, height: 400 }, { left: 620, top: 480, width: 1054, height: 340 }, { left: 80, top: 840, width: 800, height: 340 }, { left: 900, top: 840, width: 774, height: 340 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 80, top: 60 },
    textBlocks: [{ left: 80, top: 150, width: 600, height: 500 }],
    photos: [{ left: 720, top: 60, width: 954, height: 600 }, { left: 80, top: 700, width: 820, height: 440 }, { left: 920, top: 700, width: 754, height: 440 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 80, top: 30 },
    textBlocks: [{ left: 80, top: 700, width: 1594, height: 440 }],
    photos: [{ left: 80, top: 80, width: 600, height: 590 }, { left: 700, top: 80, width: 480, height: 290 }, { left: 1200, top: 80, width: 474, height: 290 }, { left: 700, top: 390, width: 974, height: 290 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 80, top: 30 },
    textBlocks: [{ left: 80, top: 700, width: 1594, height: 440 }],
    photos: [{ left: 80, top: 80, width: 1054, height: 590 }, { left: 1154, top: 80, width: 520, height: 290 }, { left: 1154, top: 390, width: 520, height: 290 }],
  } as ContentLayout,
  outside: {
    heading: { left: 80, top: 30 },
    textBlocks: [{ left: 80, top: 680, width: 1594, height: 460 }],
    photos: [{ left: 0, top: 70, width: 1100, height: 580 }, { left: 1120, top: 70, width: 554, height: 580 }],
  } as ContentLayout,
  details: {
    heading: { left: 80, top: 60 },
    leftColumn: { left: 80, top: 150, width: 760, height: 600 },
    rightColumn: { left: 920, top: 150, width: 754, height: 400 },
    legalText: { left: 80, top: 1040, width: 1594, height: 120 },
  } as DetailsLayout,
  location: {
    photo: { left: 0, top: 0, width: 1200, height: 1240 },
    strip: { left: 1200, top: 0, width: 554, height: 1240 },
    addressText: { left: 1230, top: 400, width: 494 },
    agentText: { left: 1230, top: 460, width: 494 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 11. CLASSIC TWO-COLUMN
// Traditional estate agent layout, text+photo columns
// ──────────────────────────────────────

const twoColumn = {
  cover: {
    heroImage: { left: 0, top: 0, width: 1754, height: 900 },
    overlayRect: { left: 0, top: 900, width: 1754, height: 340, fill: '__background__' },
    addressText: { left: 80, top: 930, width: 1594, height: 70, align: 'left', fontSize: 42 },
    priceLine: { left: 80, top: 1020, width: 1594, height: 40, align: 'left', fontSize: 22 },
    accentLine: { left: 80, top: 1000, width: 200 },
    textColorLight: false,
  } as CoverLayout,
  overview: {
    heading: { left: 80, top: 50 },
    priceBlock: { left: 80, top: 130, width: 800 },
    statsRow: { left: 80, top: 175, width: 800 },
    introText: { left: 80, top: 230, width: 800, height: 120 },
    features: { left: 960, top: 130, width: 714, height: 250 },
    photos: [{ left: 80, top: 400, width: 800, height: 500 }, { left: 960, top: 400, width: 714, height: 240 }, { left: 960, top: 660, width: 714, height: 240 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 80, top: 50 },
    textBlocks: [{ left: 80, top: 140, width: 800, height: 500 }, { left: 80, top: 700, width: 800, height: 440 }],
    photos: [{ left: 960, top: 50, width: 714, height: 1090 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 80, top: 30 },
    textBlocks: [{ left: 80, top: 120, width: 800, height: 500 }],
    photos: [{ left: 960, top: 30, width: 714, height: 580 }, { left: 80, top: 650, width: 800, height: 490 }, { left: 960, top: 650, width: 714, height: 490 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 80, top: 30 },
    textBlocks: [{ left: 960, top: 120, width: 714, height: 500 }],
    photos: [{ left: 80, top: 30, width: 840, height: 580 }, { left: 80, top: 650, width: 550, height: 490 }, { left: 650, top: 650, width: 550, height: 490 }, { left: 1220, top: 650, width: 454, height: 490 }],
  } as ContentLayout,
  outside: {
    heading: { left: 80, top: 30 },
    textBlocks: [{ left: 80, top: 120, width: 800, height: 400 }],
    photos: [{ left: 960, top: 30, width: 714, height: 500 }, { left: 80, top: 560, width: 1594, height: 580 }],
  } as ContentLayout,
  details: {
    heading: { left: 80, top: 50 },
    leftColumn: { left: 80, top: 140, width: 800, height: 600 },
    rightColumn: { left: 960, top: 140, width: 714, height: 400 },
    legalText: { left: 80, top: 1040, width: 1594, height: 120 },
  } as DetailsLayout,
  location: {
    photo: { left: 0, top: 0, width: 1754, height: 900 },
    strip: { left: 0, top: 900, width: 1754, height: 340 },
    addressText: { left: 80, top: 930, width: 800 },
    agentText: { left: 80, top: 990, width: 800 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 12. PANORAMIC STRIP
// Wide panoramic photos, thin text strips between
// ──────────────────────────────────────

const panoramic = {
  cover: {
    heroImage: { left: 0, top: 150, width: 1754, height: 700 },
    overlayRect: { left: 0, top: 0, width: 1754, height: 150, fill: '__primary__' },
    addressText: { left: 120, top: 30, width: 1514, height: 70, align: 'left', fontSize: 44 },
    priceLine: { left: 120, top: 100, width: 1514, height: 30, align: 'left', fontSize: 20 },
    panelRect: { left: 0, top: 850, width: 1754, height: 390, fill: '__background__' },
    textColorLight: true,
  } as CoverLayout,
  overview: {
    heading: { left: 80, top: 40 },
    priceBlock: { left: 80, top: 120, width: 600 },
    statsRow: { left: 80, top: 165, width: 600 },
    introText: { left: 80, top: 220, width: 1594, height: 100 },
    features: { left: 80, top: 340, width: 1594, height: 120 },
    photos: [{ left: 0, top: 490, width: 1754, height: 350 }, { left: 0, top: 860, width: 877, height: 340 }, { left: 877, top: 860, width: 877, height: 340 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 80, top: 40 },
    textBlocks: [{ left: 80, top: 130, width: 1594, height: 300 }],
    photos: [{ left: 0, top: 460, width: 1754, height: 380 }, { left: 0, top: 860, width: 1754, height: 340 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 80, top: 20 },
    textBlocks: [{ left: 80, top: 480, width: 1594, height: 250 }],
    photos: [{ left: 0, top: 70, width: 1754, height: 390 }, { left: 0, top: 760, width: 877, height: 440 }, { left: 877, top: 760, width: 877, height: 440 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 80, top: 20 },
    textBlocks: [{ left: 80, top: 480, width: 1594, height: 250 }],
    photos: [{ left: 0, top: 70, width: 585, height: 390 }, { left: 585, top: 70, width: 585, height: 390 }, { left: 1170, top: 70, width: 584, height: 390 }, { left: 0, top: 760, width: 1754, height: 440 }],
  } as ContentLayout,
  outside: {
    heading: { left: 80, top: 20 },
    textBlocks: [{ left: 80, top: 480, width: 1594, height: 300 }],
    photos: [{ left: 0, top: 70, width: 1754, height: 390 }, { left: 0, top: 810, width: 1754, height: 390 }],
  } as ContentLayout,
  details: {
    heading: { left: 80, top: 40 },
    leftColumn: { left: 80, top: 130, width: 760, height: 600 },
    rightColumn: { left: 920, top: 130, width: 754, height: 400 },
    legalText: { left: 80, top: 1040, width: 1594, height: 120 },
  } as DetailsLayout,
  location: {
    photo: { left: 0, top: 0, width: 1754, height: 700 },
    strip: { left: 0, top: 700, width: 1754, height: 540 },
    addressText: { left: 80, top: 740, width: 800 },
    agentText: { left: 80, top: 800, width: 800 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 13. CARD STACK
// Content on white cards with shadows on grey background
// ──────────────────────────────────────

const cardStack = {
  cover: {
    heroImage: { left: 60, top: 60, width: 1634, height: 800 },
    addressText: { left: 60, top: 900, width: 1634, height: 70, align: 'left', fontSize: 44 },
    priceLine: { left: 60, top: 990, width: 1634, height: 40, align: 'left', fontSize: 22 },
    accentLine: { left: 60, top: 975, width: 200 },
    textColorLight: false,
  } as CoverLayout,
  overview: {
    heading: { left: 100, top: 60 },
    priceBlock: { left: 100, top: 140, width: 650 },
    statsRow: { left: 100, top: 185, width: 650 },
    introText: { left: 100, top: 240, width: 650, height: 180 },
    features: { left: 100, top: 450, width: 650, height: 300 },
    photos: [{ left: 820, top: 60, width: 854, height: 500 }, { left: 100, top: 800, width: 760, height: 360 }, { left: 900, top: 800, width: 774, height: 360 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 100, top: 60 },
    textBlocks: [{ left: 100, top: 150, width: 700, height: 600 }],
    photos: [{ left: 860, top: 60, width: 814, height: 700 }, { left: 100, top: 800, width: 1574, height: 360 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 100, top: 30 },
    textBlocks: [{ left: 100, top: 580, width: 1574, height: 560 }],
    photos: [{ left: 100, top: 80, width: 760, height: 470 }, { left: 900, top: 80, width: 774, height: 470 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 100, top: 30 },
    textBlocks: [{ left: 100, top: 580, width: 1574, height: 560 }],
    photos: [{ left: 100, top: 80, width: 500, height: 470 }, { left: 620, top: 80, width: 500, height: 470 }, { left: 1140, top: 80, width: 534, height: 470 }],
  } as ContentLayout,
  outside: {
    heading: { left: 100, top: 30 },
    textBlocks: [{ left: 100, top: 660, width: 1574, height: 480 }],
    photos: [{ left: 60, top: 80, width: 1634, height: 550 }],
  } as ContentLayout,
  details: {
    heading: { left: 100, top: 60 },
    leftColumn: { left: 100, top: 150, width: 700, height: 600 },
    rightColumn: { left: 880, top: 150, width: 794, height: 400 },
    legalText: { left: 100, top: 1040, width: 1554, height: 120 },
  } as DetailsLayout,
  location: {
    photo: { left: 60, top: 60, width: 1634, height: 860 },
    strip: { left: 60, top: 950, width: 1634, height: 230 },
    addressText: { left: 100, top: 980, width: 800 },
    agentText: { left: 100, top: 1040, width: 800 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 14. CORNER ACCENT
// Bold colour block in one corner, content elsewhere
// ──────────────────────────────────────

const cornerAccent = {
  cover: {
    heroImage: { left: 300, top: 0, width: 1454, height: 1240 },
    panelRect: { left: 0, top: 0, width: 300, height: 1240, fill: '__primary__' },
    addressText: { left: 30, top: 350, width: 250, height: 200, align: 'left', fontSize: 32 },
    priceLine: { left: 30, top: 600, width: 250, height: 40, align: 'left', fontSize: 18 },
    accentLine: { left: 30, top: 580, width: 100 },
    textColorLight: true,
  } as CoverLayout,
  overview: {
    heading: { left: 80, top: 60 },
    priceBlock: { left: 80, top: 140, width: 600 },
    statsRow: { left: 80, top: 185, width: 600 },
    introText: { left: 80, top: 240, width: 600, height: 200 },
    features: { left: 80, top: 470, width: 600, height: 350 },
    photos: [{ left: 740, top: 60, width: 934, height: 560 }, { left: 740, top: 650, width: 460, height: 490 }, { left: 1220, top: 650, width: 454, height: 490 }],
  } as OverviewLayout,
  situation: {
    heading: { left: 80, top: 60 },
    textBlocks: [{ left: 80, top: 150, width: 650, height: 600 }],
    photos: [{ left: 780, top: 60, width: 894, height: 700 }, { left: 80, top: 800, width: 1594, height: 340 }],
  } as ContentLayout,
  accom1: {
    heading: { left: 80, top: 30 },
    textBlocks: [{ left: 80, top: 600, width: 1594, height: 540 }],
    photos: [{ left: 80, top: 80, width: 1054, height: 490 }, { left: 1154, top: 80, width: 520, height: 490 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 80, top: 30 },
    textBlocks: [{ left: 80, top: 600, width: 1594, height: 540 }],
    photos: [{ left: 80, top: 80, width: 520, height: 490 }, { left: 620, top: 80, width: 520, height: 490 }, { left: 1160, top: 80, width: 514, height: 490 }],
  } as ContentLayout,
  outside: {
    heading: { left: 80, top: 30 },
    textBlocks: [{ left: 80, top: 650, width: 1594, height: 490 }],
    photos: [{ left: 0, top: 70, width: 1754, height: 550 }],
  } as ContentLayout,
  details: {
    heading: { left: 80, top: 60 },
    leftColumn: { left: 80, top: 150, width: 760, height: 600 },
    rightColumn: { left: 920, top: 150, width: 754, height: 400 },
    legalText: { left: 80, top: 1040, width: 1594, height: 120 },
  } as DetailsLayout,
  location: {
    photo: { left: 300, top: 0, width: 1454, height: 1240 },
    addressText: { left: 30, top: 400, width: 250 },
    agentText: { left: 30, top: 470, width: 250 },
  } as LocationLayout,
};

// ──────────────────────────────────────
// 15-30: Additional layouts
// Compact definitions, same 8-page structure
// ──────────────────────────────────────

// 15. SAVILLS STRUCTURED - Uniform photo grids, structured info blocks (inspired by Savills)
const savillsStructured = {
  cover: { heroImage: { left: 40, top: 40, width: 1674, height: 820 }, overlayRect: { left: 40, top: 860, width: 1674, height: 340, fill: '__background__' }, addressText: { left: 80, top: 890, width: 1594, height: 70, align: 'left', fontSize: 40 }, priceLine: { left: 80, top: 980, width: 800, height: 40, align: 'left', fontSize: 22 }, accentLine: { left: 80, top: 965, width: 200 }, textColorLight: false } as CoverLayout,
  overview: { heading: { left: 80, top: 50 }, priceBlock: { left: 80, top: 130, width: 800 }, statsRow: { left: 80, top: 175, width: 800 }, introText: { left: 80, top: 230, width: 800, height: 150 }, features: { left: 80, top: 410, width: 800, height: 250 }, photos: [{ left: 960, top: 50, width: 714, height: 350 }, { left: 960, top: 420, width: 714, height: 350 }, { left: 80, top: 700, width: 530, height: 440 }, { left: 630, top: 700, width: 530, height: 440 }, { left: 1180, top: 700, width: 494, height: 440 }] } as OverviewLayout,
  situation: { heading: { left: 80, top: 50 }, textBlocks: [{ left: 80, top: 140, width: 800, height: 600 }], photos: [{ left: 960, top: 50, width: 714, height: 700 }, { left: 80, top: 800, width: 1594, height: 340 }] } as ContentLayout,
  accom1: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 550, width: 1594, height: 590 }], photos: [{ left: 80, top: 80, width: 530, height: 440 }, { left: 630, top: 80, width: 530, height: 440 }, { left: 1180, top: 80, width: 494, height: 440 }] } as ContentLayout,
  accom2: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 550, width: 1594, height: 590 }], photos: [{ left: 80, top: 80, width: 397, height: 440 }, { left: 497, top: 80, width: 397, height: 440 }, { left: 914, top: 80, width: 397, height: 440 }, { left: 1331, top: 80, width: 343, height: 440 }] } as ContentLayout,
  outside: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 600, width: 1594, height: 540 }], photos: [{ left: 80, top: 80, width: 800, height: 490 }, { left: 900, top: 80, width: 774, height: 490 }] } as ContentLayout,
  details: { heading: { left: 80, top: 50 }, leftColumn: { left: 80, top: 140, width: 760, height: 600 }, rightColumn: { left: 920, top: 140, width: 754, height: 400 }, legalText: { left: 80, top: 1040, width: 1594, height: 120 } } as DetailsLayout,
  location: { photo: { left: 40, top: 40, width: 1674, height: 820 }, strip: { left: 40, top: 860, width: 1674, height: 340 }, addressText: { left: 80, top: 890, width: 800 }, agentText: { left: 80, top: 950, width: 800 } } as LocationLayout,
};

// 16. HAMPTONS WARM - Coral accents, warm feel, home-life photography (inspired by Hamptons)
const hamptonsWarm = {
  cover: { heroImage: { left: 0, top: 0, width: 1754, height: 1240 }, overlayRect: { left: 0, top: 880, width: 1754, height: 360, fill: 'rgba(27,42,74,0.85)' }, addressText: { left: 120, top: 920, width: 1514, height: 70, align: 'left', fontSize: 48 }, priceLine: { left: 120, top: 1020, width: 1514, height: 40, align: 'left', fontSize: 22 }, accentLine: { left: 120, top: 1000, width: 150 }, textColorLight: true } as CoverLayout,
  overview: { heading: { left: 80, top: 60 }, priceBlock: { left: 80, top: 140, width: 700 }, statsRow: { left: 80, top: 185, width: 700 }, introText: { left: 80, top: 240, width: 700, height: 180 }, features: { left: 80, top: 450, width: 700, height: 300 }, photos: [{ left: 840, top: 60, width: 834, height: 560 }, { left: 80, top: 790, width: 800, height: 350 }, { left: 900, top: 790, width: 774, height: 350 }] } as OverviewLayout,
  situation: { heading: { left: 80, top: 60 }, textBlocks: [{ left: 80, top: 150, width: 750, height: 600 }], photos: [{ left: 880, top: 60, width: 794, height: 700 }, { left: 80, top: 800, width: 1594, height: 340 }] } as ContentLayout,
  accom1: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 570, width: 1594, height: 570 }], photos: [{ left: 80, top: 80, width: 1594, height: 460 }] } as ContentLayout,
  accom2: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 570, width: 1594, height: 570 }], photos: [{ left: 80, top: 80, width: 780, height: 460 }, { left: 880, top: 80, width: 794, height: 460 }] } as ContentLayout,
  outside: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 640, width: 1594, height: 500 }], photos: [{ left: 0, top: 70, width: 1754, height: 540 }] } as ContentLayout,
  details: { heading: { left: 80, top: 60 }, leftColumn: { left: 80, top: 150, width: 760, height: 600 }, rightColumn: { left: 920, top: 150, width: 754, height: 400 }, legalText: { left: 80, top: 1040, width: 1594, height: 120 } } as DetailsLayout,
  location: { photo: { left: 0, top: 0, width: 1754, height: 900 }, strip: { left: 0, top: 900, width: 1754, height: 340 }, addressText: { left: 80, top: 930, width: 800 }, agentText: { left: 80, top: 990, width: 800 } } as LocationLayout,
};

// 17. SOTHEBYS AUCTION - Navy+gold, warm cream, auction house elegance (inspired by Sotheby's IR)
const sothebysAuction = {
  cover: { heroImage: { left: 0, top: 0, width: 1754, height: 1240 }, overlayRect: { left: 0, top: 800, width: 700, height: 440, fill: 'rgba(0,35,73,0.9)' }, addressText: { left: 50, top: 860, width: 620, height: 80, align: 'left', fontSize: 40 }, priceLine: { left: 50, top: 970, width: 620, height: 40, align: 'left', fontSize: 20 }, accentLine: { left: 50, top: 950, width: 120 }, textColorLight: true } as CoverLayout,
  overview: { heading: { left: 100, top: 80 }, priceBlock: { left: 100, top: 160, width: 600 }, statsRow: { left: 100, top: 205, width: 600 }, introText: { left: 100, top: 260, width: 600, height: 200 }, features: { left: 100, top: 490, width: 600, height: 350 }, photos: [{ left: 760, top: 80, width: 894, height: 520 }, { left: 760, top: 630, width: 894, height: 510 }] } as OverviewLayout,
  situation: { heading: { left: 100, top: 80 }, textBlocks: [{ left: 100, top: 170, width: 650, height: 950 }], photos: [{ left: 810, top: 80, width: 844, height: 1060 }] } as ContentLayout,
  accom1: { heading: { left: 100, top: 40 }, textBlocks: [{ left: 100, top: 620, width: 1554, height: 520 }], photos: [{ left: 100, top: 100, width: 1554, height: 490 }] } as ContentLayout,
  accom2: { heading: { left: 100, top: 40 }, textBlocks: [{ left: 100, top: 620, width: 750, height: 520 }], photos: [{ left: 100, top: 100, width: 750, height: 490 }, { left: 870, top: 100, width: 784, height: 490 }, { left: 870, top: 620, width: 784, height: 520 }] } as ContentLayout,
  outside: { heading: { left: 100, top: 40 }, textBlocks: [{ left: 100, top: 680, width: 1554, height: 460 }], photos: [{ left: 0, top: 80, width: 1754, height: 570 }] } as ContentLayout,
  details: { heading: { left: 100, top: 80 }, leftColumn: { left: 100, top: 170, width: 700, height: 600 }, rightColumn: { left: 880, top: 170, width: 774, height: 400 }, legalText: { left: 100, top: 1040, width: 1554, height: 120 } } as DetailsLayout,
  location: { photo: { left: 0, top: 0, width: 1754, height: 1000 }, strip: { left: 0, top: 1000, width: 1754, height: 240 }, addressText: { left: 100, top: 1030, width: 800 }, agentText: { left: 100, top: 1090, width: 800 } } as LocationLayout,
};

// 18. FOXTONS BOLD - Teal+gold, energetic, urban (inspired by Foxtons)
const foxtonsBold = {
  cover: { heroImage: { left: 0, top: 0, width: 1754, height: 1240 }, overlayRect: { left: 0, top: 0, width: 1754, height: 120, fill: '__primary__' }, addressText: { left: 80, top: 20, width: 1594, height: 70, align: 'left', fontSize: 42 }, priceLine: { left: 80, top: 1160, width: 800, height: 40, align: 'left', fontSize: 24 }, textColorLight: true } as CoverLayout,
  overview: { heading: { left: 80, top: 30 }, priceBlock: { left: 80, top: 110, width: 600 }, statsRow: { left: 80, top: 155, width: 1594 }, introText: { left: 80, top: 210, width: 750, height: 200 }, features: { left: 900, top: 210, width: 774, height: 250 }, photos: [{ left: 80, top: 480, width: 1594, height: 380 }, { left: 80, top: 880, width: 780, height: 300 }, { left: 880, top: 880, width: 794, height: 300 }] } as OverviewLayout,
  situation: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 120, width: 1594, height: 350 }], photos: [{ left: 80, top: 500, width: 1594, height: 640 }] } as ContentLayout,
  accom1: { heading: { left: 80, top: 20 }, textBlocks: [{ left: 80, top: 530, width: 1594, height: 610 }], photos: [{ left: 0, top: 60, width: 1754, height: 450 }] } as ContentLayout,
  accom2: { heading: { left: 80, top: 20 }, textBlocks: [{ left: 80, top: 530, width: 1594, height: 610 }], photos: [{ left: 80, top: 60, width: 530, height: 440 }, { left: 630, top: 60, width: 530, height: 440 }, { left: 1180, top: 60, width: 494, height: 440 }] } as ContentLayout,
  outside: { heading: { left: 80, top: 20 }, textBlocks: [{ left: 80, top: 600, width: 1594, height: 540 }], photos: [{ left: 0, top: 60, width: 1754, height: 510 }] } as ContentLayout,
  details: { heading: { left: 80, top: 30 }, leftColumn: { left: 80, top: 120, width: 760, height: 600 }, rightColumn: { left: 920, top: 120, width: 754, height: 400 }, legalText: { left: 80, top: 1040, width: 1594, height: 120 } } as DetailsLayout,
  location: { photo: { left: 0, top: 0, width: 1754, height: 1000 }, strip: { left: 0, top: 1000, width: 1754, height: 240 }, addressText: { left: 80, top: 1030, width: 800 }, agentText: { left: 80, top: 1090, width: 800 } } as LocationLayout,
};

// 19. COUNTRY ESTATE - Landscape-focused, earthy, countryside (inspired by Strutt & Parker)
const countryEstate = {
  cover: { heroImage: { left: 0, top: 0, width: 1754, height: 1240 }, overlayRect: { left: 550, top: 400, width: 654, height: 440, fill: 'rgba(255,255,255,0.92)' }, addressText: { left: 590, top: 440, width: 574, height: 80, align: 'center', fontSize: 38 }, priceLine: { left: 590, top: 560, width: 574, height: 40, align: 'center', fontSize: 20 }, accentLine: { left: 777, top: 540, width: 200 }, textColorLight: false } as CoverLayout,
  overview: { heading: { left: 80, top: 60 }, priceBlock: { left: 80, top: 140, width: 700 }, statsRow: { left: 80, top: 185, width: 700 }, introText: { left: 80, top: 240, width: 700, height: 200 }, features: { left: 80, top: 470, width: 700, height: 350 }, photos: [{ left: 840, top: 60, width: 834, height: 760 }, { left: 80, top: 860, width: 1594, height: 280 }] } as OverviewLayout,
  situation: { heading: { left: 80, top: 60 }, textBlocks: [{ left: 80, top: 150, width: 700, height: 700 }], photos: [{ left: 840, top: 60, width: 834, height: 800 }, { left: 80, top: 900, width: 1594, height: 240 }] } as ContentLayout,
  accom1: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 580, width: 1594, height: 560 }], photos: [{ left: 0, top: 70, width: 1754, height: 480 }] } as ContentLayout,
  accom2: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 580, width: 1594, height: 560 }], photos: [{ left: 80, top: 70, width: 780, height: 480 }, { left: 880, top: 70, width: 794, height: 480 }] } as ContentLayout,
  outside: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 680, width: 1594, height: 460 }], photos: [{ left: 0, top: 70, width: 1754, height: 580 }] } as ContentLayout,
  details: { heading: { left: 80, top: 60 }, leftColumn: { left: 80, top: 150, width: 760, height: 600 }, rightColumn: { left: 920, top: 150, width: 754, height: 400 }, legalText: { left: 80, top: 1040, width: 1594, height: 120 } } as DetailsLayout,
  location: { photo: { left: 0, top: 0, width: 1754, height: 940 }, strip: { left: 0, top: 940, width: 1754, height: 300 }, addressText: { left: 80, top: 970, width: 800 }, agentText: { left: 80, top: 1030, width: 800 } } as LocationLayout,
};

// 20. TOWNHOUSE NARROW - Tall narrow panels, vertical rhythm (inspired by London townhouse agents)
const townhouseNarrow = {
  cover: { heroImage: { left: 400, top: 0, width: 954, height: 1240 }, panelRect: { left: 0, top: 0, width: 400, height: 1240, fill: '__background__' }, addressText: { left: 40, top: 400, width: 340, height: 100, align: 'left', fontSize: 34 }, priceLine: { left: 40, top: 540, width: 340, height: 40, align: 'left', fontSize: 18 }, accentLine: { left: 40, top: 520, width: 120 }, textColorLight: false } as CoverLayout,
  overview: { heading: { left: 80, top: 60 }, priceBlock: { left: 80, top: 140, width: 500 }, statsRow: { left: 80, top: 185, width: 500 }, introText: { left: 80, top: 240, width: 500, height: 250 }, features: { left: 80, top: 520, width: 500, height: 400 }, photos: [{ left: 640, top: 60, width: 380, height: 560 }, { left: 1040, top: 60, width: 634, height: 560 }, { left: 640, top: 650, width: 1034, height: 490 }] } as OverviewLayout,
  situation: { heading: { left: 80, top: 60 }, textBlocks: [{ left: 80, top: 150, width: 500, height: 980 }], photos: [{ left: 640, top: 60, width: 500, height: 1080 }, { left: 1160, top: 60, width: 514, height: 1080 }] } as ContentLayout,
  accom1: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 120, width: 500, height: 1020 }], photos: [{ left: 640, top: 30, width: 1034, height: 540 }, { left: 640, top: 590, width: 500, height: 550 }, { left: 1160, top: 590, width: 514, height: 550 }] } as ContentLayout,
  accom2: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 640, top: 120, width: 1034, height: 400 }], photos: [{ left: 80, top: 30, width: 520, height: 1110 }, { left: 640, top: 550, width: 500, height: 590 }, { left: 1160, top: 550, width: 514, height: 590 }] } as ContentLayout,
  outside: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 120, width: 500, height: 600 }], photos: [{ left: 640, top: 30, width: 1034, height: 700 }, { left: 80, top: 760, width: 1594, height: 380 }] } as ContentLayout,
  details: { heading: { left: 80, top: 60 }, leftColumn: { left: 80, top: 150, width: 500, height: 600 }, rightColumn: { left: 640, top: 150, width: 500, height: 400 }, legalText: { left: 80, top: 1040, width: 1594, height: 120 } } as DetailsLayout,
  location: { photo: { left: 400, top: 0, width: 1354, height: 1240 }, addressText: { left: 40, top: 400, width: 340 }, agentText: { left: 40, top: 460, width: 340 } } as LocationLayout,
};

// 21. PENTHOUSE DRAMATIC - Ultra-wide photos, minimal text, dramatic (inspired by ultra-prime agents)
const penthouseDramatic = {
  cover: { heroImage: { left: 0, top: 0, width: 1754, height: 1240 }, overlayRect: { left: 0, top: 0, width: 1754, height: 1240, fill: 'rgba(0,0,0,0.3)' }, addressText: { left: 80, top: 540, width: 1594, height: 80, align: 'center', fontSize: 60 }, priceLine: { left: 80, top: 660, width: 1594, height: 40, align: 'center', fontSize: 26 }, accentLine: { left: 777, top: 640, width: 200 }, textColorLight: true } as CoverLayout,
  overview: { heading: { left: 200, top: 80 }, priceBlock: { left: 200, top: 160, width: 1354 }, statsRow: { left: 200, top: 205, width: 1354 }, introText: { left: 200, top: 260, width: 1354, height: 120 }, features: { left: 200, top: 400, width: 1354, height: 200 }, photos: [{ left: 0, top: 640, width: 877, height: 560 }, { left: 877, top: 640, width: 877, height: 560 }] } as OverviewLayout,
  situation: { heading: { left: 200, top: 80 }, textBlocks: [{ left: 200, top: 170, width: 1354, height: 350 }], photos: [{ left: 0, top: 560, width: 1754, height: 640 }] } as ContentLayout,
  accom1: { heading: { left: 200, top: 30 }, textBlocks: [{ left: 200, top: 580, width: 1354, height: 560 }], photos: [{ left: 0, top: 70, width: 1754, height: 480 }] } as ContentLayout,
  accom2: { heading: { left: 200, top: 30 }, textBlocks: [{ left: 200, top: 580, width: 1354, height: 560 }], photos: [{ left: 0, top: 70, width: 585, height: 480 }, { left: 585, top: 70, width: 585, height: 480 }, { left: 1170, top: 70, width: 584, height: 480 }] } as ContentLayout,
  outside: { heading: { left: 200, top: 30 }, textBlocks: [{ left: 200, top: 660, width: 1354, height: 480 }], photos: [{ left: 0, top: 70, width: 1754, height: 560 }] } as ContentLayout,
  details: { heading: { left: 200, top: 80 }, leftColumn: { left: 200, top: 170, width: 650, height: 600 }, rightColumn: { left: 920, top: 170, width: 634, height: 400 }, legalText: { left: 200, top: 1040, width: 1354, height: 120 } } as DetailsLayout,
  location: { photo: { left: 0, top: 0, width: 1754, height: 1040 }, strip: { left: 0, top: 1040, width: 1754, height: 200 }, addressText: { left: 200, top: 1070, width: 800 }, agentText: { left: 200, top: 1120, width: 800 } } as LocationLayout,
};

// 22. COTTAGE RUSTIC - Warm, textured feel, cosy (inspired by country cottage agents)
const cottageRustic = {
  cover: { heroImage: { left: 100, top: 100, width: 1554, height: 800 }, addressText: { left: 100, top: 940, width: 1554, height: 60, align: 'center', fontSize: 38 }, priceLine: { left: 100, top: 1030, width: 1554, height: 35, align: 'center', fontSize: 18 }, accentLine: { left: 777, top: 1010, width: 200 }, textColorLight: false } as CoverLayout,
  overview: { heading: { left: 100, top: 80 }, priceBlock: { left: 100, top: 160, width: 650 }, statsRow: { left: 100, top: 205, width: 650 }, introText: { left: 100, top: 260, width: 650, height: 200 }, features: { left: 100, top: 490, width: 650, height: 350 }, photos: [{ left: 820, top: 80, width: 834, height: 500 }, { left: 100, top: 880, width: 780, height: 260 }, { left: 900, top: 880, width: 754, height: 260 }] } as OverviewLayout,
  situation: { heading: { left: 100, top: 80 }, textBlocks: [{ left: 100, top: 170, width: 650, height: 600 }], photos: [{ left: 820, top: 80, width: 834, height: 700 }] } as ContentLayout,
  accom1: { heading: { left: 100, top: 40 }, textBlocks: [{ left: 100, top: 580, width: 1554, height: 560 }], photos: [{ left: 100, top: 90, width: 1554, height: 460 }] } as ContentLayout,
  accom2: { heading: { left: 100, top: 40 }, textBlocks: [{ left: 100, top: 580, width: 1554, height: 560 }], photos: [{ left: 100, top: 90, width: 760, height: 460 }, { left: 880, top: 90, width: 774, height: 460 }] } as ContentLayout,
  outside: { heading: { left: 100, top: 40 }, textBlocks: [{ left: 100, top: 660, width: 1554, height: 480 }], photos: [{ left: 100, top: 90, width: 1554, height: 540 }] } as ContentLayout,
  details: { heading: { left: 100, top: 80 }, leftColumn: { left: 100, top: 170, width: 700, height: 600 }, rightColumn: { left: 880, top: 170, width: 774, height: 400 }, legalText: { left: 100, top: 1040, width: 1554, height: 120 } } as DetailsLayout,
  location: { photo: { left: 100, top: 100, width: 1554, height: 780 }, addressText: { left: 100, top: 920, width: 1554 }, agentText: { left: 100, top: 970, width: 1554 } } as LocationLayout,
};

// 23. NEW BUILD CLEAN - Ultra-clean, developer-style, CGI-ready (inspired by new build marketing)
const newBuildClean = {
  cover: { heroImage: { left: 0, top: 0, width: 1754, height: 880 }, overlayRect: { left: 0, top: 880, width: 1754, height: 360, fill: '__primary__' }, addressText: { left: 100, top: 920, width: 1554, height: 70, align: 'center', fontSize: 46 }, priceLine: { left: 100, top: 1020, width: 1554, height: 40, align: 'center', fontSize: 22 }, textColorLight: true } as CoverLayout,
  overview: { heading: { left: 100, top: 50 }, priceBlock: { left: 100, top: 130, width: 700 }, statsRow: { left: 100, top: 175, width: 700 }, introText: { left: 100, top: 230, width: 700, height: 180 }, features: { left: 100, top: 440, width: 700, height: 300 }, photos: [{ left: 877, top: 50, width: 797, height: 560 }, { left: 100, top: 780, width: 530, height: 360 }, { left: 650, top: 780, width: 530, height: 360 }, { left: 1200, top: 780, width: 474, height: 360 }] } as OverviewLayout,
  situation: { heading: { left: 100, top: 50 }, textBlocks: [{ left: 100, top: 140, width: 1554, height: 350 }], photos: [{ left: 0, top: 520, width: 1754, height: 620 }] } as ContentLayout,
  accom1: { heading: { left: 100, top: 30 }, textBlocks: [{ left: 100, top: 550, width: 1554, height: 590 }], photos: [{ left: 100, top: 80, width: 1554, height: 440 }] } as ContentLayout,
  accom2: { heading: { left: 100, top: 30 }, textBlocks: [{ left: 100, top: 550, width: 1554, height: 590 }], photos: [{ left: 100, top: 80, width: 510, height: 440 }, { left: 620, top: 80, width: 510, height: 440 }, { left: 1140, top: 80, width: 514, height: 440 }] } as ContentLayout,
  outside: { heading: { left: 100, top: 30 }, textBlocks: [{ left: 100, top: 620, width: 1554, height: 520 }], photos: [{ left: 0, top: 70, width: 1754, height: 520 }] } as ContentLayout,
  details: { heading: { left: 100, top: 50 }, leftColumn: { left: 100, top: 140, width: 700, height: 600 }, rightColumn: { left: 880, top: 140, width: 774, height: 400 }, legalText: { left: 100, top: 1040, width: 1554, height: 120 } } as DetailsLayout,
  location: { photo: { left: 0, top: 0, width: 1754, height: 880 }, strip: { left: 0, top: 880, width: 1754, height: 360 }, addressText: { left: 100, top: 910, width: 800 }, agentText: { left: 100, top: 970, width: 800 } } as LocationLayout,
};

// 24. ART DECO - Geometric borders, gold lines, 1920s elegance
const artDeco = {
  cover: { heroImage: { left: 60, top: 60, width: 1634, height: 900 }, addressText: { left: 60, top: 1000, width: 1634, height: 60, align: 'center', fontSize: 44 }, priceLine: { left: 60, top: 1090, width: 1634, height: 35, align: 'center', fontSize: 20 }, accentLine: { left: 677, top: 1070, width: 400 }, textColorLight: false } as CoverLayout,
  overview: { heading: { left: 120, top: 80 }, priceBlock: { left: 120, top: 160, width: 600 }, statsRow: { left: 120, top: 205, width: 600 }, introText: { left: 120, top: 260, width: 600, height: 200 }, features: { left: 120, top: 490, width: 600, height: 350 }, photos: [{ left: 800, top: 80, width: 834, height: 500 }, { left: 120, top: 880, width: 760, height: 260 }, { left: 900, top: 880, width: 734, height: 260 }] } as OverviewLayout,
  situation: { heading: { left: 120, top: 80 }, textBlocks: [{ left: 120, top: 170, width: 650, height: 600 }], photos: [{ left: 830, top: 80, width: 804, height: 700 }] } as ContentLayout,
  accom1: { heading: { left: 120, top: 40 }, textBlocks: [{ left: 120, top: 580, width: 1514, height: 560 }], photos: [{ left: 120, top: 90, width: 1514, height: 460 }] } as ContentLayout,
  accom2: { heading: { left: 120, top: 40 }, textBlocks: [{ left: 120, top: 580, width: 1514, height: 560 }], photos: [{ left: 120, top: 90, width: 740, height: 460 }, { left: 880, top: 90, width: 754, height: 460 }] } as ContentLayout,
  outside: { heading: { left: 120, top: 40 }, textBlocks: [{ left: 120, top: 660, width: 1514, height: 480 }], photos: [{ left: 60, top: 80, width: 1634, height: 550 }] } as ContentLayout,
  details: { heading: { left: 120, top: 80 }, leftColumn: { left: 120, top: 170, width: 700, height: 600 }, rightColumn: { left: 900, top: 170, width: 734, height: 400 }, legalText: { left: 120, top: 1040, width: 1514, height: 120 } } as DetailsLayout,
  location: { photo: { left: 60, top: 60, width: 1634, height: 860 }, addressText: { left: 120, top: 960, width: 800 }, agentText: { left: 120, top: 1020, width: 800 } } as LocationLayout,
};

// 25-30: Final six - each inspired by distinct architectural/design movements
const scandinavianLight = {
  cover: { heroImage: { left: 200, top: 60, width: 1354, height: 700 }, addressText: { left: 200, top: 820, width: 1354, height: 60, align: 'left', fontSize: 36 }, priceLine: { left: 200, top: 910, width: 1354, height: 35, align: 'left', fontSize: 18 }, accentLine: { left: 200, top: 890, width: 100 }, textColorLight: false } as CoverLayout,
  overview: { heading: { left: 120, top: 80 }, priceBlock: { left: 120, top: 160, width: 600 }, statsRow: { left: 120, top: 205, width: 600 }, introText: { left: 120, top: 260, width: 600, height: 250 }, features: { left: 120, top: 540, width: 600, height: 350 }, photos: [{ left: 800, top: 80, width: 854, height: 550 }, { left: 800, top: 660, width: 854, height: 480 }] } as OverviewLayout,
  situation: { heading: { left: 120, top: 80 }, textBlocks: [{ left: 120, top: 170, width: 600, height: 700 }], photos: [{ left: 800, top: 80, width: 854, height: 800 }] } as ContentLayout,
  accom1: { heading: { left: 120, top: 40 }, textBlocks: [{ left: 120, top: 600, width: 1514, height: 540 }], photos: [{ left: 120, top: 90, width: 1514, height: 480 }] } as ContentLayout,
  accom2: { heading: { left: 120, top: 40 }, textBlocks: [{ left: 120, top: 600, width: 1514, height: 540 }], photos: [{ left: 120, top: 90, width: 740, height: 480 }, { left: 880, top: 90, width: 754, height: 480 }] } as ContentLayout,
  outside: { heading: { left: 120, top: 40 }, textBlocks: [{ left: 120, top: 660, width: 1514, height: 480 }], photos: [{ left: 120, top: 90, width: 1514, height: 540 }] } as ContentLayout,
  details: { heading: { left: 120, top: 80 }, leftColumn: { left: 120, top: 170, width: 700, height: 600 }, rightColumn: { left: 900, top: 170, width: 734, height: 400 }, legalText: { left: 120, top: 1040, width: 1514, height: 120 } } as DetailsLayout,
  location: { photo: { left: 200, top: 60, width: 1354, height: 800 }, addressText: { left: 200, top: 900, width: 800 }, agentText: { left: 200, top: 960, width: 800 } } as LocationLayout,
};

const brutalistRaw = {
  cover: { heroImage: { left: 0, top: 300, width: 1754, height: 940 }, overlayRect: { left: 0, top: 0, width: 1754, height: 300, fill: '__primary__' }, addressText: { left: 60, top: 60, width: 1634, height: 80, align: 'left', fontSize: 64 }, priceLine: { left: 60, top: 180, width: 800, height: 40, align: 'left', fontSize: 24 }, textColorLight: true } as CoverLayout,
  overview: { heading: { left: 60, top: 40 }, priceBlock: { left: 60, top: 120, width: 800 }, statsRow: { left: 60, top: 165, width: 1634 }, introText: { left: 60, top: 220, width: 800, height: 200 }, features: { left: 950, top: 120, width: 744, height: 350 }, photos: [{ left: 0, top: 480, width: 1754, height: 380 }, { left: 0, top: 880, width: 877, height: 320 }, { left: 877, top: 880, width: 877, height: 320 }] } as OverviewLayout,
  situation: { heading: { left: 60, top: 40 }, textBlocks: [{ left: 60, top: 130, width: 1634, height: 320 }], photos: [{ left: 0, top: 480, width: 1754, height: 720 }] } as ContentLayout,
  accom1: { heading: { left: 60, top: 20 }, textBlocks: [{ left: 60, top: 530, width: 1634, height: 610 }], photos: [{ left: 0, top: 60, width: 1754, height: 450 }] } as ContentLayout,
  accom2: { heading: { left: 60, top: 20 }, textBlocks: [{ left: 60, top: 530, width: 1634, height: 610 }], photos: [{ left: 0, top: 60, width: 585, height: 450 }, { left: 585, top: 60, width: 585, height: 450 }, { left: 1170, top: 60, width: 584, height: 450 }] } as ContentLayout,
  outside: { heading: { left: 60, top: 20 }, textBlocks: [{ left: 60, top: 620, width: 1634, height: 520 }], photos: [{ left: 0, top: 60, width: 1754, height: 530 }] } as ContentLayout,
  details: { heading: { left: 60, top: 40 }, leftColumn: { left: 60, top: 130, width: 800, height: 600 }, rightColumn: { left: 940, top: 130, width: 754, height: 400 }, legalText: { left: 60, top: 1040, width: 1634, height: 120 } } as DetailsLayout,
  location: { photo: { left: 0, top: 300, width: 1754, height: 940 }, strip: { left: 0, top: 0, width: 1754, height: 300 }, addressText: { left: 60, top: 60, width: 800 }, agentText: { left: 60, top: 120, width: 800 } } as LocationLayout,
};

const japaneseZen = {
  cover: { heroImage: { left: 350, top: 150, width: 1054, height: 650 }, addressText: { left: 350, top: 860, width: 1054, height: 60, align: 'center', fontSize: 34 }, priceLine: { left: 350, top: 950, width: 1054, height: 30, align: 'center', fontSize: 16 }, accentLine: { left: 827, top: 930, width: 100 }, textColorLight: false } as CoverLayout,
  overview: { heading: { left: 200, top: 100 }, priceBlock: { left: 200, top: 180, width: 500 }, statsRow: { left: 200, top: 225, width: 500 }, introText: { left: 200, top: 280, width: 500, height: 300 }, features: { left: 200, top: 610, width: 500, height: 350 }, photos: [{ left: 800, top: 100, width: 754, height: 500 }, { left: 800, top: 630, width: 754, height: 460 }] } as OverviewLayout,
  situation: { heading: { left: 200, top: 100 }, textBlocks: [{ left: 200, top: 190, width: 500, height: 600 }], photos: [{ left: 800, top: 100, width: 754, height: 700 }] } as ContentLayout,
  accom1: { heading: { left: 200, top: 60 }, textBlocks: [{ left: 200, top: 620, width: 1354, height: 520 }], photos: [{ left: 200, top: 120, width: 1354, height: 470 }] } as ContentLayout,
  accom2: { heading: { left: 200, top: 60 }, textBlocks: [{ left: 200, top: 620, width: 1354, height: 520 }], photos: [{ left: 200, top: 120, width: 660, height: 470 }, { left: 880, top: 120, width: 674, height: 470 }] } as ContentLayout,
  outside: { heading: { left: 200, top: 60 }, textBlocks: [{ left: 200, top: 680, width: 1354, height: 460 }], photos: [{ left: 200, top: 120, width: 1354, height: 530 }] } as ContentLayout,
  details: { heading: { left: 200, top: 100 }, leftColumn: { left: 200, top: 190, width: 600, height: 600 }, rightColumn: { left: 880, top: 190, width: 674, height: 400 }, legalText: { left: 200, top: 1040, width: 1354, height: 120 } } as DetailsLayout,
  location: { photo: { left: 350, top: 100, width: 1054, height: 750 }, addressText: { left: 350, top: 900, width: 1054 }, agentText: { left: 350, top: 960, width: 1054 } } as LocationLayout,
};

const coastalBreezy = {
  cover: { heroImage: { left: 0, top: 0, width: 1754, height: 1240 }, overlayRect: { left: 877, top: 600, width: 877, height: 640, fill: 'rgba(255,255,255,0.88)' }, addressText: { left: 917, top: 650, width: 797, height: 80, align: 'left', fontSize: 38 }, priceLine: { left: 917, top: 770, width: 797, height: 40, align: 'left', fontSize: 20 }, accentLine: { left: 917, top: 750, width: 150 }, textColorLight: false } as CoverLayout,
  overview: { heading: { left: 80, top: 60 }, priceBlock: { left: 80, top: 140, width: 700 }, statsRow: { left: 80, top: 185, width: 700 }, introText: { left: 80, top: 240, width: 700, height: 200 }, features: { left: 80, top: 470, width: 700, height: 350 }, photos: [{ left: 840, top: 60, width: 834, height: 560 }, { left: 80, top: 860, width: 800, height: 280 }, { left: 900, top: 860, width: 774, height: 280 }] } as OverviewLayout,
  situation: { heading: { left: 80, top: 60 }, textBlocks: [{ left: 80, top: 150, width: 700, height: 600 }], photos: [{ left: 840, top: 60, width: 834, height: 700 }] } as ContentLayout,
  accom1: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 580, width: 1594, height: 560 }], photos: [{ left: 0, top: 70, width: 1754, height: 480 }] } as ContentLayout,
  accom2: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 580, width: 1594, height: 560 }], photos: [{ left: 80, top: 70, width: 780, height: 480 }, { left: 880, top: 70, width: 794, height: 480 }] } as ContentLayout,
  outside: { heading: { left: 80, top: 30 }, textBlocks: [{ left: 80, top: 680, width: 1594, height: 460 }], photos: [{ left: 0, top: 70, width: 1754, height: 580 }] } as ContentLayout,
  details: { heading: { left: 80, top: 60 }, leftColumn: { left: 80, top: 150, width: 760, height: 600 }, rightColumn: { left: 920, top: 150, width: 754, height: 400 }, legalText: { left: 80, top: 1040, width: 1594, height: 120 } } as DetailsLayout,
  location: { photo: { left: 0, top: 0, width: 1754, height: 940 }, strip: { left: 0, top: 940, width: 1754, height: 300 }, addressText: { left: 80, top: 970, width: 800 }, agentText: { left: 80, top: 1030, width: 800 } } as LocationLayout,
};

const victorianHeritage = {
  cover: { heroImage: { left: 80, top: 80, width: 1594, height: 800 }, addressText: { left: 80, top: 920, width: 1594, height: 60, align: 'center', fontSize: 40 }, priceLine: { left: 80, top: 1010, width: 1594, height: 35, align: 'center', fontSize: 20 }, accentLine: { left: 727, top: 990, width: 300 }, textColorLight: false } as CoverLayout,
  overview: { heading: { left: 100, top: 70 }, priceBlock: { left: 100, top: 150, width: 700 }, statsRow: { left: 100, top: 195, width: 700 }, introText: { left: 100, top: 250, width: 700, height: 200 }, features: { left: 100, top: 480, width: 700, height: 350 }, photos: [{ left: 860, top: 70, width: 794, height: 530 }, { left: 100, top: 870, width: 770, height: 270 }, { left: 890, top: 870, width: 764, height: 270 }] } as OverviewLayout,
  situation: { heading: { left: 100, top: 70 }, textBlocks: [{ left: 100, top: 160, width: 700, height: 650 }], photos: [{ left: 860, top: 70, width: 794, height: 750 }] } as ContentLayout,
  accom1: { heading: { left: 100, top: 40 }, textBlocks: [{ left: 100, top: 580, width: 1554, height: 560 }], photos: [{ left: 80, top: 90, width: 1594, height: 460 }] } as ContentLayout,
  accom2: { heading: { left: 100, top: 40 }, textBlocks: [{ left: 100, top: 580, width: 1554, height: 560 }], photos: [{ left: 80, top: 90, width: 790, height: 460 }, { left: 890, top: 90, width: 784, height: 460 }] } as ContentLayout,
  outside: { heading: { left: 100, top: 40 }, textBlocks: [{ left: 100, top: 660, width: 1554, height: 480 }], photos: [{ left: 80, top: 90, width: 1594, height: 540 }] } as ContentLayout,
  details: { heading: { left: 100, top: 70 }, leftColumn: { left: 100, top: 160, width: 700, height: 600 }, rightColumn: { left: 880, top: 160, width: 774, height: 400 }, legalText: { left: 100, top: 1040, width: 1554, height: 120 } } as DetailsLayout,
  location: { photo: { left: 80, top: 80, width: 1594, height: 800 }, addressText: { left: 100, top: 920, width: 800 }, agentText: { left: 100, top: 980, width: 800 } } as LocationLayout,
};

const loftIndustrial = {
  cover: { heroImage: { left: 0, top: 0, width: 1754, height: 1240 }, overlayRect: { left: 0, top: 900, width: 1754, height: 340, fill: 'rgba(30,30,30,0.85)' }, addressText: { left: 60, top: 930, width: 1634, height: 70, align: 'left', fontSize: 50 }, priceLine: { left: 60, top: 1040, width: 800, height: 40, align: 'left', fontSize: 24 }, accentLine: { left: 60, top: 1020, width: 200 }, textColorLight: true } as CoverLayout,
  overview: { heading: { left: 60, top: 40 }, priceBlock: { left: 60, top: 120, width: 700 }, statsRow: { left: 60, top: 165, width: 1634 }, introText: { left: 60, top: 220, width: 700, height: 200 }, features: { left: 60, top: 450, width: 700, height: 350 }, photos: [{ left: 820, top: 40, width: 874, height: 560 }, { left: 60, top: 840, width: 820, height: 300 }, { left: 900, top: 840, width: 794, height: 300 }] } as OverviewLayout,
  situation: { heading: { left: 60, top: 40 }, textBlocks: [{ left: 60, top: 130, width: 700, height: 700 }], photos: [{ left: 820, top: 40, width: 874, height: 800 }] } as ContentLayout,
  accom1: { heading: { left: 60, top: 20 }, textBlocks: [{ left: 60, top: 550, width: 1634, height: 590 }], photos: [{ left: 0, top: 60, width: 1754, height: 460 }] } as ContentLayout,
  accom2: { heading: { left: 60, top: 20 }, textBlocks: [{ left: 60, top: 550, width: 1634, height: 590 }], photos: [{ left: 60, top: 60, width: 540, height: 460 }, { left: 620, top: 60, width: 540, height: 460 }, { left: 1180, top: 60, width: 514, height: 460 }] } as ContentLayout,
  outside: { heading: { left: 60, top: 20 }, textBlocks: [{ left: 60, top: 620, width: 1634, height: 520 }], photos: [{ left: 0, top: 60, width: 1754, height: 530 }] } as ContentLayout,
  details: { heading: { left: 60, top: 40 }, leftColumn: { left: 60, top: 130, width: 800, height: 600 }, rightColumn: { left: 940, top: 130, width: 754, height: 400 }, legalText: { left: 60, top: 1040, width: 1634, height: 120 } } as DetailsLayout,
  location: { photo: { left: 0, top: 0, width: 1754, height: 1000 }, strip: { left: 0, top: 1000, width: 1754, height: 240 }, addressText: { left: 60, top: 1030, width: 800 }, agentText: { left: 60, top: 1090, width: 800 } } as LocationLayout,
};

// ──────────────────────────────────────
// EXPORTS - lookup by variant
// ──────────────────────────────────────

const ALL = {
  'full-bleed-cinematic': cinematic,
  'swiss-grid': swissGrid,
  'kinfolk-minimalist': kinfolk,
  'split-screen': splitScreen,
  'editorial-magazine': editorial,
  'horizontal-bands': bands,
  'framed-gallery': framed,
  'sidebar-panel': sidebar,
  'dark-luxury': darkLuxury,
  'photo-mosaic': mosaic,
  'classic-two-column': twoColumn,
  'panoramic-strip': panoramic,
  'card-stack': cardStack,
  'corner-accent': cornerAccent,
  'savills-structured': savillsStructured,
  'hamptons-warm': hamptonsWarm,
  'sothebys-auction': sothebysAuction,
  'foxtons-bold': foxtonsBold,
  'country-estate': countryEstate,
  'townhouse-narrow': townhouseNarrow,
  'penthouse-dramatic': penthouseDramatic,
  'cottage-rustic': cottageRustic,
  'new-build-clean': newBuildClean,
  'art-deco': artDeco,
  'scandinavian-light': scandinavianLight,
  'brutalist-raw': brutalistRaw,
  'japanese-zen': japaneseZen,
  'coastal-breezy': coastalBreezy,
  'victorian-heritage': victorianHeritage,
  'loft-industrial': loftIndustrial,
};

export function getLayout(variant: LayoutVariant) {
  return ALL[variant];
}
