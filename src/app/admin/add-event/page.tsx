import AddEventForm from '@/components/AddEventForm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AddEventPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?error=unauthenticated');
  }

  // Also check if the user has the 'admin' role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/?error=unauthorized');
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Add a New Event</h1>
      <div className="bg-white p-8 rounded-lg shadow-md border">
        <AddEventForm />
      </div>
    </div>
  );
} 