import { PageTemplate, TemplateElement } from './template-types';
import { CANVAS, BRAND, FONTS } from '@/lib/constants';
import { PhotoAnalysis, GeneratedText } from '@/types/brochure';
import { PropertyDetails } from '@/types/property';

const M = CANVAS.margin;
const W = CANVAS.width;
const H = CANVAS.height;
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

function footerBar(accentColor: string, pageNum: number): TemplateElement[] {
  return [
    {
      type: 'rect',
      name: `footer_bar_${pageNum}`,
      left: 0,
      top: H - FH,
      width: W,
      height: FH,
      fill: accentColor,
      editable: false,
      selectable: false,
    },
    {
      type: 'textbox',
      name: `footer_text_${pageNum}`,
      left: M,
      top: H - FH + 10,
      width: CW,
      height: 20,
      text: '',
      fontFamily: FONTS.body,
      fontSize: 10,
      fill: '#FFFFFF',
      textAlign: 'center',
      editable: true,
    },
  ];
}

function topAccentBar(accentColor: string, pageNum: number): TemplateElement {
  return {
    type: 'rect',
    name: `top_bar_${pageNum}`,
    left: 0,
    top: 0,
    width: W,
    height: CANVAS.topBarHeight,
    fill: accentColor,
    editable: false,
    selectable: false,
  };
}

// Page 0: Cover
export function createCoverPage(
  property: PropertyDetails,
  photos: PhotoAnalysis[],
  text: GeneratedText,
  accentColor: string,
): PageTemplate {
  const heroPhoto = photos[0];
  const address = property.address;
  const price = formatPrice(property.price, property.priceQualifier);

  const elements: TemplateElement[] = [
    // Hero image (full bleed)
    {
      type: 'image',
      name: 'cover_hero',
      left: 0,
      top: 0,
      width: W,
      height: H,
      imageUrl: heroPhoto?.blobUrl || '',
      editable: true,
    },
    // Dark overlay at bottom
    {
      type: 'rect',
      name: 'cover_overlay',
      left: 0,
      top: H - 340,
      width: W,
      height: 340,
      fill: 'rgba(0,0,0,0.55)',
      editable: false,
      selectable: false,
    },
    // Address
    {
      type: 'textbox',
      name: 'cover_address',
      left: M,
      top: H - 280,
      width: CW,
      height: 70,
      text: `${address.line1}${address.line2 ? ', ' + address.line2 : ''}`,
      fontFamily: FONTS.heading,
      fontSize: 54,
      fontWeight: '700',
      fill: '#FFFFFF',
      textAlign: 'center',
      editable: true,
    },
    // Accent line
    {
      type: 'line',
      name: 'cover_line',
      left: W / 2 - 227,
      top: H - 195,
      width: 454,
      height: 0,
      x1: 0,
      y1: 0,
      x2: 454,
      y2: 0,
      stroke: accentColor,
      strokeWidth: 2,
      editable: false,
    },
    // Price
    {
      type: 'textbox',
      name: 'cover_price',
      left: M,
      top: H - 175,
      width: CW,
      height: 40,
      text: price,
      fontFamily: FONTS.body,
      fontSize: 28,
      fontWeight: '400',
      fill: '#FFFFFF',
      textAlign: 'center',
      editable: true,
    },
    // Tagline
    {
      type: 'textbox',
      name: 'cover_tagline',
      left: M,
      top: H - 125,
      width: CW,
      height: 30,
      text: text.coverTagline || '',
      fontFamily: FONTS.body,
      fontSize: 16,
      fontStyle: 'italic',
      fill: 'rgba(255,255,255,0.8)',
      textAlign: 'center',
      editable: true,
    },
    // City / Location line
    {
      type: 'textbox',
      name: 'cover_city',
      left: M,
      top: H - 85,
      width: CW,
      height: 30,
      text: `${address.city}${address.county ? ', ' + address.county : ''}`,
      fontFamily: FONTS.body,
      fontSize: 14,
      fill: 'rgba(255,255,255,0.6)',
      textAlign: 'center',
      editable: true,
    },
  ];

  return { pageNumber: 0, name: 'Cover', backgroundColor: '#000000', elements };
}

