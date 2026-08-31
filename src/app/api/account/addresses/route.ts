import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'elavenza-jwt-secret-change-in-production-2024';

function userId(req: NextRequest) {
  const header = req.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : header;
  if (!token) throw new Error('Unauthorized');
  const decoded = jwt.verify(token, JWT_SECRET) as { user_id?: number };
  if (!decoded.user_id) throw new Error('Unauthorized');
  return decoded.user_id;
}

export async function GET(req: NextRequest) {
  try {
    const id = userId(req);
    const result = await query('SELECT id, label, recipient_name, address_line1, address_line2, city, state, postcode, country, is_default, created_at FROM customer_addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC', [id]);
    return NextResponse.json(result.rows);
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}

export async function POST(req: NextRequest) {
  try {
    const id = userId(req);
    const body = await req.json();
    const required = ['label', 'recipient_name', 'address_line1', 'city', 'state', 'postcode'];
    if (required.some((key) => typeof body[key] !== 'string' || !body[key].trim())) return NextResponse.json({ error: 'Please complete all required address fields.' }, { status: 400 });
    if (body.is_default) await query('UPDATE customer_addresses SET is_default = FALSE WHERE user_id = $1', [id]);
    const result = await query('INSERT INTO customer_addresses (user_id, label, recipient_name, address_line1, address_line2, city, state, postcode, country, is_default) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, label, recipient_name, address_line1, address_line2, city, state, postcode, country, is_default, created_at', [id, body.label.trim(), body.recipient_name.trim(), body.address_line1.trim(), body.address_line2?.trim() || null, body.city.trim(), body.state.trim(), body.postcode.trim(), body.country?.trim() || 'Australia', Boolean(body.is_default)]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch { return NextResponse.json({ error: 'Could not save address.' }, { status: 400 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = userId(req); const addressId = new URL(req.url).searchParams.get('id');
    if (!addressId) return NextResponse.json({ error: 'Address id is required.' }, { status: 400 });
    await query('DELETE FROM customer_addresses WHERE id = $1 AND user_id = $2', [addressId, id]);
    return NextResponse.json({ message: 'Address removed.' });
  } catch { return NextResponse.json({ error: 'Could not remove address.' }, { status: 400 }); }
}
