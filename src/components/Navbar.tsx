'use client'

import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import AuthModal from './AuthModal';
import Search from './Search';
import { UserNav } from './UserNav';

export default function Navbar() {
  const { user, profile, loading, showAuthModal, setShowAuthModal, supabase } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('error') === 'unauthenticated') {
      setShowAuthModal(true);
    }
  }, [searchParams, setShowAuthModal]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully!');
    setIsMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <nav className="container mx-auto flex h-16 items-center justify-between p-4 relative">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-black md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/events" className="text-sm font-medium text-gray-700 hover:text-accent-purple">
                Browse Events
              </Link>
              <Suspense fallback={<div className="w-full max-w-xs h-10"></div>}>
                <Search />
              </Suspense>
            </div>
          </div>

          {/* Center section */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="font-bold text-xl text-black">
              TICKORA
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center justify-end space-x-4">
            <div className="hidden sm:flex items-center space-x-4">
              {loading ? null : user ? (
                <UserNav user={user} profile={profile} onLogout={handleLogout} />
              ) : (
                <>
                  <button
                    onClick={handleAuthClick}
                    className="text-sm font-medium text-black hover:text-accent-purple transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleAuthClick}
                    className="px-6 py-2 text-sm font-medium text-black hover:text-accent-purple transition-colors"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 z-30 w-full bg-black border p-4 space-y-4 md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/events" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-accent-purple">Browse Events</Link>
            <hr className="my-2"/>
            {loading ? null : user ? (
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="block rounded-md px-3 py-2 text-black font-medium text-black hover:bg-gray-50 hover:text-accent-purple"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block rounded-md px-3 py-2 text-black font-medium text-gray-700 hover:bg-gray-50 hover:text-accent-purple"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <button onClick={handleAuthClick} className="w-full text-left block rounded-md px-3 py-2 text-black font-medium text-gray-700 hover:bg-gray-50 hover:text-accent-purple">
                    Sign In
                  </button>
                  <button onClick={handleAuthClick} className="w-full text-left block rounded-md px-3 py-2 text-black font-medium text-gray-700 hover:bg-gray-50 hover:text-accent-purple">
                    Register
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
} 