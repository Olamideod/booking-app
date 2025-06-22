'use client';

import { motion } from 'framer-motion';
import type { Event } from '@/types';
import EventCard from '@/components/EventCard';
import EventFilters from '@/components/EventFilters';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface EventsPageClientProps {
  events: Event[];
  searchQuery?: string | null;
}

export default function EventsPageClient({ events, searchQuery }: EventsPageClientProps) {
  const pageTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : 'All Events';
    
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-dark-purple mb-2 text-center">{pageTitle}</h1>
        {searchQuery && events.length > 0 && (
            <p className="text-center text-gray-500 mb-8">
                Showing {events.length} event{events.length > 1 ? 's' : ''}
            </p>
        )}
        <EventFilters />
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {events?.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>
        {(!events || events.length === 0) && (
          <p className="text-center text-gray-500 mt-8">
            {searchQuery
              ? 'No events found for your search.'
              : 'No events match the current filter.'}
          </p>
        )}
      </div>
    </div>
  );
} 