import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-purple text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Customers</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white">Find an event</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Find your tickets</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">FAQs</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Organisers</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white">Ticketing and Marketing</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Sign in to Dashboard</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Help</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white">Privacy & Terms</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white"><Instagram /></Link>
              <Link href="#" className="text-gray-300 hover:text-white"><Facebook /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tickora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 