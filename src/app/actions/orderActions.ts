import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

// Generate a unique verification code for tickets
function generateVerificationCode(): string {
  // Create a random 8-character alphanumeric code
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Function to verify and save an order
export async function verifyAndSaveOrder(reference: string) {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Check if the order already exists to avoid duplicates
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('payment_ref', reference)
    .single();

  if (existingOrder) {
    // Order already exists, redirect to the success page
    return { orderId: existingOrder.id, success: true };
  }

  // Verify the transaction with Paystack
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecretKey) {
    throw new Error('Paystack secret key is not configured');
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok || !data.status || data.data.status !== 'success') {
      console.error('Payment verification failed:', data);
      return { success: false, message: 'Payment verification failed' };
    }

    // Extract transaction details
    const { amount, metadata, customer } = data.data;
    
    if (!metadata || !metadata.event_id || !metadata.quantity) {
      console.error('Missing metadata in transaction:', metadata);
      return { success: false, message: 'Invalid transaction data' };
    }

    // Generate a unique verification code for the ticket
    const verification_code = generateVerificationCode();

    // Create a new order
    const newOrder = {
      user_id: user.id,
      event_id: metadata.event_id,
      quantity: metadata.quantity,
      status: 'paid',
      total_amount: amount / 100, // Convert from kobo back to main currency
      payment_provider: 'paystack',
      payment_ref: reference,
      customer_email: customer.email,
      verification_code,
    };

    const { data: order, error } = await supabase
      .from('orders')
      .insert(newOrder)
      .select()
      .single();

    if (error) {
      console.error('Failed to insert order into database:', error);
      return { success: false, message: 'Failed to save order' };
    }

    // Revalidate relevant paths
    revalidatePath('/profile/orders');
    revalidatePath('/profile');
    
    return { orderId: order.id, success: true, verification_code };
  } catch (err) {
    console.error('Error verifying payment:', err);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

// Function to get order details by ID
export async function getOrderById(orderId: number) {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      quantity,
      total_amount,
      status,
      verification_code,
      payment_ref,
      events (
        id,
        title,
        date,
        image_url,
        location,
        description
      )
    `)
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order details');
  }

  return order;
} 