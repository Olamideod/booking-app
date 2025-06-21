import { dummyEvents } from '@/lib/dummy-data';
import { formatCurrency } from '@/utils/formatCurrency';
import { notFound } from 'next/navigation';

interface EventDetailPageProps {
  params: { id: string };
}

const EventDetailPage = ({ params }: EventDetailPageProps) => {
  const event = dummyEvents.find(e => e.id === parseInt(params.id, 10));

  if (!event) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <img className="w-full h-96 object-cover" src={event.image_url} alt={event.title} />
          <div className="p-8">
            <h1 className="text-4xl font-bold text-dark-purple">{event.title}</h1>
            <p className="text-lg text-gray-500 mt-2">{new Date(event.date).toUTCString()}</p>
            <p className="text-lg text-gray-600 mt-1">{event.location}</p>
            <p className="mt-6 text-gray-700">{event.description}</p>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-dark-purple">Buy Tickets</h2>
              <div className="mt-4 flex items-center justify-between bg-light-bg p-4 rounded-lg">
                <p className="text-xl font-semibold text-accent-purple">
                  {formatCurrency(event.price, event.currency)}
                </p>
                <button className="bg-accent-purple text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Pay with Paystack
                </button>
              </div>
              {/* TODO: Add quantity selector */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage; 