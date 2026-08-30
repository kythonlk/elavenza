import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'elavenza-jwt-secret-change-in-production-2024';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { id } = await params;
    const orderId = parseInt(id);

    const orderRes = await query(
      `SELECT o.id, o.order_number, o.status, o.subtotal, o.shipping_cost, o.tax, o.total,
              o.shipping_first_name, o.shipping_last_name, o.shipping_address,
              o.shipping_city, o.shipping_state, o.shipping_postcode, o.shipping_country,
              o.created_at
       FROM orders o
       WHERE o.id = $1 AND o.user_id = $2`,
      [orderId, decoded.user_id]
    );

    if (orderRes.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const itemsRes = await query(
      `SELECT id, product_name, variant_name, quantity, unit_price, total_price
       FROM order_items WHERE order_id = $1`,
      [orderId]
    );

    const order = {
      ...orderRes.rows[0],
      total: parseFloat(orderRes.rows[0].total),
      subtotal: parseFloat(orderRes.rows[0].subtotal),
      shipping_cost: parseFloat(orderRes.rows[0].shipping_cost),
      tax: parseFloat(orderRes.rows[0].tax),
      items: itemsRes.rows.map(i => ({
        ...i,
        unit_price: parseFloat(i.unit_price),
        total_price: parseFloat(i.total_price),
      })),
    };

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
