// This file contains TypeScript types for our application's data structures.

// Based on the 'events' table in your Supabase schema.
// It's good practice to keep this in sync with your database.
export interface Event {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  image_url: string | null;
  price: number;
  currency: 'NGN' | 'GBP';
  featured: boolean | null;
  sold_out: boolean | null;
} 