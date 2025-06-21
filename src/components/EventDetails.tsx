'use client';

import { useState } from 'react';
import type { Event } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { Minus, Plus } from 'lucide-react';

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId: event.id,
        quantity,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || 'Payment initialization failed. Please try again.');
      setIsLoading(false);
      return;
    }

    const { authorization_url } = await response.json();
    window.location.href = authorization_url;
  };

  const imageUrl = event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&h=800&auto=format&fit=crop';

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <img className="w-full h-96 object-cover" src={imageUrl} alt={event.title} />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-dark-purple">{event.title}</h1>
        <p className="text-lg text-gray-500 mt-2">{new Date(event.date).toUTCString()}</p>
        <p className="text-lg text-gray-600 mt-1">{event.location}</p>
        <p className="mt-6 text-gray-700">{event.description}</p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-dark-purple">Buy Tickets</h2>
          <div className="mt-4 bg-light-bg p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold text-accent-purple">
                {formatCurrency(event.price, event.currency)}
              </p>
              <div className="flex items-center space-x-4">
                <button onClick={() => handleQuantityChange(-1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                  <Minus size={16} />
                </button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                  <Plus size={16} />
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="mt-6 w-full bg-accent-purple text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? 'Processing...' : `Pay ${formatCurrency(event.price * quantity, event.currency)} with Paystack`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 