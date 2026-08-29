import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdminRequest(req);
    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    await query(`UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`, [status, id]);
    return NextResponse.json({ message: `Order status updated to ${status}` });
  } catch (err: any) {
    const status = err.message.includes('Unauthorized') ? 401 : err.message.includes('Access denied') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
