'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: Event;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const imageUrl =
    event.image_url ||
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&h=600&auto=format&fit=crop';
  
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <motion.div variants={cardVariants}>
      <Link href={`/events/${event.id}`} className={isPastEvent ? 'pointer-events-none' : ''}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 relative">
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
                SOLD OUT
              </div>
            )}
            {isPastEvent && <div className="absolute inset-0 bg-white/50"></div>}
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
    </motion.div>
  );
};

export default EventCard; 