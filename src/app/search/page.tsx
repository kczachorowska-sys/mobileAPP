"use client";

import Link from "next/link";
import { useState } from "react";

/* ---------- Mock data ---------- */

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "distance", label: "Distance" },
  { value: "rating", label: "Rating" },
  { value: "recent", label: "Recently added" },
];

const filterCategories = [
  "All",
  "Farriers",
  "Vets",
  "Physios",
  "Instructors",
  "Livery",
  "Saddle Fitters",
  "Tack Shops",
  "Transport",
];

const mockResults = [
  {
    slug: "james-thornton-farrier",
    name: "James Thornton AWCF",
    category: "Farrier",
    location: "Newbury, Berkshire",
    distance: "3.2 miles",
    rating: 4.9,
    reviewCount: 47,
    verified: true,
    tags: ["Remedial", "Hot shoeing"],
    description:
      "Experienced AWCF farrier covering Berkshire and North Hampshire. Specialising in remedial and corrective work.",
  },
  {
    slug: "cotswold-equine-vets",
    name: "Cotswold Equine Vets",
    category: "Equine Vet",
    location: "Cirencester, Gloucestershire",
    distance: "8.5 miles",
    rating: 4.8,
    reviewCount: 92,
    verified: true,
    tags: ["Emergency", "Pre-purchase"],
    description:
      "Full-service equine veterinary practice with 24/7 emergency cover. Specialist facilities including digital X-ray and ultrasound.",
  },
  {
    slug: "sophie-clarke-physio",
    name: "Sophie Clarke MSc RAMP",
    category: "Equine Physio",
    location: "Marlborough, Wiltshire",
    distance: "12.1 miles",
    rating: 5.0,
    reviewCount: 31,
    verified: true,
    tags: ["Sports massage", "Rehab"],
    description:
      "Chartered physiotherapist specialising in equine sports massage and rehabilitation programmes.",
  },
  {
    slug: "valley-equestrian-livery",
    name: "Valley Equestrian Centre",
    category: "Livery Yard",
    location: "Lambourn, Berkshire",
    distance: "6.7 miles",
    rating: 4.7,
    reviewCount: 28,
    verified: false,
    tags: ["Full livery", "Arena"],
    description:
      "Family-run livery yard in the heart of Lambourn valley. Full, part and DIY livery available. 60x20 all-weather arena.",
  },
  {
    slug: "richard-green-saddler",
    name: "Richard Green Master Saddler",
    category: "Saddle Fitter",
    location: "Hungerford, Berkshire",
    distance: "9.3 miles",
    rating: 4.9,
    reviewCount: 64,
    verified: true,
    tags: ["Fitting", "Repairs"],
    description:
      "Society of Master Saddlers qualified fitter. Bespoke saddle fitting, adjustments and repairs covering the South of England.",
  },
  {
    slug: "hannah-brooks-instructor",
    name: "Hannah Brooks BHSI",
    category: "Riding Instructor",
    location: "Wantage, Oxfordshire",
    distance: "14.8 miles",
    rating: 4.6,
    reviewCount: 19,
    verified: true,
    tags: ["Dressage", "Freelance"],
    description:
      "BHSI qualified freelance instructor with a focus on dressage from Prelim to Advanced Medium. Happy to travel.",
  },
];

/* ---------- Stars component ---------- */

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

export default function SearchPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  return (
    <div className="page-content pt-2">
      {/* Header */}
      <header className="flex items-center gap-3 mb-4">
        <Link href="/" className="text-charcoal p-1 -ml-1" aria-label="Back">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-lg font-serif text-charcoal">Search Results</h1>
      </header>

      {/* Search bar (compact) */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Farrier near Newbury..."
            defaultValue="Farrier"
            className="input-field pl-9 py-3 text-sm"
          />
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-brown/40"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <button className="input-field w-auto px-3 py-3 flex items-center" aria-label="Filter">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
        </button>
      </div>

      {/* Category filters (horizontal scroll) */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-5 px-5 mb-3">
        {filterCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors duration-150 ${
              activeFilter === cat
                ? "bg-olive text-white"
                : "bg-cream text-warm-brown/70 border border-sand-dark/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count + sort + view toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-warm-brown/60">
          <span className="font-medium text-charcoal">{mockResults.length}</span> results near{" "}
          <span className="font-medium text-charcoal">Newbury</span>
        </p>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-cream rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list" ? "bg-white shadow-sm text-olive" : "text-warm-brown/40"
              }`}
              aria-label="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "map" ? "bg-white shadow-sm text-olive" : "text-warm-brown/40"
              }`}
              aria-label="Map view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                <path d="M8 2v16M16 6v16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select-field py-2.5 text-xs"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Map placeholder */}
      {viewMode === "map" && (
        <div className="card mb-4 overflow-hidden">
          <div className="h-48 bg-cream flex items-center justify-center">
            <div className="text-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-2 text-olive/40"
              >
                <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                <path d="M8 2v16M16 6v16" />
              </svg>
              <p className="text-xs text-warm-brown/50">Map view coming soon</p>
            </div>
          </div>
        </div>
      )}

      {/* Results list */}
      <div className="space-y-3">
        {mockResults.map((result) => (
          <Link
            key={result.slug}
            href={`/provider/${result.slug}`}
            className="card p-4 block"
          >
            <div className="flex gap-3.5">
              {/* Image placeholder */}
              <div className="w-[72px] h-[72px] rounded-xl bg-cream flex-shrink-0 flex items-center justify-center">
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
                  <circle cx="16" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-[15px] text-charcoal leading-tight">
                    {result.name}
                  </h3>
                  <button
                    className="text-sand-dark/40 hover:text-burgundy flex-shrink-0"
                    aria-label="Save"
                    onClick={(e) => e.preventDefault()}
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
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                  {result.verified && (
                    <span className="verified-badge">
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0l1.67 2.36L12.4 1.4l.28 2.88 2.88.28-1.96 2.13L16 8l-2.36 1.67.96 2.73-2.88.28-.28 2.88-2.13-1.96L8 16l-1.67-2.36L3.6 14.6l-.28-2.88-2.88-.28L2.4 9.31 0 8l2.36-1.67L1.4 3.6l2.88-.28.28-2.88 2.13 1.96L8 0z" />
                        <path d="M6.5 10.5l-2-2 1-1 1 1 3-3 1 1-4 4z" fill="white" />
                      </svg>
                    </span>
                  )}
                  <span className="text-xs text-warm-brown/60">
                    {result.category}
                  </span>
                </div>

                <p className="text-xs text-warm-brown/50 mt-1 flex items-center gap-1">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {result.location} &middot; {result.distance}
                </p>

                <div className="flex items-center gap-1.5 mt-1.5">
                  <Stars rating={result.rating} />
                  <span className="text-xs text-warm-brown/50">
                    {result.rating} ({result.reviewCount})
                  </span>
                </div>

                <div className="flex gap-1.5 mt-2">
                  {result.tags.map((tag) => (
                    <span key={tag} className="badge-olive">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-warm-brown/60 leading-relaxed mt-3 line-clamp-2">
              {result.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Load more */}
      <div className="mt-6 text-center">
        <button className="btn-secondary text-xs px-8 py-3">
          Load more results
        </button>
      </div>
    </div>
  );
}
