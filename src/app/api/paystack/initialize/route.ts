import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { eventId, quantity } = await request.json();
  if (!eventId || !quantity) {
    return new NextResponse('Missing eventId or quantity', { status: 400 });
  }

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('title, price, currency')
    .eq('id', eventId)
    .single();

  if (eventError || !event) {
    return new NextResponse('Event not found', { status: 404 });
  }

  const amount = Math.round(event.price * 100 * quantity); // Paystack amount is in kobo
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!paystackSecretKey) {
    console.error('Paystack secret key is not configured.');
    return new NextResponse('Server configuration error', { status: 500 });
  }

  try {
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
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
        // We will configure the callback URL and webhooks in the Paystack dashboard
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error('Paystack initialization failed:', paystackData);
      return new NextResponse(paystackData.message || 'Failed to initialize payment.', { status: 500 });
    }

    return NextResponse.json(paystackData.data);

  } catch (err) {
    const error = err as Error;
    console.error('Error initializing Paystack transaction:', error.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 