// Page 1: Property Overview
export function createOverviewPage(
  property: PropertyDetails,
  photos: PhotoAnalysis[],
  text: GeneratedText,
  accentColor: string,
): PageTemplate {
  const price = formatPrice(property.price, property.priceQualifier);
  const features = (text.keyFeatures || []).map((f) => `•  ${f}`).join('\n');

  const elements: TemplateElement[] = [
    topAccentBar(accentColor, 1),
    // Heading
    {
      type: 'textbox',
      name: 'overview_heading',
      left: M,
      top: 50,
      width: 700,
      height: 50,
      text: 'Property Overview',
      fontFamily: FONTS.heading,
      fontSize: 36,
      fontWeight: '700',
      fill: BRAND.black,
      editable: true,
    },
    // Divider
    {
      type: 'line',
      name: 'overview_divider',
      left: M,
      top: 110,
      width: 600,
      height: 0,
      x1: 0, y1: 0, x2: 600, y2: 0,
      stroke: BRAND.lightGray,
      strokeWidth: 1,
      editable: false,
    },
    // Price
    {
      type: 'textbox',
      name: 'overview_price',
      left: M,
      top: 125,
      width: 700,
      height: 35,
      text: price,
      fontFamily: FONTS.body,
      fontSize: 22,
      fontWeight: '600',
      fill: accentColor,
      editable: true,
    },
    // Key stats row
    {
      type: 'textbox',
      name: 'overview_stats',
      left: M,
      top: 170,
      width: 700,
      height: 25,
      text: `${property.bedrooms} Bedrooms  |  ${property.bathrooms} Bathrooms  |  ${property.receptions} Receptions${property.sqft ? `  |  ${property.sqft.toLocaleString()} sq ft` : ''}`,
      fontFamily: FONTS.body,
      fontSize: 14,
      fill: BRAND.darkGray,
      editable: true,
    },
    // Intro text
    {
      type: 'textbox',
      name: 'overview_intro',
      left: M,
      top: 220,
      width: 700,
      height: 80,
      text: text.overviewIntro || '',
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 1.6,
      fill: BRAND.darkGray,
      editable: true,
    },
    // Key features
    {
      type: 'textbox',
      name: 'overview_features',
      left: M,
      top: 320,
      width: 700,
      height: 300,
      text: features,
      fontFamily: FONTS.body,
      fontSize: 13,
      lineHeight: 1.8,
      fill: BRAND.darkGray,
      editable: true,
    },
    // Large photo right
    {
      type: 'image',
      name: 'overview_photo_main',
      left: 820,
      top: 50,
      width: 854,
      height: 520,
      imageUrl: photos[0]?.blobUrl || '',
      editable: true,
    },
    // Two smaller photos bottom
    {
      type: 'image',
      name: 'overview_photo_2',
      left: M,
      top: 650,
      width: 780,
      height: 480,
      imageUrl: photos[1]?.blobUrl || '',
      editable: true,
    },
    {
      type: 'image',
      name: 'overview_photo_3',
      left: 900,
      top: 650,
      width: 780,
      height: 480,
      imageUrl: photos[2]?.blobUrl || '',
      editable: true,
    },
    // Agent contact
    {
      type: 'textbox',
      name: 'overview_agent',
      left: M,
      top: H - 80,
      width: 600,
      height: 30,
      text: property.agentName
        ? `${property.agentName}  |  ${property.agentPhone || ''}  |  ${property.agentEmail || ''}`
        : '',
      fontFamily: FONTS.body,
      fontSize: 11,
      fill: BRAND.midGray,
      editable: true,
    },
    ...footerBar(accentColor, 1),
  ];

  return { pageNumber: 1, name: 'Property Overview', backgroundColor: '#FFFFFF', elements };
}

// Page 2: The Situation
export function createSituationPage(
  photos: PhotoAnalysis[],
  text: GeneratedText,
  accentColor: string,
): PageTemplate {
  const elements: TemplateElement[] = [
    topAccentBar(accentColor, 2),
    {
      type: 'textbox',
      name: 'situation_heading',
      left: M,
      top: 50,
      width: 700,
      height: 50,
      text: 'The Situation',
      fontFamily: FONTS.heading,
      fontSize: 36,
      fontWeight: '700',
      fill: BRAND.black,
      editable: true,
    },
    {
      type: 'line',
      name: 'situation_divider',
      left: M,
      top: 110,
      width: 600,
      height: 0,
      x1: 0, y1: 0, x2: 600, y2: 0,
      stroke: BRAND.lightGray,
      strokeWidth: 1,
      editable: false,
    },
    // Location text
    {
      type: 'textbox',
      name: 'situation_text',
      left: M,
      top: 140,
      width: 760,
      height: H - 240,
      text: text.situation || '',
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 1.7,
      fill: BRAND.darkGray,
      editable: true,
    },
    // Photo right column
    {
      type: 'image',
      name: 'situation_photo',
      left: 900,
      top: 50,
      width: 774,
      height: H - 140,
      imageUrl: photos[0]?.blobUrl || '',
      editable: true,
    },
    ...footerBar(accentColor, 2),
  ];

  return { pageNumber: 2, name: 'The Situation', backgroundColor: '#FFFFFF', elements };
}

