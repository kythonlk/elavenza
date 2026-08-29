import { NextResponse } from 'next/server';
import { getCachedCategories } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCachedCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

