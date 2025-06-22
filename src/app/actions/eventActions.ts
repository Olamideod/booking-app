'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function verifyAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('You must be logged in.');
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') {
    throw new Error('You do not have permission to perform this action.');
  }
  return user;
}

export async function createEvent(formData: FormData) {
  await verifyAdmin();
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('You must be logged in to create an event.');
  }

  // Check if the user is an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('You do not have permission to create an event.');
  }

  const rawFormData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    date: formData.get('date') as string,
    location: formData.get('location') as string,
    price: parseFloat(formData.get('price') as string) || 0,
    currency: formData.get('currency') as string,
    image_url: formData.get('image_url') as string,
    featured: formData.get('featured') === 'on',
  };

  // Basic validation
  if (!rawFormData.title || !rawFormData.date || !rawFormData.location) {
    throw new Error('Title, date, and location are required.');
  }

  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        ...rawFormData,
        // The user who creates the event is not stored in the events table
        // but you could add a `creator_id` column if you wanted to.
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw new Error(`Failed to create event: ${error.message}`);
  }

  // Revalidate the pages where events are displayed
  revalidatePath('/events');
  revalidatePath('/');
  
  // Redirect to the newly created event page
  redirect(`/events/${data.id}`);
}

export async function updateEvent(eventId: number, formData: FormData) {
  await verifyAdmin();
  const supabase = createClient();
  
  const rawFormData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    date: formData.get('date') as string,
    location: formData.get('location') as string,
    price: parseFloat(formData.get('price') as string) || 0,
    currency: formData.get('currency') as string,
    image_url: formData.get('image_url') as string,
    featured: formData.get('featured') === 'on',
  };

  const { error } = await supabase
    .from('events')
    .update(rawFormData)
    .eq('id', eventId);

  if (error) {
    console.error('Error updating event:', error);
    throw new Error(`Failed to update event: ${error.message}`);
  }

  revalidatePath('/events');
  revalidatePath(`/events/${eventId}`);
  revalidatePath('/');
  
  redirect(`/events/${eventId}`);
}

export async function deleteEvent(eventId: number) {
  await verifyAdmin();
  const supabase = createClient();

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Error deleting event:', error);
    throw new Error(`Failed to delete event: ${error.message}`);
  }

  revalidatePath('/events');
  revalidatePath('/');
  
  redirect('/events');
} 