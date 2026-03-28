import { PhotoAnalysis } from '@/types/brochure';

export interface PagePhotoAssignment {
  pageIndex: number;
  photos: PhotoAnalysis[];
}

/**
 * Maps photos to brochure pages by room type.
 * Priority: highest quality photos get assigned first.
 * Each page gets the right TYPE of photo (kitchen to accommodation, etc.)
 */
export function mapPhotosToPages(photos: PhotoAnalysis[]): PagePhotoAssignment[] {
  const assignments: PagePhotoAssignment[] = Array.from({ length: 8 }, (_, i) => ({
    pageIndex: i,
    photos: [],
  }));

  const used = new Set<string>();

  // Sort by quality (high first) then pick from filtered candidates
  const pick = (pageIndex: number, filter: (p: PhotoAnalysis) => boolean, max: number) => {
    const candidates = photos
      .filter((p) => !used.has(p.id) && filter(p))
      .sort((a, b) => {
        const q = { high: 0, medium: 1, low: 2 };
        return q[a.quality] - q[b.quality];
      });

    for (const photo of candidates.slice(0, max)) {
      assignments[pageIndex].photos.push(photo);
      used.add(photo.id);
    }
  };

  // ── Page 0: Cover ──
  // Best exterior front photo
  pick(0, (p) => p.roomType === 'exterior_front', 1);
  if (assignments[0].photos.length === 0) {
    pick(0, (p) => ['exterior_rear', 'aerial'].includes(p.roomType), 1);
  }

  // ── Page 1: Property Overview ──
  // Mix of highlight rooms: one living, one kitchen, one hallway/dining
  // These are the "best of" showcase photos
  pick(1, (p) => p.roomType === 'living_room', 1);
  pick(1, (p) => p.roomType === 'hallway', 1);
  pick(1, (p) => p.roomType === 'dining_room', 1);
  // If we don't have 3 yet, fill from any interior
  if (assignments[1].photos.length < 3) {
    pick(1, (p) => ['kitchen', 'study', 'living_room', 'dining_room'].includes(p.roomType), 3 - assignments[1].photos.length);
  }

  // ── Page 2: The Situation ──
  // Street scene, aerial, or exterior showing the area
  pick(2, (p) => p.roomType === 'street', 1);
  if (assignments[2].photos.length === 0) {
    pick(2, (p) => p.roomType === 'aerial', 1);
  }
  if (assignments[2].photos.length === 0) {
    pick(2, (p) => ['exterior_front', 'exterior_rear'].includes(p.roomType), 1);
  }

  // ── Page 3: Accommodation 1 (Kitchen, Living, Dining) ──
  // Kitchen first (hero), then remaining living/dining
  pick(3, (p) => p.roomType === 'kitchen', 2);
  pick(3, (p) => ['living_room', 'dining_room', 'study'].includes(p.roomType), 3);
  // Cap at 5 max
  if (assignments[3].photos.length > 5) {
    assignments[3].photos = assignments[3].photos.slice(0, 5);
  }

  // ── Page 4: Accommodation 2 (Bedrooms, Bathrooms) ──
  pick(4, (p) => p.roomType === 'bedroom', 4);
  pick(4, (p) => p.roomType === 'bathroom', 3);
  // Cap at 5 max
  if (assignments[4].photos.length > 5) {
    assignments[4].photos = assignments[4].photos.slice(0, 5);
  }

  // ── Page 5: Outside & Garden ──
  pick(5, (p) => p.roomType === 'garden', 2);
  pick(5, (p) => p.roomType === 'exterior_rear', 1);
  if (assignments[5].photos.length === 0) {
    pick(5, (p) => ['exterior_front', 'aerial'].includes(p.roomType), 1);
  }

  // ── Page 6: Details ── (no photos)

  // ── Page 7: Location ──
  pick(7, (p) => p.roomType === 'aerial', 1);
  if (assignments[7].photos.length === 0) {
    pick(7, (p) => p.roomType === 'street', 1);
  }
  if (assignments[7].photos.length === 0) {
    pick(7, (p) => ['exterior_front', 'exterior_rear'].includes(p.roomType), 1);
  }

  // ── Distribute remaining photos ──
  // Put leftover photos on pages that match their type and have room
  const remaining = photos.filter((p) => !used.has(p.id));
  const pageForType: Record<string, number[]> = {
    exterior_front: [0, 7],
    exterior_rear: [5, 7],
    garden: [5],
    kitchen: [3, 1],
    living_room: [3, 1],
    dining_room: [3, 1],
    bedroom: [4],
    bathroom: [4],
    hallway: [1, 3],
    study: [3, 4],
    utility: [3],
    garage: [5],
    aerial: [7, 2],
    street: [2, 7],
    other: [1],
  };

  for (const photo of remaining) {
    const targets = pageForType[photo.roomType] || [1];
    for (const pageIdx of targets) {
      if (assignments[pageIdx].photos.length < 5) {
        assignments[pageIdx].photos.push(photo);
        used.add(photo.id);
        break;
      }
    }
  }

  return assignments;
}
