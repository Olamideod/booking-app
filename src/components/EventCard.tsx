import React from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const imageUrl = event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&h=600&auto=format&fit=crop';

  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
        <div className="relative">
          <img className="w-full h-48 object-cover" src={imageUrl} alt={event.title} />
          {event.sold_out && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Sold Out
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-dark-purple">{event.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{new Date(event.date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">{event.location}</p>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-semibold text-accent-purple">
              {formatCurrency(event.price, event.currency)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard; 