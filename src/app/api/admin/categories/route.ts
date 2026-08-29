import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    verifyAdminRequest(req);

    const res = await query(`
      SELECT c.id, c.name, c.slug, c.description, c.image_url, c.parent_id,
             c.sort_order, c.is_active, c.created_at,
             (SELECT COUNT(*)::int FROM products WHERE category_id = c.id) as product_count
      FROM categories c
      ORDER BY c.sort_order ASC
    `);

    return NextResponse.json(res.rows);
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : err.message.includes('Access denied') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyAdminRequest(req);
    const body = await req.json();

    const res = await query(`
      INSERT INTO categories (name, slug, description, image_url, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING id
    `, [
      body.name, body.slug, body.description || '',
      body.image_url || '/images/cat-essential-oils.jpg', body.sort_order || 0,
    ]);

    return NextResponse.json({ id: res.rows[0].id, message: 'Category created successfully' }, { status: 201 });
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : err.message.includes('Access denied') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
