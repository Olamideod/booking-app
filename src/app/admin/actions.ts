'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createEvent(prevState: any, formData: FormData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') {
    return { message: 'Unauthorized: Not an admin.' };
  }

  const eventData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    date: formData.get('date') as string,
    location: formData.get('location') as string,
    price: parseFloat(formData.get('price') as string),
    currency: formData.get('currency') as 'NGN' | 'GBP',
    image_url: formData.get('image_url') as string,
    featured: formData.get('featured') === 'on',
  };

  const { error } = await supabase.from('events').insert(eventData);

  if (error) {
    console.error('Error creating event:', error);
    return { message: `Failed to create event: ${error.message}` };
  }

  revalidatePath('/admin');
  revalidatePath('/events');
  redirect('/admin');
}

export async function deleteEvent(eventId: number) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase.from('events').delete().eq('id', eventId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin');
}
