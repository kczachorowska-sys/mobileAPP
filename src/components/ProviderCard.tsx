'use client';

import Link from 'next/link';
import StarRating from './StarRating';

interface ProviderCardProps {
  image?: string | null;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance?: number | null;
  location?: string | null;
  verified: boolean;
  acceptingNewClients: boolean;
  slug: string;
}

export default function ProviderCard({
  image,
  name,
  category,
  rating,
  reviewCount,
  distance,
  location,
  verified,
  acceptingNewClients,
  slug,
}: ProviderCardProps) {
  return (
    <div className="bg-cream rounded-2xl shadow-sm border border-sand overflow-hidden transition-shadow hover:shadow-md">
      {/* Provider Image */}
      <div className="relative h-40 w-full">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sand via-sand-dark to-warm-brown/30 flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4C5B5"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-1 text-xs font-medium text-deep-brown bg-ivory/90 backdrop-blur-sm rounded-full border border-sand">
            {category}
          </span>
        </div>

        {/* Verified badge */}
        {verified && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-ivory/90 backdrop-blur-sm rounded-full border border-olive/20">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="#6B7B5E"
                stroke="#6B7B5E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[10px] font-semibold text-olive">Verified</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <h3 className="font-serif text-lg font-semibold text-deep-brown leading-tight">
          {name}
        </h3>

        {/* Rating */}
        <StarRating rating={rating} reviewCount={reviewCount} size="sm" />

        {/* Location & Distance */}
        <div className="flex items-center gap-3 text-sm text-warm-brown">
          {location && (
            <div className="flex items-center gap-1">
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
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{location}</span>
            </div>
          )}
          {distance !== undefined && distance !== null && (
            <span className="text-olive-light font-medium">
              {distance < 1 ? '<1' : distance.toFixed(1)} mi
            </span>
          )}
        </div>

        {/* Accepting new clients */}
        {acceptingNewClients && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-olive" />
            <span className="text-xs font-medium text-olive">
              Accepting new clients
            </span>
          </div>
        )}

        {/* View Profile button */}
        <Link
          href={`/provider/${slug}`}
          className="block w-full mt-3 py-2.5 text-center text-sm font-semibold text-olive bg-olive/10 rounded-xl border border-olive/20 transition-all hover:bg-olive/15 active:scale-[0.98]"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
