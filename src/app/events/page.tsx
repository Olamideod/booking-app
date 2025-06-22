import { createClient } from '@/lib/supabase/server';
import React from 'react';
import { dummyEvents } from '@/lib/dummy-data';
import type { Event } from '@/types';
import EventsPageClient from '@/components/EventsPageClient';

// We're not using revalidate or no-store here for now,
// allowing Next.js to cache the page.
// The dynamic searchParams will still make the page dynamic.

interface EventsPageProps {
  searchParams?: {
    filter?: string;
    q?: string;
  };
}

const EventsPage = async ({ searchParams }: EventsPageProps) => {
  const supabase = createClient();
  const filter = searchParams?.filter;
  const searchQuery = searchParams?.q;
  const now = new Date().toISOString();

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

  let { data: events, error } = await query.order('date', { ascending: filter !== 'past' });

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

  return <EventsPageClient events={events} searchQuery={searchQuery} />;
};

export default EventsPage;
