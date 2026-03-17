export const BRAND = {
  accent: '#D50032',
  black: '#1A1A1A',
  darkGray: '#4A4A4A',
  midGray: '#8C8C8C',
  lightGray: '#E5E5E5',
  offWhite: '#F7F7F7',
  white: '#FFFFFF',
} as const;

export const FONTS = {
  heading: 'Playfair Display',
  body: 'Inter',
} as const;

// A4 landscape at 150 DPI for screen editing
export const CANVAS = {
  width: 1754,
  height: 1240,
  exportScale: 2, // 2x for 300 DPI export
  margin: 80,
  contentWidth: 1594, // width - 2 * margin
  contentHeight: 1080, // height - 2 * margin
  footerHeight: 40,
  topBarHeight: 8,
  columnGap: 40,
} as const;

export const PAGE_NAMES = [
  'Cover',
  'Property Overview',
  'The Situation',
  'The Accommodation',
  'Bedrooms & Bathrooms',
  'Outside & Garden',
  'Details',
  'Location',
] as const;

export const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
} as const;

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_PHOTOS = 30;

export const ROOM_TYPE_LABELS: Record<string, string> = {
  exterior_front: 'Front Exterior',
  exterior_rear: 'Rear Exterior',
  garden: 'Garden',
  kitchen: 'Kitchen',
  living_room: 'Living Room',
  dining_room: 'Dining Room',
  bedroom: 'Bedroom',
  bathroom: 'Bathroom',
  hallway: 'Hallway',
  study: 'Study',
  utility: 'Utility',
  garage: 'Garage',
  aerial: 'Aerial View',
  street: 'Street View',
  other: 'Other',
};
