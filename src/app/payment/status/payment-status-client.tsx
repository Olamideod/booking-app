'use client';

import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentStatusClient() {
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const trxref = searchParams?.get('trxref');

  let title = 'Payment Status';
  let message = 'Your payment status is being confirmed. Please wait.';
  let icon = <AlertTriangle className="w-16 h-16 text-yellow-500" />;

  // Paystack often uses 'success' in the status query for successful card transactions,
  // but relying on the trxref is more robust. The presence of a trxref implies an attempt was made.
  // The ultimate source of truth is the webhook, but this provides immediate user feedback.
  if (trxref) {
    title = 'Payment Successful!';
    message = 'Your payment has been successfully processed. You will receive a confirmation email shortly. Your order is being confirmed.';
    icon = <CheckCircle className="w-16 h-16 text-green-500" />;
  }

  // You can add more specific checks if Paystack returns other statuses like 'cancelled' or 'failed'
  if (status === 'cancelled') {
    title = 'Payment Cancelled';
    message = 'Your payment was cancelled. You have not been charged.';
    icon = <XCircle className="w-16 h-16 text-red-500" />;
  }

  return (
    <div className="container mx-auto max-w-2xl text-center py-20 px-4">
      <div className="bg-white p-10 rounded-lg shadow-lg border flex flex-col items-center">
        <div className="mb-6">{icon}</div>
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600 mb-8 max-w-md">{message}</p>
        <div className="flex space-x-4">
          <Link
            href="/profile/orders"
            className="btn-primary"
          >
            View My Orders
          </Link>
          <Link
            href="/events"
            className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-300 transition-all"
          >
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
} 