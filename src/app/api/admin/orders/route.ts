import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    verifyAdminRequest(req);
    const status = req.nextUrl.searchParams.get('status');

    let sql = `
      SELECT o.id, o.order_number, o.status, o.total, o.shipping_first_name, o.shipping_last_name,
             o.shipping_city, o.shipping_state, o.created_at,
             COALESCE(u.email, '') as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
    const args: any[] = [];

    if (status && status !== 'all') {
      sql += ` WHERE o.status = $1`;
      args.push(status);
    }

    sql += ` ORDER BY o.created_at DESC`;

    const res = await query(sql, args);
    const orders = res.rows.map(o => ({
      ...o,
      total: parseFloat(o.total),
    }));

    return NextResponse.json(orders);
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : err.message.includes('Access denied') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