// Page 3: The Accommodation (1)
export function createAccommodation1Page(
  photos: PhotoAnalysis[],
  text: GeneratedText,
  accentColor: string,
): PageTemplate {
  const elements: TemplateElement[] = [
    topAccentBar(accentColor, 3),
    {
      type: 'textbox',
      name: 'accom1_heading',
      left: M,
      top: 50,
      width: 700,
      height: 50,
      text: 'The Accommodation',
      fontFamily: FONTS.heading,
      fontSize: 36,
      fontWeight: '700',
      fill: BRAND.black,
      editable: true,
    },
    // Hero photo
    {
      type: 'image',
      name: 'accom1_hero',
      left: M,
      top: 120,
      width: CW,
      height: 520,
      imageUrl: photos[0]?.blobUrl || '',
      editable: true,
    },
    // Description
    {
      type: 'textbox',
      name: 'accom1_text',
      left: M,
      top: 670,
      width: 760,
      height: 400,
      text: text.accommodation1 || '',
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 1.7,
      fill: BRAND.darkGray,
      editable: true,
    },
    // Second photo
    {
      type: 'image',
      name: 'accom1_photo2',
      left: 900,
      top: 670,
      width: 774,
      height: 420,
      imageUrl: photos[1]?.blobUrl || '',
      editable: true,
    },
    ...footerBar(accentColor, 3),
  ];

  return { pageNumber: 3, name: 'The Accommodation', backgroundColor: '#FFFFFF', elements };
}

// Page 4: Bedrooms & Bathrooms
export function createAccommodation2Page(
  photos: PhotoAnalysis[],
  text: GeneratedText,
  accentColor: string,
): PageTemplate {
  const elements: TemplateElement[] = [
    topAccentBar(accentColor, 4),
    {
      type: 'textbox',
      name: 'accom2_heading',
      left: M,
      top: 50,
      width: 700,
      height: 50,
      text: 'Bedrooms & Bathrooms',
      fontFamily: FONTS.heading,
      fontSize: 36,
      fontWeight: '700',
      fill: BRAND.black,
      editable: true,
    },
    // Photo left
    {
      type: 'image',
      name: 'accom2_photo1',
      left: M,
      top: 120,
      width: 820,
      height: 500,
      imageUrl: photos[0]?.blobUrl || '',
      editable: true,
    },
    // Photo right
    {
      type: 'image',
      name: 'accom2_photo2',
      left: 940,
      top: 120,
      width: 734,
      height: 500,
      imageUrl: photos[1]?.blobUrl || '',
      editable: true,
    },
    // Description
    {
      type: 'textbox',
      name: 'accom2_text',
      left: M,
      top: 660,
      width: CW,
      height: 350,
      text: text.accommodation2 || '',
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 1.7,
      fill: BRAND.darkGray,
      editable: true,
    },
    // Additional photos
    ...(photos[2]
      ? [
          {
            type: 'image' as const,
            name: 'accom2_photo3',
            left: M,
            top: 900,
            width: 500,
            height: 240,
            imageUrl: photos[2].blobUrl,
            editable: true,
          },
        ]
      : []),
    ...(photos[3]
      ? [
          {
            type: 'image' as const,
            name: 'accom2_photo4',
            left: 620,
            top: 900,
            width: 500,
            height: 240,
            imageUrl: photos[3].blobUrl,
            editable: true,
          },
        ]
      : []),
    ...footerBar(accentColor, 4),
  ];

  return { pageNumber: 4, name: 'Bedrooms & Bathrooms', backgroundColor: '#FFFFFF', elements };
}

// Page 5: Outside & Garden
export function createOutsidePage(
  photos: PhotoAnalysis[],
  text: GeneratedText,
  accentColor: string,
): PageTemplate {
  const elements: TemplateElement[] = [
    // Full-bleed hero garden photo
    {
      type: 'image',
      name: 'outside_hero',
      left: 0,
      top: 0,
      width: W,
      height: 780,
      imageUrl: photos[0]?.blobUrl || '',
      editable: true,
    },
    // White content area
    {
      type: 'rect',
      name: 'outside_bg',
      left: 0,
      top: 780,
      width: W,
      height: H - 780,
      fill: '#FFFFFF',
      editable: false,
      selectable: false,
    },
    {
      type: 'textbox',
      name: 'outside_heading',
      left: M,
      top: 810,
      width: 700,
      height: 50,
      text: 'Outside & Garden',
      fontFamily: FONTS.heading,
      fontSize: 32,
      fontWeight: '700',
      fill: BRAND.black,
      editable: true,
    },
    {
      type: 'textbox',
      name: 'outside_text',
      left: M,
      top: 870,
      width: CW,
      height: 280,
      text: text.outside || '',
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 1.7,
      fill: BRAND.darkGray,
      editable: true,
    },
    ...footerBar(accentColor, 5),
  ];

  return { pageNumber: 5, name: 'Outside & Garden', backgroundColor: '#FFFFFF', elements };
}

