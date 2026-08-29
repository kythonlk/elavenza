import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    verifyAdminRequest(req);

    const ordersRes = await query(`SELECT COUNT(*)::int as total_orders FROM orders`);
    const revRes = await query(`SELECT COALESCE(SUM(total), 0)::float as total_revenue FROM orders WHERE status != 'cancelled'`);
    const custRes = await query(`SELECT COUNT(*)::int as total_customers FROM users WHERE role = 'customer'`);
    const prodRes = await query(`SELECT COUNT(*)::int as total_products FROM products WHERE is_active = true`);

    const recentOrders = await query(`
      SELECT o.id, o.order_number, o.status, o.total, o.shipping_first_name, o.shipping_last_name, o.created_at,
             COALESCE(u.email, '') as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 6
    `);

    return NextResponse.json({
      total_orders: ordersRes.rows[0]?.total_orders || 0,
      total_revenue: revRes.rows[0]?.total_revenue || 0,
      total_customers: custRes.rows[0]?.total_customers || 0,
      total_products: prodRes.rows[0]?.total_products || 0,
      recent_orders: recentOrders.rows.map(o => ({
        ...o,
        total: parseFloat(o.total),
      })),
    });
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : err.message.includes('Access denied') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
