import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-dark-purple">
              TicketApp
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/events" className="text-gray-600 hover:bg-accent-purple hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Events
              </Link>
              {/* Auth buttons will go here */}
              <button className="bg-accent-purple text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 