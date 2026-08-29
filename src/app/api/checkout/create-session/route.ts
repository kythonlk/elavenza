import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSessionAction } from '@/lib/actions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (authHeader ?? undefined);

    const {
      items,
      shipping_first_name,
      shipping_last_name,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_postcode,
      shipping_phone,
      email,
    } = body;

    if (!items?.length || !email || !shipping_first_name || !shipping_address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await createCheckoutSessionAction(
      {
        items,
        shipping_first_name,
        shipping_last_name,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_postcode,
        shipping_phone,
        email,
      },
      token
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      url: result.url,
      order_number: result.order_number,
      total: result.total,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
