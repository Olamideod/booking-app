import React from 'react';

const HeroSection = () => {
  return (
    <div className="bg-dark-purple">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Discover and Book Amazing Events
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
          From concerts to conferences, find your next experience on TicketApp.
        </p>
        <div className="mt-8">
          <a
            href="#"
            className="inline-block bg-accent-purple border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-purple-700 transition-transform transform hover:scale-105"
          >
            Explore Events
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 