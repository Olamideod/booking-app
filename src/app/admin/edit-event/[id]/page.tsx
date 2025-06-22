import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditEventForm from '@/components/EditEventForm';

// The 'any' type is used here as a workaround for a build error
// where PageProps is being constrained to an incorrect type.
export default async function EditEventPage({ params }: any) {
  const { id } = params as { id: string };
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?error=unauthenticated');
  }

  // Check for admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/?error=unauthorized');
  }
  
  // Fetch the event to edit
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    // This could be a 404 not found page in a real app
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