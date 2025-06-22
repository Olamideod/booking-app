'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

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

  // Extract form data
  const title = formData.get('title') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const price = parseFloat(formData.get('price') as string) || 0;
  const currency = formData.get('currency') as string;
  const featured = formData.get('featured') === 'on';

  // Basic validation
  if (!title || !date || !location) {
    throw new Error('Title, date, and location are required.');
  }

  // Handle image (either URL or file upload)
  let image_url = formData.get('image_url') as string;
  const imageFile = formData.get('image_file') as File;

  // If a file was uploaded, store it in Supabase Storage
  if (imageFile && imageFile.size > 0) {
    try {
      // Generate a unique filename
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('events')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase
        .storage
        .from('events')
        .getPublicUrl(filePath);

      image_url = publicUrl;
    } catch (error) {
      console.error('Error processing image upload:', error);
      throw new Error('Failed to process image upload.');
    }
  }

  // Create the event
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        title,
        date,
        location,
        price,
        currency,
        image_url,
        featured,
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
  
  // Extract form data
  const title = formData.get('title') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const price = parseFloat(formData.get('price') as string) || 0;
  const currency = formData.get('currency') as string;
  const featured = formData.get('featured') === 'on';

  // Handle image (either URL or file upload)
  let image_url = formData.get('image_url') as string;
  const imageFile = formData.get('image_file') as File;

  // If a file was uploaded, store it in Supabase Storage
  if (imageFile && imageFile.size > 0) {
    try {
      // Generate a unique filename
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('events')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase
        .storage
        .from('events')
        .getPublicUrl(filePath);

      image_url = publicUrl;
    } catch (error) {
      console.error('Error processing image upload:', error);
      throw new Error('Failed to process image upload.');
    }
  }

  const { error } = await supabase
    .from('events')
    .update({
      title,
      date,
      location,
      price,
      currency,
      image_url,
      featured,
    })
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