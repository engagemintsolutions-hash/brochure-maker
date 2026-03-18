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
  | 'sidebar-panel';

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
    overlayRect: { left: 0, top: 740, width: 550, height: 500, fill: 'rgba(0,0,0,0.55)' },
    addressText: { left: 50, top: 800, width: 460, height: 70, align: 'left', fontSize: 48 },
    priceLine: { left: 50, top: 900, width: 460, height: 40, align: 'left', fontSize: 24 },
    accentLine: { left: 50, top: 880, width: 120 },
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
    panelRect: { ...cell(2, 0, 1, 1), fill: 'rgba(0,0,0,0.08)' },
    addressText: { left: 1190, top: 460, width: 525, height: 70, align: 'left', fontSize: 36 },
    priceLine: { left: 1190, top: 550, width: 525, height: 40, align: 'left', fontSize: 20 },
    accentLine: { left: 1190, top: 530, width: 200 },
    textColorLight: false,
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
    heroImage: { left: 527, top: 120, width: 700, height: 500 },
    addressText: { left: 527, top: 700, width: 700, height: 60, align: 'center', fontSize: 36 },
    priceLine: { left: 527, top: 780, width: 700, height: 35, align: 'center', fontSize: 18 },
    accentLine: { left: 777, top: 760, width: 200 },
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
    addressText: { left: 937, top: 440, width: 757, height: 70, align: 'left', fontSize: 44 },
    priceLine: { left: 937, top: 550, width: 757, height: 40, align: 'left', fontSize: 24 },
    accentLine: { left: 937, top: 520, width: 200 },
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
    heading: { left: 60, top: 60 },
    textBlocks: [{ left: 60, top: 150, width: 757, height: 1000 }],
    photos: [{ left: L, top: 0, width: L, height: 1240 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 937, top: 60 },
    textBlocks: [{ left: 937, top: 150, width: 757, height: 500 }],
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
    overlayRect: { left: 0, top: 0, width: 700, height: 1240, fill: 'rgba(0,0,0,0.65)' },
    addressText: { left: 80, top: 500, width: 560, height: 70, align: 'left', fontSize: 48 },
    priceLine: { left: 80, top: 610, width: 560, height: 40, align: 'left', fontSize: 24 },
    accentLine: { left: 80, top: 580, width: 120 },
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
    heading: { left: 80, top: 60 },
    textBlocks: [
      { left: 80, top: 740, width: 490, height: 400 },
      { left: 610, top: 740, width: 490, height: 400 },
      { left: 1140, top: 740, width: 490, height: 400 },
    ],
    photos: [{ left: 80, top: 120, width: 1594, height: 580 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 80, top: 60 },
    textBlocks: [{ left: 80, top: 750, width: 490, height: 400 }, { left: 610, top: 750, width: 1020, height: 400 }],
    photos: [{ left: 80, top: 120, width: 1020, height: 580 }, { left: 1140, top: 120, width: 534, height: 280 }, { left: 1140, top: 420, width: 534, height: 280 }],
  } as ContentLayout,
  outside: {
    heading: { left: 80, top: 60 },
    textBlocks: [{ left: 80, top: 700, width: 1594, height: 440 }],
    photos: [{ left: 0, top: 100, width: 1754, height: 560 }],
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
    heroImage: { left: 0, top: 0, width: 1754, height: 900 },
    overlayRect: { left: 0, top: 912, width: 1754, height: 328, fill: '__primary__' },
    addressText: { left: 80, top: 950, width: 1594, height: 70, align: 'center', fontSize: 54 },
    priceLine: { left: 80, top: 1050, width: 1594, height: 40, align: 'center', fontSize: 28 },
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
    textBlocks: [{ left: 577, top: 690, width: 600, height: 380 }],
    photos: [{ left: 82, top: 160, width: 1590, height: 480 }],
  } as ContentLayout,
  accom2: {
    heading: { left: 577, top: 100 },
    textBlocks: [{ left: 577, top: 950, width: 600, height: 200 }],
    photos: [{ left: 82, top: 160, width: 786, height: 420 }, { left: 888, top: 160, width: 786, height: 420 }, { left: 82, top: 600, width: 1590, height: 300 }],
  } as ContentLayout,
  outside: {
    heading: { left: 577, top: 100 },
    textBlocks: [{ left: 577, top: 810, width: 600, height: 300 }],
    photos: [{ left: 82, top: 160, width: 1590, height: 600 }],
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
    overlayRect: { left: 250, top: 840, width: 800, height: 400, fill: 'rgba(0,0,0,0.5)' },
    addressText: { left: 310, top: 880, width: 700, height: 70, align: 'left', fontSize: 44 },
    priceLine: { left: 310, top: 980, width: 700, height: 40, align: 'left', fontSize: 24 },
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
};

export function getLayout(variant: LayoutVariant) {
  return ALL[variant];
}
