import { NextRequest, NextResponse } from 'next/server';
import { analyzePhotos } from '@/lib/ai/analyze-photo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photos } = body;

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json({ error: 'No photos provided' }, { status: 400 });
    }

    const results = await analyzePhotos(photos);

    return NextResponse.json({ analyses: results });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
