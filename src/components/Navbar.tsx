'use client'

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Search, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Get initial user
    const getInitialUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getInitialUser();

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsMobileMenuOpen(false); // Close menu on logout
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
    setIsMobileMenuOpen(false); // Close menu when opening auth
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left Section */}
            <div className="flex-1 flex items-center">
              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-purple">
                  {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/events" className="text-gray-700 hover:text-accent-purple text-sm font-medium transition-colors">
                  Browse Events
                </Link>
                <button className="flex items-center text-gray-700 hover:text-accent-purple text-sm font-medium transition-colors">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </button>
              </div>
            </div>

            {/* Center Section - Logo */}
            <div className="flex-shrink-0 px-4">
              <Link href="/" className="text-3xl font-extrabold tracking-tight text-black">
                TICKORA
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex-1 flex items-center justify-end">
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <>
                    <Link href="/profile" className="flex items-center bg-accent-purple text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                      <UserIcon className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center bg-dark-purple text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-all">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleAuthClick} className="text-gray-700 hover:text-accent-purple text-sm font-medium transition-colors">
                      Sign In
                    </button>
                    <button onClick={handleAuthClick} className="bg-dark-purple text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-all">
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
            
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/events" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent-purple hover:bg-gray-50">Browse Events</Link>
              <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent-purple hover:bg-gray-50">Search</button>
              <hr className="my-2" />
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent-purple hover:bg-gray-50">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent-purple hover:bg-gray-50">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={handleAuthClick} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent-purple hover:bg-gray-50">Sign In</button>
                  <button onClick={handleAuthClick} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent-purple hover:bg-gray-50">Register</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default Navbar; 