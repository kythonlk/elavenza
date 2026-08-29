import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    verifyAdminRequest(req);
    const search = req.nextUrl.searchParams.get('search') || '';

    let sql = `
      SELECT p.id, p.name, p.slug, p.price, p.compare_price, p.sku, p.stock,
             p.featured, p.is_active, p.created_at,
             COALESCE(c.name, '') as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const args: any[] = [];

    if (search) {
      sql += ` WHERE p.name ILIKE $1 OR p.sku ILIKE $1 OR c.name ILIKE $1`;
      args.push(`%${search}%`);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const res = await query(sql, args);
    const products = res.rows.map(p => ({
      ...p,
      price: parseFloat(p.price),
      compare_price: p.compare_price ? parseFloat(p.compare_price) : null,
    }));

    return NextResponse.json(products);
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : err.message.includes('Access denied') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyAdminRequest(req);
    const body = await req.json();

    const imagesArray = Array.isArray(body.images) && body.images.length > 0
      ? body.images
      : ['/images/prod-lavender.jpg'];

    const res = await query(`
      INSERT INTO products (
        name, slug, description, short_desc, price, compare_price,
        sku, stock, category_id, images, featured, is_active,
        weight, volume_ml, meta_title, meta_description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id
    `, [
      body.name, body.slug, body.description, body.short_desc, body.price, body.compare_price || null,
      body.sku, body.stock, body.category_id || null, imagesArray, body.featured || false, body.is_active !== false,
      body.weight || 0, body.volume_ml || 0, body.meta_title || body.name, body.meta_description || body.short_desc,
    ]);

    return NextResponse.json({ id: res.rows[0].id, message: 'Product created successfully' }, { status: 201 });
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : err.message.includes('Access denied') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
