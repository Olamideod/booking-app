'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { user, setShowAuthModal } = useAuth();
  const imageUrl =
    event.image_url ||
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&h=600&auto=format&fit=crop';
  
  const isPastEvent = new Date(event.date) < new Date();
  const isUpcomingEvent = !isPastEvent && !event.sold_out;

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to event details
    e.stopPropagation();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Navigate to event details page with purchase section in focus
    window.location.href = `/events/${event.id}#purchase`;
  };

  return (
    <motion.div variants={cardVariants}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 relative">
        <Link href={`/events/${event.id}`} className={isPastEvent ? 'pointer-events-none' : ''}>
          <div className="relative">
            <Image
              className="w-full h-48 object-cover"
              src={imageUrl}
              alt={event.title}
              width={800}
              height={600}
            />
            {(event.sold_out || isPastEvent) && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {isPastEvent ? 'PAST EVENT' : 'SOLD OUT'}
              </div>
            )}
            {isPastEvent && <div className="absolute inset-0 bg-white/30"></div>}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-black">{event.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">{event.location}</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-lg font-semibold text-purple">
                {formatCurrency(event.price, event.currency)}
              </p>
              
              {isUpcomingEvent && (
                <button 
                  onClick={handleBuyClick}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-md transition-colors"
                >
                  <ShoppingCart size={16} />
                  Buy Ticket
                </button>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard; 