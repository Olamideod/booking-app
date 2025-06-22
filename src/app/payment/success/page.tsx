import { getOrderById } from '@/app/actions/orderActions';
import { formatCurrency } from '@/utils/formatCurrency';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import TicketDownload from './ticket-download';

// The 'any' type is used here as a workaround for a persistent build error
// where PageProps is being constrained to an incorrect type on Vercel.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PaymentSuccessPage({ searchParams }: any) {
  const orderId = searchParams.orderId ? Number(searchParams.orderId) : null;
  
  if (!orderId) {
    redirect('/profile/orders');
  }
  
  try {
    // Get the order details
    const order = await getOrderById(orderId);
    
    if (!order) {
      redirect('/profile/orders');
    }
    
    // An order is for one event, so we take the first item from the 'events' array.
    const event = order.events[0];
    
    if (!event) {
      redirect('/profile/orders');
    }
    
    // Format the event date
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <div className="flex flex-col items-center mb-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 max-w-md">
              Thank you for your purchase. Your order has been confirmed and your tickets are ready.
            </p>
          </div>
          
          <div className="border-t border-b py-6 my-6">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <Image
                  src={event.image_url || '/placeholder.png'}
                  alt={event.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-gray-500 mt-1">{eventDate}</p>
                <p className="text-gray-500">{event.location}</p>
                <div className="mt-4 space-y-2">
                  <p><strong>Quantity:</strong> {order.quantity} ticket(s)</p>
                  <p><strong>Total Paid:</strong> {formatCurrency(order.total_amount, 'NGN')}</p>
                  <p><strong>Order Reference:</strong> {order.payment_ref}</p>
                  <p><strong>Verification Code:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{order.verification_code}</span></p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <TicketDownload order={order as any} event={event as any} />
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full">
              <Link
                href="/profile/orders"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors text-center"
              >
                View All Orders
              </Link>
              <Link
                href="/events"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-colors text-center"
              >
                Browse More Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching order details:', error);
    redirect('/profile/orders');
  }
} 