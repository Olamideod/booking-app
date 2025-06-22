'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">Error</h1>
      <h2 className="text-2xl font-semibold mb-6">Something went wrong!</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        An unexpected error occurred. Please try again later.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 