import EventCard from "@/components/EventCard";
import HeroSection from "@/components/HeroSection";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const supabase = createClient();
  const { data: featuredEvents, error } = await supabase
    .from('events')
    .select('*')
    .eq('featured', true)
    .limit(3);

  if (error) {
    console.error("Error fetching featured events:", error);
  }

  return (
    <>
      <HeroSection />
      <div className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Featured Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents?.map(event => (
              <EventCard key={event.id} event={event as any} />
            ))}
          </div>
          {featuredEvents?.length === 0 && (
            <p className="text-center text-gray-500">No featured events at the moment.</p>
          )}
        </div>
      </div>
    </>
  );
}
