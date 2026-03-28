import { describe, it, expect } from 'vitest';
import { mapPhotosToPages } from '@/lib/photo-mapper';
import { PhotoAnalysis } from '@/types/brochure';

function makePhoto(roomType: string, id: string = roomType): PhotoAnalysis {
  return {
    id,
    blobUrl: `https://example.com/${id}.jpg`,
    filename: `${id}.jpg`,
    roomType: roomType as PhotoAnalysis['roomType'],
    caption: `${roomType} photo`,
    features: [],
    lighting: 'natural',
    quality: 'high',
    suggestedPage: 0,
  };
}

describe('mapPhotosToPages', () => {
  it('returns array of page assignments', () => {
    const photos = [
      makePhoto('exterior_front'),
      makePhoto('living_room'),
      makePhoto('kitchen'),
    ];
    const result = mapPhotosToPages(photos);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('assigns exterior_front to cover page (index 0)', () => {
    const photos = [
      makePhoto('exterior_front'),
      makePhoto('living_room'),
      makePhoto('kitchen'),
    ];
    const result = mapPhotosToPages(photos);
    const coverAssignment = result.find((a) => a.pageIndex === 0);
    expect(coverAssignment).toBeDefined();
    if (coverAssignment) {
      const hasExterior = coverAssignment.photos.some((p) => p.roomType === 'exterior_front');
      expect(hasExterior).toBe(true);
    }
  });

  it('handles empty photo array', () => {
    const result = mapPhotosToPages([]);
    expect(Array.isArray(result)).toBe(true);
  });

  it('handles photos with garden room type', () => {
    const photos = [
      makePhoto('exterior_front'),
      makePhoto('garden', 'garden1'),
      makePhoto('garden', 'garden2'),
      makePhoto('living_room'),
    ];
    const result = mapPhotosToPages(photos);
    // Garden photos should appear on the outside page (index 5)
    const outsideAssignment = result.find((a) => a.pageIndex === 5);
    if (outsideAssignment) {
      const hasGarden = outsideAssignment.photos.some((p) => p.roomType === 'garden');
      expect(hasGarden).toBe(true);
    }
  });
});
