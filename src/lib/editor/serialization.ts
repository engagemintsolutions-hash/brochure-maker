import { BrochurePage } from '@/types/brochure';

export function serializeBrochurePages(pages: BrochurePage[]): string {
  return JSON.stringify(pages);
}

export function deserializeBrochurePages(json: string): BrochurePage[] {
  return JSON.parse(json);
}

export function getPageSummary(canvasJson: object): { textCount: number; imageCount: number } {
  const data = canvasJson as { objects?: Array<{ type: string }> };
  const objects = data.objects || [];

  return {
    textCount: objects.filter((o) => o.type === 'Textbox').length,
    imageCount: objects.filter((o) => o.type === 'Image').length,
  };
}
