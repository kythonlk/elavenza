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
      `SELECT id, email, first_name, last_name, phone, role, created_at
       FROM users WHERE id = $1`,
      [decoded.user_id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (err: any) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
