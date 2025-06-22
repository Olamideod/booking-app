/*
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
    .select('title, description, price, currency')
    .eq('id', eventId)
    .single();

  if (eventError || !event) {
    return new NextResponse('Event not found', { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${appUrl}/payment/status?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment/status?cancelled=true`,
      line_items: [
        {
          price_data: {
            currency: event.currency.toLowerCase(),
            product_data: {
              name: event.title,
              description: event.description.substring(0, 100) + '...', // Stripe has limits
            },
            unit_amount: Math.round(event.price * 100), // Amount in smallest currency unit
          },
          quantity: quantity,
        },
      ],
      metadata: {
        user_id: user.id,
        event_id: eventId,
        quantity: quantity,
      },
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (err) {
    const error = err as Error;
    console.error('Error creating Stripe session:', error.message);
    return new NextResponse(error.message, { status: 500 });
  }
}
*/ 