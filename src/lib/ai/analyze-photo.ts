import { getAnthropicClient, CLAUDE_MODEL } from '@/lib/anthropic';
import { PHOTO_ANALYSIS_SYSTEM, PHOTO_ANALYSIS_USER } from './prompts';
import { PhotoAnalysis } from '@/types/brochure';
import { RoomType } from '@/types/property';

interface AnalyzePhotoInput {
  id: string;
  blobUrl: string;
  filename: string;
}

export async function analyzePhoto(photo: AnalyzePhotoInput): Promise<PhotoAnalysis> {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 512,
    system: PHOTO_ANALYSIS_SYSTEM,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'url', url: photo.blobUrl },
          },
          {
            type: 'text',
            text: PHOTO_ANALYSIS_USER,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    id: photo.id,
    blobUrl: photo.blobUrl,
    filename: photo.filename,
    roomType: parsed.roomType as RoomType,
    caption: parsed.caption,
    features: parsed.features,
    lighting: parsed.lighting,
    quality: parsed.quality,
    suggestedPage: getSuggestedPage(parsed.roomType),
  };
}

function getSuggestedPage(roomType: string): number {
  const mapping: Record<string, number> = {
    exterior_front: 0,
    exterior_rear: 5,
    garden: 5,
    kitchen: 3,
    living_room: 3,
    dining_room: 3,
    bedroom: 4,
    bathroom: 4,
    hallway: 1,
    study: 3,
    utility: 6,
    garage: 5,
    aerial: 7,
    street: 7,
    other: 1,
  };
  return mapping[roomType] ?? 1;
}

export async function analyzePhotos(
  photos: AnalyzePhotoInput[],
  concurrency = 5,
): Promise<PhotoAnalysis[]> {
  const results: PhotoAnalysis[] = [];

  for (let i = 0; i < photos.length; i += concurrency) {
    const batch = photos.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((photo) =>
        analyzePhoto(photo).catch((err) => {
          console.error(`Failed to analyze ${photo.filename}:`, err);
          return {
            id: photo.id,
            blobUrl: photo.blobUrl,
            filename: photo.filename,
            roomType: 'other' as RoomType,
            caption: photo.filename.replace(/\.[^.]+$/, ''),
            features: [],
            lighting: 'natural' as const,
            quality: 'medium' as const,
            suggestedPage: 1,
          };
        }),
      ),
    );
    results.push(...batchResults);
  }

  return results;
}
