import { supabase, isSupabaseConfigured } from './client';
import { Brochure } from '@/types/brochure';

export interface SavedBrochureRow {
  id: string;
  data: object;
  created_at: string;
  updated_at: string;
}

/**
 * Save a brochure to Supabase. Falls back to sessionStorage if Supabase isn't configured.
 */
export async function saveBrochure(brochure: {
  id: string;
  propertyDetails: object;
  photos: object[];
  generatedText: object;
  pages: object[];
  accentColor: string;
}): Promise<{ ok: boolean; error?: string }> {
  // Always save to sessionStorage as a local backup
  sessionStorage.setItem(`brochure-${brochure.id}`, JSON.stringify(brochure));

  if (!isSupabaseConfigured || !supabase) {
    return { ok: true };
  }

  const { error } = await supabase
    .from('brochures')
    .upsert({
      id: brochure.id,
      data: brochure,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Supabase save failed:', error);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/**
 * Load a brochure. Tries Supabase first, falls back to sessionStorage.
 */
export async function loadBrochure(id: string): Promise<Brochure | null> {
  // Try sessionStorage first (faster, works offline)
  const stored = sessionStorage.getItem(`brochure-${id}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // corrupted, try supabase
    }
  }

  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('brochures')
    .select('data')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  // Cache in sessionStorage
  const brochureData = data.data as unknown as Brochure;
  sessionStorage.setItem(`brochure-${id}`, JSON.stringify(brochureData));
  return brochureData;
}

/**
 * List all brochures. Combines Supabase + sessionStorage.
 */
export async function listBrochures(): Promise<{
  id: string;
  address: string;
  price: string;
  photoCount: number;
  updatedAt?: string;
}[]> {
  const brochures = new Map<string, {
    id: string;
    address: string;
    price: string;
    photoCount: number;
    updatedAt?: string;
  }>();

  // Gather from sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (!key?.startsWith('brochure-')) continue;

    try {
      const data = JSON.parse(sessionStorage.getItem(key) || '');
      const id = key.replace('brochure-', '');
      const address = data.propertyDetails?.address?.line1 || 'Untitled';
      const city = data.propertyDetails?.address?.city;
      const price = data.propertyDetails?.price
        ? `£${Number(data.propertyDetails.price).toLocaleString()}`
        : '';

      brochures.set(id, {
        id,
        address: city ? `${address}, ${city}` : address,
        price,
        photoCount: data.photos?.length || 0,
      });
    } catch {
      // skip
    }
  }

  // Merge from Supabase if available
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('brochures')
      .select('id, data, updated_at')
      .order('updated_at', { ascending: false });

    if (!error && data) {
      for (const row of data) {
        const d = row.data as Record<string, unknown>;
        const pd = d?.propertyDetails as Record<string, unknown> | undefined;
        const addr = pd?.address as Record<string, string> | undefined;
        const id = row.id;

        if (!brochures.has(id)) {
          brochures.set(id, {
            id,
            address: addr ? `${addr.line1 || 'Untitled'}${addr.city ? ', ' + addr.city : ''}` : 'Untitled',
            price: pd?.price ? `£${Number(pd.price).toLocaleString()}` : '',
            photoCount: Array.isArray(d?.photos) ? d.photos.length : 0,
            updatedAt: row.updated_at,
          });
        }
      }
    }
  }

  return Array.from(brochures.values());
}

/**
 * Delete a brochure from both sessionStorage and Supabase.
 */
export async function deleteBrochure(id: string): Promise<void> {
  sessionStorage.removeItem(`brochure-${id}`);

  if (isSupabaseConfigured && supabase) {
    await supabase.from('brochures').delete().eq('id', id);
  }
}
