import { NextRequest, NextResponse } from 'next/server';
import { rewriteBlock } from '@/lib/ai/rewrite-block';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, instruction } = body;

    if (!text || !instruction) {
      return NextResponse.json(
        { error: 'Text and instruction are required' },
        { status: 400 },
      );
    }

    const rewritten = await rewriteBlock(text, instruction);

    return NextResponse.json({ text: rewritten });
  } catch (error) {
    console.error('Rewrite error:', error);
    return NextResponse.json({ error: 'Rewrite failed' }, { status: 500 });
  }
}
