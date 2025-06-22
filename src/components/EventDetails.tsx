'use client';

import { deleteEvent } from '@/app/actions/eventActions';
import { useAuth } from '@/context/AuthContext';
// import { getStripe } from '@/lib/stripe/client';
import type { Event } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { Minus, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const { user, profile, setShowAuthModal } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPastEvent = new Date(event.date) < new Date();

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handlePayment = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Call your backend to initialize the Paystack transaction
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
        const errorData = await response.text();
        throw new Error(errorData || 'Payment initialization failed.');
      }

      // 2. Redirect the user to the Paystack checkout page
      const { authorization_url } = await response.json();
      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        throw new Error('Could not retrieve payment URL.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) {
      try {
        await deleteEvent(event.id);
        // The server action will handle the redirect
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete event.');
      }
    }
  };
  
  const imageUrl = event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&h=800&auto=format&fit=crop';

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <img className="w-full h-96 object-cover" src={imageUrl} alt={event.title} />
      <div className="p-8 relative">
        {profile?.role === 'admin' && (
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
            <h3 className="text-xs font-bold mb-2 px-2">Admin Toolkit</h3>
            <div className="flex space-x-2">
              <Link href={`/admin/edit-event/${event.id}`} className="flex items-center space-x-2 text-xs p-2 rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Edit size={14} />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 text-xs p-2 rounded-md bg-red-100 text-red-800 hover:bg-red-200"
              >
                <Trash2 size={14} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        )}
        <h1 className="text-4xl font-bold text-dark-purple">{event.title}</h1>
        <p className="text-lg text-gray-500 mt-2">{new Date(event.date).toUTCString()}</p>
        <p className="text-lg text-gray-600 mt-1">{event.location}</p>
        <p className="mt-6 text-gray-700">{event.description}</p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-dark-purple">Buy Tickets</h2>
          {isPastEvent ? (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg text-center">
              <p className="font-semibold text-gray-600">This event has ended.</p>
            </div>
          ) : (
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
              <div className="mt-8 flex items-center space-x-4">
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="btn-primary flex-grow disabled:bg-gray-400"
                >
                  {isLoading ? 'Processing...' : `Pay ${formatCurrency(event.price * quantity, event.currency)}`}
                </button>
              </div>
            </div>
          )}
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default EventDetails; 