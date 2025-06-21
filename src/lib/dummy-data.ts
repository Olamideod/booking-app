export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  price: number;
  currency: 'NGN' | 'GBP';
  featured: boolean;
  sold_out: boolean;
}

export const dummyEvents: Event[] = [
  {
    id: 1,
    title: 'Afro Beats Night',
    description: 'Enjoy the best of afro beats with top DJs.',
    date: '2024-08-15T20:00:00Z',
    location: 'Lagos, Nigeria',
    image_url: '/images/event1.jpg',
    price: 5000,
    currency: 'NGN',
    featured: true,
    sold_out: false,
  },
  {
    id: 2,
    title: 'Summer Tech Conference',
    description: 'A conference for tech enthusiasts and professionals.',
    date: '2024-09-10T09:00:00Z',
    location: 'London, UK',
    image_url: '/images/event2.jpg',
    price: 150,
    currency: 'GBP',
    featured: true,
    sold_out: false,
  },
  {
    id: 3,
    title: 'Art & Wine Tasting',
    description: 'An evening of fine art and exquisite wines.',
    date: '2024-08-22T18:00:00Z',
    location: 'Abuja, Nigeria',
    image_url: '/images/event3.jpg',
    price: 7500,
    currency: 'NGN',
    featured: false,
    sold_out: true,
  },
]; 