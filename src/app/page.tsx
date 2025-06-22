import EventCard from "@/components/EventCard";
import HeroSection from "@/components/HeroSection";
import { createClient } from "@/lib/supabase/server";
import { dummyEvents } from '@/lib/dummy-data';
import type { Event } from '@/types';

export const revalidate = 60; // Revalidate every 60 seconds

async function FeaturedEvents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('featured', true)
    .limit(3);
  let events = data;

  if (error) {
    console.error('Error fetching featured events:', error.message);
  }

  // Fallback to dummy data if fetch fails or returns no events
  if (!events || events.length === 0) {
    console.log('No featured events found, falling back to dummy data.');
    events = dummyEvents.filter(e => e.featured).slice(0, 3) as Event[];
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <div className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Events</h2>
          <FeaturedEvents />
        </div>
      </div>
    </main>
  );
}
