import { NextRequest, NextResponse } from 'next/server';
import { getCachedProducts } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const data = await getCachedProducts({
      category: featured ? '' : category,
      search,
      sort,
      order,
      limit,
      offset,
    });

    // If 'featured' filter requested, filter in memory (cache already applied)
    const products = featured
      ? data.products.filter((p: any) => p.featured)
      : data.products;

    return NextResponse.json({
      products,
      total: featured ? products.length : data.total,
      limit,
      offset,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
