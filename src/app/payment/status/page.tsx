import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import PaymentStatusClient from './payment-status-client';
import { verifyAndSaveOrder } from '@/app/actions/orderActions';

// Loading fallback component
function LoadingState() {
  return (
    <div className="container mx-auto max-w-2xl text-center py-20 px-4">
      <div className="bg-white p-10 rounded-lg shadow-lg border flex flex-col items-center">
        <div className="animate-pulse flex flex-col items-center w-full">
          <div className="rounded-full bg-gray-200 h-16 w-16 mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="flex space-x-4 w-full justify-center">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function PaymentStatusPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get the reference from the query params
  const reference = searchParams.reference as string;
  const trxref = searchParams.trxref as string;
  
  // If we have a reference, try to verify and save the order
  if (reference || trxref) {
    const ref = reference || trxref;
    try {
      const result = await verifyAndSaveOrder(ref);
      
      if (result.success && result.orderId) {
        // Redirect to the success page with the order ID
        redirect(`/payment/success?orderId=${result.orderId}`);
      }
    } catch (error) {
      console.error('Failed to verify payment:', error);
      // Continue to show the status page with error handled by the client component
    }
  }
  
  return (
    <Suspense fallback={<LoadingState />}>
      <PaymentStatusClient />
    </Suspense>
  );
} 