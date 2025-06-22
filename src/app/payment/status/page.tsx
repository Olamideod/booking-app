import { Suspense } from 'react';
import PaymentStatusClient from './payment-status-client';

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

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PaymentStatusClient />
    </Suspense>
  );
} 