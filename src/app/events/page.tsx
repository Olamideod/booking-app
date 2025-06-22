import { createClient } from '@/lib/supabase/server';
import React, { Suspense } from 'react';
import { dummyEvents } from '@/lib/dummy-data';
import type { Event } from '@/types';
import EventsPageClient from '@/components/EventsPageClient';
import AnimatedPage from '@/components/AnimatedPage';

// We're not using revalidate or no-store here for now,
// allowing Next.js to cache the page.
// The dynamic searchParams will still make the page dynamic.

interface EventsPageProps {
  searchParams?: Promise<{
    filter?: string;
    q?: string;
  }>;
}

const EventsPage = async ({ searchParams }: EventsPageProps) => {
  const params = searchParams ? await searchParams : {};
  const filter = params.filter;
  const searchQuery = params.q;
  const now = new Date().toISOString();

  const supabase = createClient();
  let query = supabase.from('events').select('*');

  // Apply filters based on search param
  if (filter === 'upcoming') {
    query = query.filter('date', 'gte', now);
  } else if (filter === 'past') {
    query = query.filter('date', 'lt', now);
  }

  // Apply search query
  if (searchQuery) {
    const cleanedQuery = searchQuery.trim();
    // Use `or` to search in both title and description.
    // The `ilike` operator is case-insensitive.
    query = query.or(`title.ilike.%${cleanedQuery}%,description.ilike.%${cleanedQuery}%`);
  }

  const { data, error } = await query.order('date', { ascending: filter !== 'past' });
  let events = data;

  if (error) {
    console.error('Error fetching events:', error);
  }

  // Fallback to dummy data if the fetch fails or returns no results
  if (!events || events.length === 0) {
    console.log('No events found, falling back to dummy data.');
    let filteredDummyEvents = dummyEvents;
    if (filter === 'upcoming') {
      filteredDummyEvents = dummyEvents.filter(e => new Date(e.date) >= new Date(now));
    } else if (filter === 'past') {
      filteredDummyEvents = dummyEvents.filter(e => new Date(e.date) < new Date(now));
    }
    events = filteredDummyEvents as Event[];
  }

  return (
    <AnimatedPage>
      <Suspense fallback={<div>Loading events...</div>}>
        <EventsPageClient events={events} searchQuery={searchQuery} />
      </Suspense>
    </AnimatedPage>
  );
};

export default EventsPage;
