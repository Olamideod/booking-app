import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface PaymentConfirmationProps {
  searchParams?: Promise<{
    reference?: string;
    success?: string;
    cancelled?: string;
  }>;
}

export default async function PaymentConfirmationPage({ searchParams }: PaymentConfirmationProps) {
  const params = searchParams ? await searchParams : {};
  const reference = params.reference;
  const success = params.success === 'true';
  const cancelled = params.cancelled === 'true';

  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/?error=unauthenticated');
  }

  if (!reference && !success && !cancelled) {
    redirect('/events');
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md border text-center">
        {success ? (
          <>
            <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
            <p className="mb-6">
              Thank you for your purchase. Your payment has been processed successfully.
            </p>
            <p className="mb-6">
              You can view your order details in your profile.
            </p>
          </>
        ) : cancelled ? (
          <>
            <h1 className="text-3xl font-bold mb-4 text-amber-600">Payment Cancelled</h1>
            <p className="mb-6">
              Your payment was cancelled. No charges were made.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">Payment Confirmation</h1>
            <p className="mb-6">
              We&apos;re processing your payment. Please wait a moment...
            </p>
          </>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/events" 
            className="btn-secondary"
          >
            Browse More Events
          </Link>
          <Link 
            href="/profile/orders" 
            className="btn-primary"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
} 