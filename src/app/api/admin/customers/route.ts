import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    verifyAdminRequest(req);

    const res = await query(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at,
             COUNT(o.id)::int as order_count,
             COALESCE(SUM(o.total), 0)::float as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    return NextResponse.json(res.rows);
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : err.message.includes('Access denied') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
