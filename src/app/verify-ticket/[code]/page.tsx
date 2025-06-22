import { createClient } from '@/lib/supabase/server';
import { CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function VerifyTicketPage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = params;
  const supabase = createClient();
  
  // Find the order with the verification code
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
        location
      )
    `)
    .eq('verification_code', code)
    .single();
  
  const isValid = !!order && !error;
  
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md border">
        <div className="flex flex-col items-center mb-8 text-center">
          {isValid ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h1 className="text-3xl font-bold text-green-600 mb-2">Valid Ticket</h1>
              <p className="text-gray-600 max-w-md">
                This ticket is valid and can be used for entry.
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h1 className="text-3xl font-bold text-red-600 mb-2">Invalid Ticket</h1>
              <p className="text-gray-600 max-w-md">
                This ticket is invalid or could not be found.
              </p>
            </>
          )}
        </div>
        
        {isValid && order && order.events && (
          <div className="border-t border-b py-6 my-6">
            <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <Image
                  src={order.events.image_url || '/placeholder.png'}
                  alt={order.events.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold">{order.events.title}</h3>
                <p className="text-gray-500 mt-1">
                  {new Date(order.events.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-gray-500">{order.events.location}</p>
                <div className="mt-4 space-y-2">
                  <p><strong>Quantity:</strong> {order.quantity} ticket(s)</p>
                  <p><strong>Verification Code:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{order.verification_code}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 