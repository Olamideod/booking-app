import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY!;
  
  // 1. Verify the webhook signature
  const body = await request.text();
  const signature = request.headers.get('x-paystack-signature');
  
  const hash = crypto
    .createHmac('sha512', paystackSecretKey)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    console.warn('Paystack signature mismatch. Unauthorized.');
    return new NextResponse('Signature mismatch', { status: 401 });
  }

  // 2. Parse the event data
  const event = JSON.parse(body);

  // 3. Check for successful charge and create order
  if (event.event === 'charge.success') {
    const { user_id, event_id, quantity } = event.data.metadata;
    const amount = event.data.amount / 100; // Convert from kobo to main currency unit

    if (!user_id || !event_id || !quantity) {
      console.error('Webhook metadata is missing required fields.', event.data.metadata);
      return new NextResponse('Webhook metadata missing', { status: 400 });
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id,
          event_id,
          quantity,
          status: 'confirmed',
          total_price: amount,
        });

      if (error) {
        console.error('Error creating order in Supabase:', error);
        return new NextResponse(`Supabase error: ${error.message}`, { status: 500 });
      }

      // TODO: Email confirmation logic
      // You can trigger a Supabase Edge Function or use a service like Resend/SendGrid
      // to send a confirmation email to the user.
      // Example: await sendConfirmationEmail(event.data.customer.email, event_id);

    } catch (e) {
      const error = e as Error;
      console.error('An unexpected error occurred:', error.message);
      return new NextResponse(`Unexpected error: ${error.message}`, { status: 500 });
    }
  }

  // 4. Acknowledge receipt of the webhook
  return NextResponse.json({ status: 'success' });
} 