import { NextRequest, NextResponse } from 'next/server';
import { generateDescriptions } from '@/lib/ai/generate-descriptions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photos, property } = body;

    if (!photos || !property) {
      return NextResponse.json(
        { error: 'Photos and property details are required' },
        { status: 400 },
      );
    }

    const text = await generateDescriptions(photos, property);

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Text generation failed' }, { status: 500 });
  }
}
