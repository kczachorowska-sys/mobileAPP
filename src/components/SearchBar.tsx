'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
  initialLocation?: string;
  initialDistance?: number;
}

export default function SearchBar({
  initialQuery = '',
  initialLocation = '',
  initialDistance = 25,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [distance, setDistance] = useState(initialDistance);
  const [locating, setLocating] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(`${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`);
        setLocating(false);
      },
      () => {
        setLocating(false);
      }
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    params.set('distance', String(distance));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* What do you need? */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5D4037"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="What do you need?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-cream border border-sand-dark rounded-xl text-charcoal placeholder:text-warm-brown/50 focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive transition-colors"
        />
      </div>

      {/* Where? */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5D4037"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Where? (town or postcode)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-cream border border-sand-dark rounded-xl text-charcoal placeholder:text-warm-brown/50 focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive transition-colors"
        />
      </div>

      {/* Use my location + Distance */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locating}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-olive font-medium bg-olive/10 rounded-lg border border-olive/20 transition-colors hover:bg-olive/15 disabled:opacity-50"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
          {locating ? 'Locating...' : 'Use my location'}
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <label htmlFor="distance" className="text-sm text-warm-brown whitespace-nowrap">
            Within
          </label>
          <select
            id="distance"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="px-2 py-2 text-sm bg-cream border border-sand-dark rounded-lg text-charcoal focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive"
          >
            <option value={5}>5 miles</option>
            <option value={10}>10 miles</option>
            <option value={25}>25 miles</option>
            <option value={50}>50 miles</option>
          </select>
        </div>
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="w-full py-3 bg-olive text-white font-semibold rounded-xl transition-all hover:bg-olive-light active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-olive/50 focus:ring-offset-2 focus:ring-offset-ivory"
      >
        Search
      </button>
    </form>
  );
}
