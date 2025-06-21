import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Instructions for Paystack Secret Key:
// 1. Go to your Paystack dashboard.
// 2. Navigate to Settings > API Keys & Webhooks.
// 3. Find your "Secret Key" (it will start with 'sk_').
// 4. Add it to your .env.local file like this:
//    PAYSTACK_SECRET_KEY=YOUR_SECRET_KEY

export async function POST(request: Request) {
  const supabase = createClient();

  // 1. Get user and request data
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { eventId, quantity } = await request.json();
  if (!eventId || !quantity) {
    return new NextResponse('Missing eventId or quantity', { status: 400 });
  }

  // 2. Fetch event details from Supabase
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('price, currency')
    .eq('id', eventId)
    .single();
  
  if (eventError || !event) {
    return new NextResponse('Event not found', { status: 404 });
  }

  // 3. Prepare Paystack transaction
  const amount = event.price * quantity * 100; // Paystack expects amount in kobo/cents
  const paystackUrl = 'https://api.paystack.co/transaction/initialize';
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY!;

  const paystackResponse = await fetch(paystackUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: user.email,
      amount,
      currency: event.currency,
      metadata: {
        user_id: user.id,
        event_id: eventId,
        quantity,
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-confirmation`,
    }),
  });

  const paystackData = await paystackResponse.json();

  if (!paystackResponse.ok) {
    return new NextResponse(JSON.stringify(paystackData), { status: paystackResponse.status });
  }

  // 4. Return authorization URL to the client
  return NextResponse.json(paystackData.data);
}