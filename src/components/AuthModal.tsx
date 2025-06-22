'use client'

import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const supabaseClient = createClient();
  const router = useRouter();

  useEffect(() => {
    // Set up auth state change listener to refresh the page on successful sign-in
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event) => {
      // This event fires when the user successfully signs in.
      if (event === 'SIGNED_IN') {
        // Close the modal
        onClose();
        // Refresh the page to ensure server components re-render with the new session
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseClient, onClose, router]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X size={24} />
        </button>
        <Auth
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={['google']} // Optional: Add social providers
          magicLink
          redirectTo={`${window.location.origin}/profile`}
        />
      </div>
    </div>
  );
};

export default AuthModal; 