"use client";

import Link from "next/link";
import { useState } from "react";

/* ---------- Mock saved providers ---------- */

const initialSaved = [
  {
    slug: "james-thornton-farrier",
    name: "James Thornton AWCF",
    category: "Farrier",
    location: "Newbury, Berkshire",
    rating: 4.9,
    reviewCount: 47,
    verified: true,
    tags: ["Remedial", "Hot shoeing"],
  },
  {
    slug: "cotswold-equine-vets",
    name: "Cotswold Equine Vets",
    category: "Equine Vet",
    location: "Cirencester, Gloucestershire",
    rating: 4.8,
    reviewCount: 92,
    verified: true,
    tags: ["Emergency", "Pre-purchase"],
  },
  {
    slug: "sophie-clarke-physio",
    name: "Sophie Clarke MSc RAMP",
    category: "Equine Physio",
    location: "Marlborough, Wiltshire",
    rating: 5.0,
    reviewCount: 31,
    verified: true,
    tags: ["Sports massage", "Rehab"],
  },
  {
    slug: "richard-green-saddler",
    name: "Richard Green Master Saddler",
    category: "Saddle Fitter",
    location: "Hungerford, Berkshire",
    rating: 4.9,
    reviewCount: 64,
    verified: true,
    tags: ["Fitting", "Repairs"],
  },
];

/* ---------- Stars ---------- */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="13"
          height="13"
          viewBox="0 0 20 20"
          className={star <= Math.round(rating) ? "text-amber-400" : "text-sand-dark/30"}
        >
          <path
            d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.14l-4.77 2.58.91-5.33L2.27 6.62l5.34-.78L10 1z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  );
}

/* ---------- Page ---------- */

export default function SavedPage() {
  const [savedProviders, setSavedProviders] = useState(initialSaved);

  const handleRemove = (slug: string) => {
    setSavedProviders((prev) => prev.filter((p) => p.slug !== slug));
  };

  return (
    <div className="page-content">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-serif text-charcoal">Saved</h1>
        <p className="text-sm text-warm-brown/60 mt-1">
          {savedProviders.length}{" "}
          {savedProviders.length === 1 ? "provider" : "providers"} saved
        </p>
      </header>

      {savedProviders.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center mb-4">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-sand-dark/50"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
          <h2 className="text-lg font-serif text-charcoal mb-2">
            No saved providers yet
          </h2>
          <p className="text-sm text-warm-brown/60 max-w-[260px] mx-auto leading-relaxed">
            Tap the heart icon on any provider to save them here for quick
            access.
          </p>
          <Link
            href="/search"
            className="btn-primary inline-flex items-center gap-2 mt-6"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            Find providers
          </Link>
        </div>
      ) : (
        /* Saved providers list */
        <div className="space-y-3">
          {savedProviders.map((provider) => (
            <div key={provider.slug} className="card p-4">
              <div className="flex gap-3.5">
                {/* Image placeholder */}
                <Link
                  href={`/provider/${provider.slug}`}
                  className="w-[72px] h-[72px] rounded-xl bg-cream flex-shrink-0 flex items-center justify-center"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 32 32"
                    fill="none"
                    className="text-sand-dark/40"
                  >
                    <path
                      d="M8 26C8 26 10 18 16 12C22 18 24 26 24 26"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="16"
                      cy="10"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/provider/${provider.slug}`}>
                      <h3 className="font-serif text-[15px] text-charcoal leading-tight">
                        {provider.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => handleRemove(provider.slug)}
                      className="text-burgundy flex-shrink-0"
                      aria-label={`Remove ${provider.name} from saved`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </button>
                  </div>

                  {provider.verified && (
                    <span className="verified-badge mt-0.5">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M8 0l1.67 2.36L12.4 1.4l.28 2.88 2.88.28-1.96 2.13L16 8l-2.36 1.67.96 2.73-2.88.28-.28 2.88-2.13-1.96L8 16l-1.67-2.36L3.6 14.6l-.28-2.88-2.88-.28L2.4 9.31 0 8l2.36-1.67L1.4 3.6l2.88-.28.28-2.88 2.13 1.96L8 0z" />
                        <path
                          d="M6.5 10.5l-2-2 1-1 1 1 3-3 1 1-4 4z"
                          fill="white"
                        />
                      </svg>
                      Verified
                    </span>
                  )}

                  <p className="text-xs text-warm-brown/60 mt-1">
                    {provider.category} &middot; {provider.location}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Stars rating={provider.rating} />
                    <span className="text-xs text-warm-brown/50">
                      {provider.rating} ({provider.reviewCount})
                    </span>
                  </div>

                  <div className="flex gap-1.5 mt-2">
                    {provider.tags.map((tag) => (
                      <span key={tag} className="badge-olive">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-sand/40">
                <Link
                  href={`/provider/${provider.slug}`}
                  className="flex-1 text-center text-xs font-medium text-olive py-2 rounded-lg bg-olive/5 active:bg-olive/10 transition-colors"
                >
                  View profile
                </Link>
                <button className="flex-1 text-center text-xs font-medium text-warm-brown/60 py-2 rounded-lg bg-cream active:bg-sand transition-colors">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
