import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EventDetails from '@/components/EventDetails';
import AnimatedPage from '@/components/AnimatedPage';
import { Suspense } from 'react';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
  const { id } = await params;
  
  const supabase = createClient();
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (!event) {
    notFound();
  }

  return (
    <AnimatedPage>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div>Loading event details...</div>}>
            <EventDetails event={event} />
          </Suspense>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default EventDetailPage; 