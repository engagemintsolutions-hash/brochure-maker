import type { LayoutVariant } from './layout-variants';

export interface BrochureTemplate {
  id: string;
  name: string;
  layoutVariant: LayoutVariant;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundAlt: string;
    text: string;
    textLight: string;
    headingColor: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  style: {
    headingWeight: string;
    headingCase: 'none' | 'uppercase' | 'capitalize';
    footerStyle: 'solid' | 'thin-line' | 'none';
    topBarStyle: 'solid' | 'thin-line' | 'none';
    coverOverlay: 'dark' | 'light' | 'gradient-bottom' | 'none';
    coverTextPosition: 'bottom-center' | 'bottom-left' | 'center' | 'top-left';
    imageFrameStyle: 'none' | 'thin-border';
    imageBorderRadius: number;
    dividerStyle: 'line' | 'accent-block' | 'none';
  };
  preview: {
    thumbnail: string;
  };
}

export const templates: BrochureTemplate[] = [
  {
    id: 'full-bleed-cinematic',
    name: 'Cinematic',
    layoutVariant: 'full-bleed-cinematic',
    description: 'Full-bleed photos on every page with text on overlay panels. Maximum visual impact.',
    colors: {
      primary: '#0D0D0D', secondary: '#C8A96E', accent: '#C8A96E',
      background: '#111111', backgroundAlt: '#1A1A1A',
      text: '#E8E8E8', textLight: '#999999', headingColor: '#FFFFFF',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    style: {
      headingWeight: '400', headingCase: 'none',
      footerStyle: 'none', topBarStyle: 'none',
      coverOverlay: 'dark', coverTextPosition: 'bottom-left',
      imageFrameStyle: 'none', imageBorderRadius: 0, dividerStyle: 'none',
    },
    preview: { thumbnail: 'linear-gradient(135deg, #0D0D0D 40%, #C8A96E)' },
  },
  {
    id: 'swiss-grid',
    name: 'Swiss Grid',
    layoutVariant: 'swiss-grid',
    description: 'Strict 3x3 modular grid. Content snaps to cells. Structured and rational.',
    colors: {
      primary: '#1A1A1A', secondary: '#DD3333', accent: '#DD3333',
      background: '#FFFFFF', backgroundAlt: '#F5F5F5',
      text: '#1A1A1A', textLight: '#666666', headingColor: '#1A1A1A',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    style: {
      headingWeight: '700', headingCase: 'uppercase',
      footerStyle: 'thin-line', topBarStyle: 'none',
      coverOverlay: 'none', coverTextPosition: 'bottom-left',
      imageFrameStyle: 'none', imageBorderRadius: 0, dividerStyle: 'line',
    },
    preview: { thumbnail: 'linear-gradient(135deg, #1A1A1A 40%, #DD3333)' },
  },
  {
    id: 'kinfolk-minimalist',
    name: 'Kinfolk',
    layoutVariant: 'kinfolk-minimalist',
    description: 'Maximum white space. Small offset photos. Narrow text column. Calm and expensive.',
    colors: {
      primary: '#2C2C2C', secondary: '#8B7355', accent: '#8B7355',
      background: '#FFFFFF', backgroundAlt: '#FAF8F5',
      text: '#2C2C2C', textLight: '#8B8B8B', headingColor: '#2C2C2C',
    },
    fonts: { heading: 'Playfair Display', body: 'Playfair Display' },
    style: {
      headingWeight: '300', headingCase: 'none',
      footerStyle: 'thin-line', topBarStyle: 'none',
      coverOverlay: 'none', coverTextPosition: 'center',
      imageFrameStyle: 'none', imageBorderRadius: 0, dividerStyle: 'none',
    },
    preview: { thumbnail: 'linear-gradient(135deg, #FFFFFF 60%, #8B7355)' },
  },
  {
    id: 'split-screen',
    name: 'Split Screen',
    layoutVariant: 'split-screen',
    description: 'Every page split vertically. Photo one side, text the other. Alternating.',
    colors: {
      primary: '#002349', secondary: '#917035', accent: '#917035',
      background: '#F6F1F1', backgroundAlt: '#EDE8E4',
      text: '#002349', textLight: '#5A6B7D', headingColor: '#002349',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    style: {
      headingWeight: '400', headingCase: 'none',
      footerStyle: 'thin-line', topBarStyle: 'none',
      coverOverlay: 'none', coverTextPosition: 'bottom-left',
      imageFrameStyle: 'none', imageBorderRadius: 0, dividerStyle: 'accent-block',
    },
    preview: { thumbnail: 'linear-gradient(90deg, #555 50%, #F6F1F1 50%)' },
  },
  {
    id: 'editorial-magazine',
    name: 'Editorial',
    layoutVariant: 'editorial-magazine',
    description: 'Magazine spreads with multi-column text, mixed photo sizes, editorial feel.',
    colors: {
      primary: '#003366', secondary: '#DD3333', accent: '#DD3333',
      background: '#FFFFFF', backgroundAlt: '#F7F7F7',
      text: '#242424', textLight: '#666666', headingColor: '#003366',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    style: {
      headingWeight: '700', headingCase: 'none',
      footerStyle: 'solid', topBarStyle: 'solid',
      coverOverlay: 'dark', coverTextPosition: 'bottom-left',
      imageFrameStyle: 'none', imageBorderRadius: 0, dividerStyle: 'accent-block',
    },
    preview: { thumbnail: 'linear-gradient(135deg, #003366 40%, #DD3333)' },
  },
  {
    id: 'horizontal-bands',
    name: 'Horizontal Bands',
    layoutVariant: 'horizontal-bands',
    description: 'Full-width strips stacked with accent dividers. Strong horizontal rhythm.',
    colors: {
      primary: '#1C1C1C', secondary: '#E07A5F', accent: '#E07A5F',
      background: '#FFFFFF', backgroundAlt: '#F5F5F0',
      text: '#1C1C1C', textLight: '#6B6B6B', headingColor: '#1C1C1C',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    style: {
      headingWeight: '600', headingCase: 'uppercase',
      footerStyle: 'none', topBarStyle: 'none',
      coverOverlay: 'dark', coverTextPosition: 'bottom-center',
      imageFrameStyle: 'none', imageBorderRadius: 0, dividerStyle: 'line',
    },
    preview: { thumbnail: 'linear-gradient(180deg, #555 40%, #E07A5F 40%, #E07A5F 43%, #FFF 43%)' },
  },
  {
    id: 'framed-gallery',
    name: 'Gallery Frame',
    layoutVariant: 'framed-gallery',
    description: 'Wide border mat on every page. Keylined photos. Centred text. Exhibition feel.',
    colors: {
      primary: '#2C1810', secondary: '#8B7355', accent: '#8B7355',
      background: '#FFFEF8', backgroundAlt: '#F0EBE3',
      text: '#2C1810', textLight: '#8B7355', headingColor: '#2C1810',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    style: {
      headingWeight: '400', headingCase: 'capitalize',
      footerStyle: 'thin-line', topBarStyle: 'none',
      coverOverlay: 'none', coverTextPosition: 'center',
      imageFrameStyle: 'thin-border', imageBorderRadius: 0, dividerStyle: 'line',
    },
    preview: { thumbnail: 'linear-gradient(135deg, #F0EBE3 20%, #2C1810 20%, #2C1810 22%, #FFFEF8 22%)' },
  },
  {
    id: 'sidebar-panel',
    name: 'Sidebar',
    layoutVariant: 'sidebar-panel',
    description: 'Persistent dark sidebar with section titles. Main content area with photos and text.',
    colors: {
      primary: '#1A2744', secondary: '#C8A96E', accent: '#C8A96E',
      background: '#FFFFFF', backgroundAlt: '#F5F3F0',
      text: '#2C2C2C', textLight: '#6B6B6B', headingColor: '#1A2744',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    style: {
      headingWeight: '600', headingCase: 'none',
      footerStyle: 'none', topBarStyle: 'none',
      coverOverlay: 'dark', coverTextPosition: 'bottom-left',
      imageFrameStyle: 'none', imageBorderRadius: 0, dividerStyle: 'line',
    },
    preview: { thumbnail: 'linear-gradient(90deg, #1A2744 15%, #FFFFFF 15%)' },
  },
  {
    id: 'dark-luxury',
    name: 'Dark Luxury',
    layoutVariant: 'dark-luxury',
    description: 'Dark backgrounds with gold accents. Dramatic and exclusive. Premium feel.',
    colors: {
      primary: '#0D0D0D', secondary: '#C8A96E', accent: '#C8A96E',
      background: '#1A1A1A', backgroundAlt: '#111111',
      text: '#D4D4D4', textLight: '#888888', headingColor: '#FFFFFF',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    style: {
      headingWeight: '400', headingCase: 'none',
      footerStyle: 'thin-line', topBarStyle: 'none',
      coverOverlay: 'dark', coverTextPosition: 'center',
      imageFrameStyle: 'none', imageBorderRadius: 0, dividerStyle: 'line',
    },
    preview: { thumbnail: 'linear-gradient(135deg, #0D0D0D 50%, #C8A96E)' },
  },
  {
    id: 'photo-mosaic',
    name: 'Photo Mosaic',
    layoutVariant: 'photo-mosaic',
    description: 'Asymmetric photo collage with varying sizes. Visual impact from multiple angles.',
    colors: {
      primary: '#1B2A4A', secondary: '#C8A96E', accent: '#C8A96E',
      background: '#FFFFFF', backgroundAlt: '#F5F5F5',
      text: '#1A1A1A', textLight: '#666666', headingColor: '#1B2A4A',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    style: {
      headingWeight: '700', headingCase: 'none',
      footerStyle: 'solid', topBarStyle: 'none',
      coverOverlay: 'none', coverTextPosition: 'bottom-left',
      imageFrameStyle: 'none', imageBorderRadius: 12, dividerStyle: 'line',
    },
    preview: { thumbnail: 'linear-gradient(90deg, #888 70%, #1B2A4A 70%)' },
  },
  {
    id: 'classic-two-column',
    name: 'Classic Two Column',
    layoutVariant: 'classic-two-column',
    description: 'Traditional estate agent layout. Photo and text in balanced columns.',
    colors: {
      primary: '#2D5F2D', secondary: '#1A3A1A', accent: '#2D5F2D',
      background: '#FFFFFF', backgroundAlt: '#F5F8F5',
      text: '#2C2C2C', textLight: '#5A6B5A', headingColor: '#1A3A1A',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    style: {
      headingWeight: '700', headingCase: 'none',
      footerStyle: 'solid', topBarStyle: 'solid',
      coverOverlay: 'none', coverTextPosition: 'bottom-left',
      imageFrameStyle: 'none', imageBorderRadius: 0, dividerStyle: 'line',
    },
    preview: { thumbnail: 'linear-gradient(180deg, #888 72%, #FFFFFF 72%)' },
  },
  {
    id: 'panoramic-strip',
    name: 'Panoramic',
    layoutVariant: 'panoramic-strip',
    description: 'Wide panoramic photo strips with text between. Cinematic landscape feel.',
    colors: {
      primary: '#2F3640', secondary: '#C87533', accent: '#C87533',
      background: '#FFFFFF', backgroundAlt: '#F5F5F5',
      text: '#2F3640', textLight: '#7F8C8D', headingColor: '#2F3640',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    style: {
      headingWeight: '600', headingCase: 'uppercase',
      footerStyle: 'thin-line', topBarStyle: 'none',
      coverOverlay: 'dark', coverTextPosition: 'top-left',
      imageFrameStyle: 'none', imageBorderRadius: 0, dividerStyle: 'line',
    },
    preview: { thumbnail: 'linear-gradient(180deg, #2F3640 12%, #888 12%, #888 55%, #FFF 55%)' },
  },
  {
    id: 'card-stack',
    name: 'Card Stack',
    layoutVariant: 'card-stack',
    description: 'Content on floating cards with rounded corners. Modern app-like feel.',
    colors: {
      primary: '#6B207D', secondary: '#3D1252', accent: '#6B207D',
      background: '#F0F0F0', backgroundAlt: '#E8E8E8',
      text: '#2C2C2C', textLight: '#777777', headingColor: '#3D1252',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    style: {
      headingWeight: '700', headingCase: 'none',
      footerStyle: 'none', topBarStyle: 'none',
      coverOverlay: 'none', coverTextPosition: 'bottom-left',
      imageFrameStyle: 'none', imageBorderRadius: 12, dividerStyle: 'none',
    },
    preview: { thumbnail: 'linear-gradient(135deg, #E8E8E8, #F0F0F0)' },
  },
  {
    id: 'corner-accent',
    name: 'Corner Accent',
    layoutVariant: 'corner-accent',
    description: 'Bold colour block on the left edge. Photo fills the rest. Distinctive and modern.',
    colors: {
      primary: '#8B1A1A', secondary: '#C8A96E', accent: '#C8A96E',
      background: '#FFFFFF', backgroundAlt: '#FAF5F0',
      text: '#2C2C2C', textLight: '#7A6B5D', headingColor: '#8B1A1A',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    style: {
      headingWeight: '700', headingCase: 'none',
      footerStyle: 'solid', topBarStyle: 'none',
      coverOverlay: 'none', coverTextPosition: 'bottom-left',
      imageFrameStyle: 'none', imageBorderRadius: 0, dividerStyle: 'line',
    },
    preview: { thumbnail: 'linear-gradient(90deg, #8B1A1A 17%, #888 17%)' },
  },
  // 15-30
  { id: 'savills-structured', name: 'Savills Structured', layoutVariant: 'savills-structured' as const, description: 'Uniform photo grids, structured info blocks. Professional and consistent.', colors: { primary: '#CE171E', secondary: '#FFE850', accent: '#CE171E', background: '#FFFFFF', backgroundAlt: '#F5F5F5', text: '#1A1A1A', textLight: '#555555', headingColor: '#1A1A1A' }, fonts: { heading: 'Inter', body: 'Inter' }, style: { headingWeight: '700', headingCase: 'uppercase' as const, footerStyle: 'solid' as const, topBarStyle: 'solid' as const, coverOverlay: 'none' as const, coverTextPosition: 'bottom-left' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 0, dividerStyle: 'line' as const }, preview: { thumbnail: 'linear-gradient(180deg, #888 66%, #FFF 66%)' } },
  { id: 'hamptons-warm', name: 'Hamptons Warm', layoutVariant: 'hamptons-warm' as const, description: 'Deep blue with coral accents. Warm and progressive heritage feel.', colors: { primary: '#1B2A4A', secondary: '#FF6B5A', accent: '#FF6B5A', background: '#FFFFFF', backgroundAlt: '#FFF5F3', text: '#1B2A4A', textLight: '#5A6B8A', headingColor: '#1B2A4A' }, fonts: { heading: 'Playfair Display', body: 'Inter' }, style: { headingWeight: '400', headingCase: 'none' as const, footerStyle: 'solid' as const, topBarStyle: 'solid' as const, coverOverlay: 'dark' as const, coverTextPosition: 'bottom-left' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 0, dividerStyle: 'accent-block' as const }, preview: { thumbnail: 'linear-gradient(180deg, #888 70%, #1B2A4A 70%)' } },
  { id: 'sothebys-auction', name: "Sotheby's Auction", layoutVariant: 'sothebys-auction' as const, description: 'Navy and gold on warm cream. Auction house elegance and timeless luxury.', colors: { primary: '#002349', secondary: '#917035', accent: '#917035', background: '#F6F1F1', backgroundAlt: '#EDE8E4', text: '#002349', textLight: '#5A6B7D', headingColor: '#002349' }, fonts: { heading: 'Playfair Display', body: 'Inter' }, style: { headingWeight: '400', headingCase: 'none' as const, footerStyle: 'thin-line' as const, topBarStyle: 'none' as const, coverOverlay: 'dark' as const, coverTextPosition: 'bottom-left' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 0, dividerStyle: 'accent-block' as const }, preview: { thumbnail: 'linear-gradient(135deg, #002349, #917035)' } },
  { id: 'foxtons-bold', name: 'Foxtons Bold', layoutVariant: 'foxtons-bold' as const, description: 'Teal header band, energetic layout. Bold and urban.', colors: { primary: '#017163', secondary: '#FFF000', accent: '#017163', background: '#FFFFFF', backgroundAlt: '#F5F5F5', text: '#1A1A1A', textLight: '#666666', headingColor: '#017163' }, fonts: { heading: 'Inter', body: 'Inter' }, style: { headingWeight: '700', headingCase: 'none' as const, footerStyle: 'solid' as const, topBarStyle: 'solid' as const, coverOverlay: 'dark' as const, coverTextPosition: 'top-left' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 12, dividerStyle: 'line' as const }, preview: { thumbnail: 'linear-gradient(180deg, #017163 10%, #888 10%)' } },
  { id: 'country-estate', name: 'Country Estate', layoutVariant: 'country-estate' as const, description: 'Central white panel on cover. Landscape-focused countryside feel.', colors: { primary: '#2D5F2D', secondary: '#8B7355', accent: '#2D5F2D', background: '#FFFFFF', backgroundAlt: '#F2F5F0', text: '#2C2C2C', textLight: '#5A6B5A', headingColor: '#1A3A1A' }, fonts: { heading: 'Playfair Display', body: 'Inter' }, style: { headingWeight: '400', headingCase: 'capitalize' as const, footerStyle: 'thin-line' as const, topBarStyle: 'none' as const, coverOverlay: 'light' as const, coverTextPosition: 'center' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 12, dividerStyle: 'line' as const }, preview: { thumbnail: 'linear-gradient(135deg, #888 40%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.9) 60%, #888 60%)' } },
  { id: 'townhouse-narrow', name: 'Townhouse', layoutVariant: 'townhouse-narrow' as const, description: 'Narrow left panel with tall photo columns. Vertical rhythm for period homes.', colors: { primary: '#1B5E3B', secondary: '#C8A96E', accent: '#1B5E3B', background: '#FFFFFF', backgroundAlt: '#F5F8F5', text: '#1A1A1A', textLight: '#5A7B5A', headingColor: '#1B5E3B' }, fonts: { heading: 'Playfair Display', body: 'Playfair Display' }, style: { headingWeight: '700', headingCase: 'none' as const, footerStyle: 'thin-line' as const, topBarStyle: 'none' as const, coverOverlay: 'none' as const, coverTextPosition: 'bottom-left' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 12, dividerStyle: 'line' as const }, preview: { thumbnail: 'linear-gradient(90deg, #FFF 23%, #888 23%)' } },
  { id: 'penthouse-dramatic', name: 'Penthouse', layoutVariant: 'penthouse-dramatic' as const, description: 'Centred dramatic typography over full-bleed photos. Ultra-premium.', colors: { primary: '#0D0D0D', secondary: '#C0C0C0', accent: '#C0C0C0', background: '#1A1A1A', backgroundAlt: '#111111', text: '#E8E8E8', textLight: '#999999', headingColor: '#FFFFFF' }, fonts: { heading: 'Playfair Display', body: 'Inter' }, style: { headingWeight: '300', headingCase: 'uppercase' as const, footerStyle: 'none' as const, topBarStyle: 'none' as const, coverOverlay: 'dark' as const, coverTextPosition: 'center' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 12, dividerStyle: 'none' as const }, preview: { thumbnail: 'linear-gradient(135deg, #0D0D0D 50%, #C0C0C0)' } },
  { id: 'cottage-rustic', name: 'Cottage Rustic', layoutVariant: 'cottage-rustic' as const, description: 'Warm inset photos with generous margins. Cosy country cottage feel.', colors: { primary: '#5C4033', secondary: '#8B7355', accent: '#8B7355', background: '#FBF8F3', backgroundAlt: '#F0EBE3', text: '#3C2F24', textLight: '#8B7D6B', headingColor: '#3C2F24' }, fonts: { heading: 'Playfair Display', body: 'Inter' }, style: { headingWeight: '400', headingCase: 'none' as const, footerStyle: 'thin-line' as const, topBarStyle: 'none' as const, coverOverlay: 'none' as const, coverTextPosition: 'center' as const, imageFrameStyle: 'thin-border' as const, imageBorderRadius: 12, dividerStyle: 'line' as const }, preview: { thumbnail: 'linear-gradient(135deg, #FBF8F3 30%, #5C4033 30%, #5C4033 32%, #FBF8F3 32%)' } },
  { id: 'new-build-clean', name: 'New Build', layoutVariant: 'new-build-clean' as const, description: 'Ultra-clean developer style. Bold colour band on cover. CGI-ready.', colors: { primary: '#204CE5', secondary: '#112337', accent: '#204CE5', background: '#FFFFFF', backgroundAlt: '#F0F4FF', text: '#112337', textLight: '#5A6B7D', headingColor: '#112337' }, fonts: { heading: 'Inter', body: 'Inter' }, style: { headingWeight: '700', headingCase: 'none' as const, footerStyle: 'solid' as const, topBarStyle: 'none' as const, coverOverlay: 'dark' as const, coverTextPosition: 'bottom-center' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 12, dividerStyle: 'line' as const }, preview: { thumbnail: 'linear-gradient(180deg, #888 70%, #204CE5 70%)' } },
  { id: 'art-deco', name: 'Art Deco', layoutVariant: 'art-deco' as const, description: 'Geometric borders with gold accent lines. 1920s elegance meets modern property.', colors: { primary: '#1A1A2E', secondary: '#C8A96E', accent: '#C8A96E', background: '#FFFEF8', backgroundAlt: '#F5F0E6', text: '#1A1A2E', textLight: '#6B6B8D', headingColor: '#1A1A2E' }, fonts: { heading: 'Playfair Display', body: 'Inter' }, style: { headingWeight: '400', headingCase: 'capitalize' as const, footerStyle: 'thin-line' as const, topBarStyle: 'thin-line' as const, coverOverlay: 'none' as const, coverTextPosition: 'center' as const, imageFrameStyle: 'thin-border' as const, imageBorderRadius: 0, dividerStyle: 'accent-block' as const }, preview: { thumbnail: 'linear-gradient(135deg, #FFFEF8 20%, #C8A96E 20%, #C8A96E 22%, #1A1A2E 22%)' } },
  { id: 'scandinavian-light', name: 'Scandinavian', layoutVariant: 'scandinavian-light' as const, description: 'Light and airy with wide margins. Clean Nordic simplicity.', colors: { primary: '#3D3D3D', secondary: '#B8B0A0', accent: '#B8B0A0', background: '#FAFAF8', backgroundAlt: '#F0EDE8', text: '#3D3D3D', textLight: '#8B8B8B', headingColor: '#2C2C2C' }, fonts: { heading: 'Inter', body: 'Inter' }, style: { headingWeight: '300', headingCase: 'none' as const, footerStyle: 'thin-line' as const, topBarStyle: 'none' as const, coverOverlay: 'none' as const, coverTextPosition: 'bottom-left' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 12, dividerStyle: 'line' as const }, preview: { thumbnail: 'linear-gradient(135deg, #FAFAF8, #B8B0A0)' } },
  { id: 'brutalist-raw', name: 'Brutalist', layoutVariant: 'brutalist-raw' as const, description: 'Heavy top band, oversized typography, raw concrete feel. Bold and uncompromising.', colors: { primary: '#2C2C2C', secondary: '#E07A5F', accent: '#E07A5F', background: '#F5F5F0', backgroundAlt: '#E8E8E0', text: '#2C2C2C', textLight: '#6B6B6B', headingColor: '#1A1A1A' }, fonts: { heading: 'Oswald', body: 'Inter' }, style: { headingWeight: '700', headingCase: 'uppercase' as const, footerStyle: 'none' as const, topBarStyle: 'none' as const, coverOverlay: 'dark' as const, coverTextPosition: 'top-left' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 12, dividerStyle: 'none' as const }, preview: { thumbnail: 'linear-gradient(180deg, #2C2C2C 24%, #888 24%)' } },
  { id: 'japanese-zen', name: 'Zen', layoutVariant: 'japanese-zen' as const, description: 'Centred composition with deep margins. Calm, balanced, meditative.', colors: { primary: '#2C2C2C', secondary: '#8B7355', accent: '#8B7355', background: '#FAF8F5', backgroundAlt: '#F0EDE8', text: '#2C2C2C', textLight: '#7A7268', headingColor: '#2C2C2C' }, fonts: { heading: 'Playfair Display', body: 'Inter' }, style: { headingWeight: '300', headingCase: 'none' as const, footerStyle: 'none' as const, topBarStyle: 'none' as const, coverOverlay: 'none' as const, coverTextPosition: 'center' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 12, dividerStyle: 'line' as const }, preview: { thumbnail: 'linear-gradient(135deg, #FAF8F5 40%, #888 40%, #888 60%, #FAF8F5 60%)' } },
  { id: 'coastal-breezy', name: 'Coastal', layoutVariant: 'coastal-breezy' as const, description: 'White overlay panel on photo. Light, fresh, seaside property feel.', colors: { primary: '#1A5653', secondary: '#D4A574', accent: '#D4A574', background: '#FFFFFF', backgroundAlt: '#F0F7F6', text: '#1A3330', textLight: '#5A7B78', headingColor: '#1A5653' }, fonts: { heading: 'Playfair Display', body: 'Inter' }, style: { headingWeight: '400', headingCase: 'none' as const, footerStyle: 'thin-line' as const, topBarStyle: 'none' as const, coverOverlay: 'light' as const, coverTextPosition: 'bottom-left' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 12, dividerStyle: 'line' as const }, preview: { thumbnail: 'linear-gradient(135deg, #888, rgba(255,255,255,0.8))' } },
  { id: 'victorian-heritage', name: 'Victorian', layoutVariant: 'victorian-heritage' as const, description: 'Inset photos with accent borders. Classic heritage feel for period properties.', colors: { primary: '#4A3728', secondary: '#8B7355', accent: '#4A3728', background: '#FFFEF8', backgroundAlt: '#F5F0E6', text: '#3C2F24', textLight: '#7A6B5D', headingColor: '#4A3728' }, fonts: { heading: 'Playfair Display', body: 'Playfair Display' }, style: { headingWeight: '400', headingCase: 'capitalize' as const, footerStyle: 'thin-line' as const, topBarStyle: 'thin-line' as const, coverOverlay: 'none' as const, coverTextPosition: 'center' as const, imageFrameStyle: 'thin-border' as const, imageBorderRadius: 0, dividerStyle: 'line' as const }, preview: { thumbnail: 'linear-gradient(135deg, #FFFEF8, #4A3728)' } },
  { id: 'loft-industrial', name: 'Industrial Loft', layoutVariant: 'loft-industrial' as const, description: 'Dark bottom band with bold text. Raw and urban for converted properties.', colors: { primary: '#1E1E1E', secondary: '#C87533', accent: '#C87533', background: '#F5F5F0', backgroundAlt: '#E8E8E0', text: '#1E1E1E', textLight: '#6B6B6B', headingColor: '#1E1E1E' }, fonts: { heading: 'Oswald', body: 'Inter' }, style: { headingWeight: '600', headingCase: 'uppercase' as const, footerStyle: 'none' as const, topBarStyle: 'none' as const, coverOverlay: 'dark' as const, coverTextPosition: 'bottom-left' as const, imageFrameStyle: 'none' as const, imageBorderRadius: 0, dividerStyle: 'line' as const }, preview: { thumbnail: 'linear-gradient(180deg, #888 73%, #1E1E1E 73%)' } },
];

export function getTemplateById(id: string): BrochureTemplate | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: string): BrochureTemplate[] {
  return templates; // With only 8 templates, no need for categories
}
