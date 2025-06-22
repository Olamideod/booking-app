import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatCurrency } from '@/utils/formatCurrency';
import { Event } from '@/types';

type OrderWithEvent = {
  id: number;
  created_at: string;
  status: string;
  quantity: number;
  total_price: number;
  events: Pick<Event, 'id' | 'title' | 'date' | 'location'>[];
}

export default async function ProfilePage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the user's orders and the details of the associated event
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      status,
      quantity,
      total_price,
      events (
        id,
        title,
        date,
        location
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-dark-purple mb-8">My Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-dark-purple mb-4">Account Details</h2>
        <p className="text-lg">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-dark-purple mb-4">Order History</h2>
        {orders && orders.length > 0 ? (
          <div className="space-y-6">
            {(orders as OrderWithEvent[]).map((order) => {
              const event = order.events[0];
              if (!event) return null;
              
              return (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="text-xl font-bold text-accent-purple">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString()} - {event.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      Order Placed: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:text-right">
                    <p className="text-lg font-semibold">
                      {formatCurrency(order.total_price, 'NGN')} {/* Assuming default, adjust as needed */}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.quantity} ticket(s) - <span className="font-medium text-green-600">{order.status}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">You haven&apos;t purchased any tickets yet.</p>
        )}
      </div>
    </div>
  );
} 