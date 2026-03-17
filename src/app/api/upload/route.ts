import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No photos provided' }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        results.push({ error: `Invalid file type: ${file.name}`, filename: file.name });
        continue;
      }

      if (file.size > MAX_SIZE) {
        results.push({ error: `File too large: ${file.name}`, filename: file.name });
        continue;
      }

      const id = nanoid(12);
      const ext = file.name.split('.').pop() || 'jpg';
      const pathname = `brochure-photos/${id}.${ext}`;

      const blob = await put(pathname, file, {
        access: 'public',
        contentType: file.type,
      });

      results.push({
        id,
        blobUrl: blob.url,
        filename: file.name,
      });
    }

    return NextResponse.json({ photos: results });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
