'use client';

import type { User } from '@supabase/supabase-js';
import { LogOut, PlusCircle, ShoppingCart, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface UserNavProps {
  user: User;
  profile: { role?: string } | null;
  onLogout: () => void;
}

export function UserNav({ user, profile, onLogout }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const userInitial = user.email ? user.email[0].toUpperCase() : '?';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-purple text-black font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-black"
      >
        {userInitial}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
          onClick={() => setIsOpen(false)}
        >
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
          </div>
          <Link
            href="/profile/orders"
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>My Orders</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
          {profile?.role === 'admin' && (
            <Link
              href="/admin/add-event"
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Add Event</span>
            </Link>
          )}
          <button
            onClick={onLogout}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
} 