'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const filters = ['All', 'Upcoming', 'Past'];

export default function EventFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'All';

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter === 'All') {
      params.delete('filter');
    } else {
      params.set('filter', filter.toLowerCase().replace(' ', '-'));
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
      {filters.map((filter) => {
        const isActive = filter === 'All'
          ? currentFilter === 'All'
          : currentFilter === filter.toLowerCase().replace(' ', '-');
        
        return (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-accent-purple text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
} 