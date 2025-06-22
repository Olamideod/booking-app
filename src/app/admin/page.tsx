import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EventForm from '@/components/EventForm';
import { deleteEvent } from './actions';
import { Trash2 } from 'lucide-react';

export default async function AdminPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    redirect('/'); // Redirect non-admins to the homepage
  }

  const { data: events } = await supabase.from('events').select('*').order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <h2 className="text-3xl font-bold text-dark-purple mb-6">Create New Event</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <EventForm />
          </div>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold text-dark-purple mb-6">Manage Existing Events</h2>
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {events?.map(event => (
              <div key={event.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                </div>
                <form action={deleteEvent.bind(null, event.id)}>
                  <button type="submit" className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            ))}
            {events?.length === 0 && <p className="text-gray-500">No events found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
} 