import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EventDetails from '@/components/EventDetails';

interface EventDetailPageProps {
  params: { id: string };
}

export const revalidate = 60; // Revalidate every 60 seconds

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
  const supabase = createClient();
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!event) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventDetails event={event} />
      </div>
    </div>
  );
};

export default EventDetailPage; 