import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-hero-gradient text-white py-20 sm:py-32 grainy overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          Find something great to do.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
          Discover the world's best nightlife, music, cultural, business and social events.
        </p>
        <div className="mt-8">
          <a
            href="#"
            className="inline-block bg-black border border-transparent rounded-md py-3 px-8 font-medium text-dark-purple hover:bg-gray-900 transition-colors"
          >
            Find an event
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 