// Page 6: Details
export function createDetailsPage(
  property: PropertyDetails,
  accentColor: string,
): PageTemplate {
  const leftDetails = [
    `Tenure: ${property.tenure.charAt(0).toUpperCase() + property.tenure.slice(1).replace(/_/g, ' ')}`,
    `Council Tax: Band ${property.councilTaxBand || 'TBC'}`,
    `EPC Rating: ${property.epcRating || 'TBC'}`,
    property.sqft ? `Approximate Size: ${property.sqft.toLocaleString()} sq ft` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const legal = `IMPORTANT NOTICE: These particulars are for guidance only and do not form any part of any contract. The details provided should not be relied upon as statements or representations of fact. All measurements are approximate and should not be relied upon. Prospective purchasers are advised to seek their own professional advice.`;

  const elements: TemplateElement[] = [
    topAccentBar(accentColor, 6),
    {
      type: 'textbox',
      name: 'details_heading',
      left: M,
      top: 50,
      width: 700,
      height: 50,
      text: 'Details',
      fontFamily: FONTS.heading,
      fontSize: 36,
      fontWeight: '700',
      fill: BRAND.black,
      editable: true,
    },
    {
      type: 'line',
      name: 'details_divider',
      left: M,
      top: 110,
      width: 600,
      height: 0,
      x1: 0, y1: 0, x2: 600, y2: 0,
      stroke: BRAND.lightGray,
      strokeWidth: 1,
      editable: false,
    },
    // Left column: property details
    {
      type: 'textbox',
      name: 'details_info',
      left: M,
      top: 140,
      width: 760,
      height: 600,
      text: leftDetails,
      fontFamily: FONTS.body,
      fontSize: 15,
      lineHeight: 1.8,
      fill: BRAND.darkGray,
      editable: true,
    },
    // Right column: services and viewing
    {
      type: 'textbox',
      name: 'details_services',
      left: 920,
      top: 140,
      width: 754,
      height: 400,
      text: 'Services\nAll mains services are connected.\n\nViewing\nStrictly by appointment through the sole agents.',
      fontFamily: FONTS.body,
      fontSize: 15,
      lineHeight: 1.8,
      fill: BRAND.darkGray,
      editable: true,
    },
    // Legal disclaimer
    {
      type: 'textbox',
      name: 'details_legal',
      left: M,
      top: H - 200,
      width: CW,
      height: 120,
      text: legal,
      fontFamily: FONTS.body,
      fontSize: 9,
      lineHeight: 1.5,
      fill: BRAND.midGray,
      editable: true,
    },
    ...footerBar(accentColor, 6),
  ];

  return { pageNumber: 6, name: 'Details', backgroundColor: '#FFFFFF', elements };
}

// Page 7: Location
export function createLocationPage(
  property: PropertyDetails,
  photos: PhotoAnalysis[],
  accentColor: string,
): PageTemplate {
  const elements: TemplateElement[] = [
    // Full-bleed location photo
    {
      type: 'image',
      name: 'location_hero',
      left: 0,
      top: 0,
      width: W,
      height: H - 160,
      imageUrl: photos[0]?.blobUrl || '',
      editable: true,
    },
    // Bottom strip
    {
      type: 'rect',
      name: 'location_strip',
      left: 0,
      top: H - 160,
      width: W,
      height: 160,
      fill: '#FFFFFF',
      editable: false,
      selectable: false,
    },
    // Address
    {
      type: 'textbox',
      name: 'location_address',
      left: M,
      top: H - 140,
      width: 800,
      height: 40,
      text: `${property.address.line1}, ${property.address.city}, ${property.address.postcode}`,
      fontFamily: FONTS.heading,
      fontSize: 22,
      fontWeight: '600',
      fill: BRAND.black,
      editable: true,
    },
    // Agent details
    {
      type: 'textbox',
      name: 'location_agent',
      left: M,
      top: H - 90,
      width: 800,
      height: 30,
      text: property.agentName
        ? `${property.agentName}  |  ${property.agentPhone || ''}  |  ${property.agentEmail || ''}`
        : '',
      fontFamily: FONTS.body,
      fontSize: 12,
      fill: BRAND.midGray,
      editable: true,
    },
    ...footerBar(accentColor, 7),
  ];

  return { pageNumber: 7, name: 'Location', backgroundColor: '#FFFFFF', elements };
}
