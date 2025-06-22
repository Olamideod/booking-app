import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/admin'; // Use the admin client to bypass RLS

export async function POST(request: Request) {
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY!;
  const signature = request.headers.get('x-paystack-signature');
  
  const body = await request.text();

  const hash = crypto
    .createHmac('sha512', paystackSecret)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    console.warn('Paystack signature verification failed.');
    return new NextResponse('Signature verification failed', { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === 'charge.success') {
    const { reference, amount, customer, metadata } = event.data;
    
    // Ensure metadata exists and contains our custom fields
    if (!metadata || !metadata.user_id || !metadata.event_id || !metadata.quantity) {
      console.error('Webhook received with missing metadata:', metadata);
      // Still return 200 to acknowledge receipt, but log the error.
      return new NextResponse('Missing metadata', { status: 200 });
    }
    
    const supabaseAdmin = createClient();

    const newOrder = {
      user_id: metadata.user_id,
      event_id: metadata.event_id,
      quantity: metadata.quantity,
      status: 'paid',
      total_amount: amount / 100, // Convert from kobo back to main currency
      payment_provider: 'paystack',
      payment_ref: reference,
      customer_email: customer.email,
    };

    const { error: insertError } = await supabaseAdmin
      .from('orders')
      .insert(newOrder);

    if (insertError) {
      console.error('Failed to insert order into database:', insertError);
      // Even if DB insert fails, we must return 200 to Paystack to prevent retries
    } else {
      console.log(`Successfully created order for event ${metadata.event_id} for user ${metadata.user_id}`);
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
} 