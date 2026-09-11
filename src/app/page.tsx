"use client";

import Link from "next/link";

/* ---------- Mock data ---------- */

const categories = [
  {
    name: "Farriers",
    slug: "farriers",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <path
          d="M8 32C8 32 12 20 20 14C28 20 32 32 32 32"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 28C14 28 16 22 20 19C24 22 26 28 26 28"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="14" r="2" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    name: "Vets",
    slug: "vets",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <path
          d="M20 8v24M8 20h24"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <rect
          x="12"
          y="12"
          width="16"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    name: "Physios",
    slug: "physios",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <path
          d="M12 28C12 28 16 16 20 12C24 16 28 28 28 28"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 22h20"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="20" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Instructors",
    slug: "instructors",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <circle cx="20" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M10 32c0-5.523 4.477-10 10-10s10 4.477 10 10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M26 18l4-4M14 18l-4-4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "Livery",
    slug: "livery",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <rect
          x="6"
          y="16"
          width="28"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M6 16L20 8l14 8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16 24v8M24 24v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Saddle Fitters",
    slug: "saddle-fitters",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <path
          d="M10 28C10 20 14 14 20 14C26 14 30 20 30 28"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M14 26C14 22 16.5 18 20 18C23.5 18 26 22 26 26"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <line x1="8" y1="28" x2="32" y2="28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Tack Shops",
    slug: "tack-shops",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <rect
          x="8"
          y="10"
          width="24"
          height="22"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M8 16h24" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M16 16v-6M24 16v-6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="20" cy="24" r="3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Transport",
    slug: "transport",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <rect
          x="4"
          y="14"
          width="24"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M28 18h5a2 2 0 012 2v8a2 2 0 01-2 2h-5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="30" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="30" cy="30" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M28 18v6h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const recommendedProviders = [
  {
    slug: "james-thornton-farrier",
    name: "James Thornton AWCF",
    category: "Farrier",
    location: "Newbury, Berkshire",
    rating: 4.9,
    reviewCount: 47,
    verified: true,
    image: null,
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
    image: null,
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
    image: null,
    tags: ["Sports massage", "Rehab"],
  },
];

/* ---------- Stars component ---------- */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
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

export default function HomePage() {
  return (
    <div className="page-content">
      {/* Brand header */}
      <header className="text-center pt-2 pb-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            className="text-olive"
          >
            <path
              d="M8 26C8 26 10 18 16 12C22 18 24 26 24 26"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="16" cy="10" r="3" fill="currentColor" opacity="0.3" />
            <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <h1 className="text-2xl font-serif tracking-tight text-charcoal">
            Equi<span className="text-olive">Find</span>
          </h1>
        </div>
        <p className="text-xs text-warm-brown/60 tracking-wide uppercase">
          Equestrian Services
        </p>
      </header>

      {/* Hero text */}
      <div className="text-center mb-8">
        <h2 className="text-[1.65rem] leading-snug font-serif text-charcoal text-balance">
          Find the right people
          <br />
          for your horse.
        </h2>
        <p className="mt-3 text-sm text-warm-brown/70 leading-relaxed max-w-[300px] mx-auto">
          Trusted farriers, vets, physios and more — all in one place.
        </p>
      </div>

      {/* Search form */}
      <div className="card p-5 mb-10">
        <div className="space-y-3">
          <div>
            <label htmlFor="service" className="sr-only">
              What do you need?
            </label>
            <input
              id="service"
              type="text"
              placeholder="What do you need?"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="location" className="sr-only">
              Where?
            </label>
            <div className="relative">
              <input
                id="location"
                type="text"
                placeholder="Where? e.g. Newbury or RG14"
                className="input-field pl-10"
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-brown/40"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </div>
          <div>
            <label htmlFor="distance" className="sr-only">
              Distance
            </label>
            <select id="distance" className="select-field">
              <option value="10">Within 10 miles</option>
              <option value="5">Within 5 miles</option>
              <option value="25">Within 25 miles</option>
              <option value="50">Within 50 miles</option>
            </select>
          </div>
          <Link
            href="/search"
            className="btn-primary w-full flex items-center justify-center gap-2 mt-1"
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
            Search
          </Link>
        </div>
      </div>

      {/* Popular categories */}
      <section className="mb-10">
        <h3 className="section-heading">Popular near you</h3>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center text-olive group-active:bg-sand transition-colors duration-150">
                {cat.icon}
              </div>
              <span className="text-[11px] text-warm-brown/80 text-center leading-tight font-medium">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended near you */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-heading mb-0">Recommended near you</h3>
          <Link
            href="/search"
            className="text-xs text-olive font-medium hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="space-y-3">
          {recommendedProviders.map((provider) => (
            <Link
              key={provider.slug}
              href={`/provider/${provider.slug}`}
              className="card p-4 flex gap-4 items-start"
            >
              {/* Image placeholder */}
              <div className="w-20 h-20 rounded-xl bg-cream flex-shrink-0 flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 32 32"
                  fill="none"
                  className="text-sand-dark/50"
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

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif text-[15px] text-charcoal leading-tight">
                    {provider.name}
                  </h4>
                  {/* Heart/save icon */}
                  <button
                    className="text-sand-dark/50 hover:text-burgundy flex-shrink-0 mt-0.5"
                    aria-label="Save provider"
                    onClick={(e) => e.preventDefault()}
                  >
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
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </button>
                </div>

                {provider.verified && (
                  <span className="verified-badge mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0l1.67 2.36L12.4 1.4l.28 2.88 2.88.28-1.96 2.13L16 8l-2.36 1.67.96 2.73-2.88.28-.28 2.88-2.13-1.96L8 16l-1.67-2.36L3.6 14.6l-.28-2.88-2.88-.28L2.4 9.31 0 8l2.36-1.67L1.4 3.6l2.88-.28.28-2.88 2.13 1.96L8 0z" />
                      <path d="M6.5 10.5l-2-2 1-1 1 1 3-3 1 1-4 4z" fill="white" />
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

                <div className="flex gap-1.5 mt-2.5">
                  {provider.tags.map((tag) => (
                    <span key={tag} className="badge-olive">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
