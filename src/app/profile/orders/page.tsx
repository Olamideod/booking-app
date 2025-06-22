import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/utils/formatCurrency';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Event } from '@/types';
import { Ticket } from 'lucide-react';

// Define a more specific type for the order based on the query
type OrderWithEvent = {
  id: number;
  created_at: string;
  quantity: number;
  total_amount: number;
  status: string;
  verification_code: string;
  events: Pick<Event, 'id' | 'title' | 'date' | 'image_url' | 'location'>[] | null;
};

export default async function MyOrdersPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?error=unauthenticated');
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      created_at,
      quantity,
      total_amount,
      status,
      verification_code,
      events (
        id,
        title,
        date,
        image_url,
        location
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    // Optionally, render an error message to the user
  }

  // Helper to safely get the event object
  const getEvent = (order: OrderWithEvent) => {
    if (!order.events) return null;
    return Array.isArray(order.events) ? order.events[0] : order.events;
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders && orders.length > 0 ? (
          orders.map(order => {
            const event = getEvent(order as OrderWithEvent);
            return (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <Image
                  src={event?.image_url || '/placeholder.png'}
                  alt={event?.title || 'Event Image'}
                  width={128}
                  height={128}
                  className="w-full sm:w-32 h-32 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <h2 className="text-xl font-bold text-dark-purple">{event?.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {event?.date ? new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'Date not available'}
                  </p>
                  <p className="text-sm text-gray-500">{event?.location}</p>
                  <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Total Paid:</strong> {formatCurrency(order.total_amount || 0, 'NGN')}</p>
                    <p><strong>Status:</strong> <span className="font-semibold capitalize px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{order.status}</span></p>
                    {order.verification_code && (
                      <p><strong>Verification Code:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{order.verification_code}</span></p>
                    )}
                  </div>
                </div>
                <div className="self-center flex flex-col space-y-2">
                  <Link 
                    href={`/payment/success?orderId=${order.id}`}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all"
                  >
                    <Ticket size={16} />
                    View Ticket
                  </Link>
                  <Link 
                    href={`/events/${event?.id}`} 
                    className="px-4 py-2 bg-accent-purple text-white text-sm font-semibold rounded-lg shadow-md hover:bg-accent-purple/90 transition-all"
                  >
                    View Event
                  </Link>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold">You have no orders yet.</h2>
            <p className="text-gray-500 mt-2">Go find an event to attend!</p>
            <Link href="/events" className="mt-4 inline-block px-6 py-3 bg-accent-purple text-white font-semibold rounded-lg shadow-md hover:bg-accent-purple/90 transition-all">
              Browse Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 