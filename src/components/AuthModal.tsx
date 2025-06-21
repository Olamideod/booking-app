import React from 'react';

const AuthModal = () => {
  // Logic for login/register will go here
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-dark-purple mb-4">Login or Sign Up</h2>
        <p className="text-gray-600">Authentication form will be here.</p>
        {/* TODO: Add Supabase UI Auth component or custom form */}
      </div>
    </div>
  );
};

export default AuthModal; 