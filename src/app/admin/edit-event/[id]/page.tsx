// File: src/app/admin/edit-event/[id]/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditEventForm from '@/components/EditEventForm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditEventPage({ params }: any) {
  const { id } = params as { id: string };
  const supabase = createClient();

  // Check if user is fixed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?error=unauthenticated');
  }

  // Fetch user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/?error=unauthorized');
  }

  // Fetch the event
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    redirect('/events?error=notfound');
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Edit Event</h1>
      <div className="bg-white p-8 rounded-lg shadow-md border">
        <EditEventForm event={event} />
      </div>
    </div>
  );
}
