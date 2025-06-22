import EventCard from "@/components/EventCard";
import HeroSection from "@/components/HeroSection";
import { createClient } from "@/lib/supabase/server";
import { dummyEvents } from '@/lib/dummy-data';
import type { Event } from '@/types';
import AnimatedPage from '@/components/AnimatedPage';

export const revalidate = 60; // Revalidate every 60 seconds

async function getEvents() {
  const supabase = createClient();
  
  // Get current date in ISO format
  const now = new Date().toISOString();
  
  // Get upcoming events (not in the past)
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gt('date', now) // Only future events
    .order('date', { ascending: true }) // Soonest events first
    .limit(6);
  
  if (error) {
    console.error('Error fetching events:', error.message);
    return dummyEvents.slice(0, 6) as Event[];
  }
  
  // Fallback to dummy data if fetch returns no events
  if (!data || data.length === 0) {
    console.log('No upcoming events found, falling back to dummy data.');
    return dummyEvents.slice(0, 6) as Event[];
  }
  
  return data as Event[];
}

export default async function Home() {
  const events = await getEvents();
  
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4">
        <HeroSection />
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </AnimatedPage>
  );
}
