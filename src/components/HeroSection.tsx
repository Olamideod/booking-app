import React from 'react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="relative bg-hero-gradient text-white py-20 sm:py-32 grainy overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          Find something great to do.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
          Discover the world&apos;s best nightlife, music, cultural, business and social events.
        </p>
        <div className="mt-8">
          <Link href="/events" className="btn-primary">
            Find an event
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 