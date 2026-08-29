import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'elavenza-jwt-secret-change-in-production-2024';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    const res = await query(
      `SELECT o.id, o.order_number, o.status, o.subtotal, o.shipping_cost, o.tax, o.total,
              o.shipping_first_name, o.shipping_last_name, o.shipping_address,
              o.shipping_city, o.shipping_state, o.shipping_postcode, o.shipping_country,
              o.created_at
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [decoded.user_id]
    );

    const orders = res.rows.map(o => ({ ...o, total: parseFloat(o.total), subtotal: parseFloat(o.subtotal) }));

    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
