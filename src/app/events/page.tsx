import EventCard from '@/components/EventCard';
import { createClient } from '@/lib/supabase/server';
import React from 'react';

// Revalidate this page every 60 seconds to fetch fresh data
export const revalidate = 60;

const EventsPage = async () => {
  const supabase = createClient();
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    // In a real app, you'd want to show a user-friendly error message here
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-dark-purple mb-8 text-center">All Events</h1>
        {/* TODO: Add filter controls here */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events?.map(event => (
            <EventCard key={event.id} event={event as any} />
          ))}
        </div>
        {events?.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No events scheduled. Please check back later!</p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
