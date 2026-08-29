import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdminRequest(req);
    const { id } = await params;

    const res = await query(`SELECT * FROM products WHERE id = $1`, [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : err.message.includes('Access denied') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdminRequest(req);
    const { id } = await params;
    const body = await req.json();

    await query(`
      UPDATE products SET
        name = $1, slug = $2, description = $3, short_desc = $4,
        price = $5, compare_price = $6, sku = $7, stock = $8,
        category_id = $9, images = $10, featured = $11, is_active = $12,
        weight = $13, volume_ml = $14, meta_title = $15, meta_description = $16,
        updated_at = NOW()
      WHERE id = $17
    `, [
      body.name, body.slug, body.description, body.short_desc,
      body.price, body.compare_price || null, body.sku, body.stock,
      body.category_id || null, body.images || ['/images/prod-lavender.jpg'], body.featured || false, body.is_active !== false,
      body.weight || 0, body.volume_ml || 0, body.meta_title || body.name, body.meta_description || body.short_desc,
      id,
    ]);

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : err.message.includes('Access denied') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdminRequest(req);
    const { id } = await params;

    await query(`DELETE FROM products WHERE id = $1`, [id]);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : err.message.includes('Access denied') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
