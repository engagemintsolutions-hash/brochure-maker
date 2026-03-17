import { PhotoAnalysis } from '@/types/brochure';

export interface PagePhotoAssignment {
  pageIndex: number;
  photos: PhotoAnalysis[];
}

export function mapPhotosToPages(photos: PhotoAnalysis[]): PagePhotoAssignment[] {
  const assignments: PagePhotoAssignment[] = Array.from({ length: 8 }, (_, i) => ({
    pageIndex: i,
    photos: [],
  }));

  const used = new Set<string>();

  const pick = (
    pageIndex: number,
    filter: (p: PhotoAnalysis) => boolean,
    max: number,
  ) => {
    const candidates = photos
      .filter((p) => !used.has(p.id) && filter(p))
      .sort((a, b) => {
        const qOrder = { high: 0, medium: 1, low: 2 };
        return qOrder[a.quality] - qOrder[b.quality];
      });

    for (const photo of candidates.slice(0, max)) {
      assignments[pageIndex].photos.push(photo);
      used.add(photo.id);
    }
  };

  // Page 0: Cover - best exterior front
  pick(0, (p) => p.roomType === 'exterior_front', 1);
  if (assignments[0].photos.length === 0) {
    pick(0, (p) => ['exterior_rear', 'aerial'].includes(p.roomType), 1);
  }

  // Page 1: Property Overview - mix of best interior shots
  pick(1, (p) => ['living_room', 'kitchen', 'hallway'].includes(p.roomType), 3);

  // Page 2: The Situation - street or aerial view
  pick(2, (p) => ['street', 'aerial'].includes(p.roomType), 1);
  if (assignments[2].photos.length === 0) {
    pick(2, (p) => p.roomType === 'exterior_front', 1);
  }

  // Page 3: Accommodation 1 - kitchen, living, dining
  pick(3, (p) => ['kitchen', 'dining_room', 'living_room', 'study'].includes(p.roomType), 3);

  // Page 4: Accommodation 2 - bedrooms, bathrooms
  pick(4, (p) => ['bedroom', 'bathroom'].includes(p.roomType), 4);

  // Page 5: Outside & Garden
  pick(5, (p) => ['garden', 'exterior_rear'].includes(p.roomType), 2);
  if (assignments[5].photos.length === 0) {
    pick(5, (p) => p.roomType === 'exterior_front', 1);
  }

  // Page 6: Details - no photos typically
  // Page 7: Location - aerial or street
  pick(7, (p) => ['aerial', 'street'].includes(p.roomType), 1);

  // Assign remaining photos to pages that could use more
  const remaining = photos.filter((p) => !used.has(p.id));
  for (const photo of remaining) {
    const targetPage = photo.suggestedPage;
    if (assignments[targetPage].photos.length < 4) {
      assignments[targetPage].photos.push(photo);
      used.add(photo.id);
    }
  }

  return assignments;
}
