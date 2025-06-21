import EventCard from "@/components/EventCard";
import HeroSection from "@/components/HeroSection";
import { dummyEvents } from "@/lib/dummy-data";

export default function HomePage() {
  const featuredEvents = dummyEvents.filter(event => event.featured);

  return (
    <>
      <HeroSection />
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-dark-purple mb-8">Featured Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
