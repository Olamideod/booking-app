'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('q') || '');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    router.push(`/events?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events..."
        className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 bg-white focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-accent-purple transition-colors"
        aria-label="Search"
      >
        <SearchIcon size={20} />
      </button>
    </form>
  );
} 