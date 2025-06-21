'use client'

import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';
import { X } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const supabaseClient = createClient();

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
        />
      </div>
    </div>
  );
};

export default AuthModal; 