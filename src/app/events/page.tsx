import EventCard from '@/components/EventCard';
import { dummyEvents } from '@/lib/dummy-data';
import React from 'react';

const EventsPage = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-dark-purple mb-8 text-center">All Events</h1>
        {/* TODO: Add filter controls here */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
