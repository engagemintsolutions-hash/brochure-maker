import { getAnthropicClient, CLAUDE_MODEL } from '@/lib/anthropic';
import { buildGenerationPrompt } from './prompts';
import { PhotoAnalysis, GeneratedText } from '@/types/brochure';
import { PropertyDetails } from '@/types/property';

export async function generateDescriptions(
  photos: PhotoAnalysis[],
  property: PropertyDetails,
): Promise<GeneratedText> {
  const client = getAnthropicClient();

  const photoDescriptions = photos
    .map(
      (p) =>
        `Photo ID: ${p.id}\nRoom: ${p.roomType}\nCaption: ${p.caption}\nFeatures: ${p.features.join(', ')}\nLighting: ${p.lighting}`,
    )
    .join('\n\n');

  const propertyDetails = `
Address: ${property.address.line1}, ${property.address.city}, ${property.address.postcode}
Price: £${property.price.toLocaleString()} (${property.priceQualifier.replace(/_/g, ' ')})
Type: ${property.propertyType}
Bedrooms: ${property.bedrooms}
Bathrooms: ${property.bathrooms}
Receptions: ${property.receptions}
Tenure: ${property.tenure}
Council Tax: Band ${property.councilTaxBand}
EPC: ${property.epcRating}
${property.sqft ? `Size: ${property.sqft} sq ft` : ''}
${property.yearBuilt ? `Built: ${property.yearBuilt}` : ''}
  `.trim();

  const prompt = buildGenerationPrompt(photoDescriptions, propertyDetails);

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned) as GeneratedText;
}
