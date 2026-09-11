"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/* ---------- Types ---------- */

interface ApiSubcategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  providerCount: number;
}

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  subcategories: ApiSubcategory[];
}

interface ApiProvider {
  id: string;
  slug: string;
  businessName: string;
  categoryId: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  postcode: string | null;
  town: string | null;
  latitude: number | null;
  longitude: number | null;
  verificationStatus: string;
  acceptingNewClients: boolean;
  isDemo: boolean;
  specialisations: string | null;
  qualifications: string | null;
  category: {
    name: string;
    slug: string;
    parentCategory?: {
      name: string;
      slug: string;
    } | null;
  };
  services: { serviceName: string; priceFrom: number | null; priceTo: number | null }[];
  avgRating: number | null;
  reviewCount: number;
}

/* ---------- Category icon map ---------- */

const categoryIconMap: Record<string, ReactNode> = {
  farriers: (
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
  vets: (
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
  physios: (
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
  instructors: (
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
  livery: (
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
  "saddle-fitters": (
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
  "tack-shops": (
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
  transport: (
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
};

/* Generic fallback icon for categories without a mapped SVG */
const genericCategoryIcon = (
  <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
    <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M14 20h12M20 14v12"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/** Look up icon by slug, trying the subcategory slug first, then the parent slug */
function getIconForSlug(slug: string, parentSlug?: string | null): ReactNode {
  return categoryIconMap[slug] ?? (parentSlug ? categoryIconMap[parentSlug] : null) ?? genericCategoryIcon;
}

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

/* ---------- Shimmer loading placeholder ---------- */

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-sand-dark/10 ${className ?? ""}`}
    />
  );
}

/* ---------- Page ---------- */

export default function HomePage() {
  const [categories, setCategories] = useState<
    { name: string; slug: string; icon: ReactNode; parentSlug?: string | null }[]
  >([]);
  const [providers, setProviders] = useState<ApiProvider[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: { categories: ApiCategory[] }) => {
        // Flatten subcategories, keep only those with providers, pick top 8
        const allSubs: { name: string; slug: string; parentSlug: string; providerCount: number }[] = [];
        for (const parent of data.categories) {
          for (const sub of parent.subcategories) {
            allSubs.push({
              name: sub.name,
              slug: sub.slug,
              parentSlug: parent.slug,
              providerCount: sub.providerCount,
            });
          }
        }

        // Sort by provider count descending, take top 8
        allSubs.sort((a, b) => b.providerCount - a.providerCount);
        const top8 = allSubs.slice(0, 8);

        // If fewer than 8 subcategories have providers, pad with parent categories
        if (top8.length < 8) {
          for (const parent of data.categories) {
            if (top8.length >= 8) break;
            if (!top8.some((s) => s.parentSlug === parent.slug || s.slug === parent.slug)) {
              top8.push({
                name: parent.name,
                slug: parent.slug,
                parentSlug: parent.slug,
                providerCount: 0,
              });
            }
          }
        }

        setCategories(
          top8.map((item) => ({
            name: item.name,
            slug: item.slug,
            parentSlug: item.parentSlug,
            icon: getIconForSlug(item.slug, item.parentSlug),
          }))
        );
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      })
      .finally(() => setLoadingCategories(false));

    // Fetch recommended providers
    fetch("/api/providers?limit=3&sort=rating")
      .then((res) => res.json())
      .then((data: { providers: ApiProvider[] }) => {
        setProviders(data.providers);
      })
      .catch((err) => {
        console.error("Failed to fetch providers:", err);
      })
      .finally(() => setLoadingProviders(false));
  }, []);

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
        {loadingCategories ? (
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <ShimmerBlock className="w-16 h-16 rounded-2xl" />
                <ShimmerBlock className="w-12 h-3" />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
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
        ) : (
          <p className="text-sm text-warm-brown/50 text-center py-4">
            No categories available.
          </p>
        )}
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
        {loadingProviders ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-4 flex gap-4 items-start">
                <ShimmerBlock className="w-20 h-20 flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <ShimmerBlock className="w-3/4 h-4" />
                  <ShimmerBlock className="w-1/2 h-3" />
                  <ShimmerBlock className="w-2/3 h-3" />
                  <div className="flex gap-1.5 pt-1">
                    <ShimmerBlock className="w-16 h-5 rounded-full" />
                    <ShimmerBlock className="w-16 h-5 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : providers.length > 0 ? (
          <div className="space-y-3">
            {providers.map((provider) => {
              const isVerified = provider.verificationStatus === "verified";
              const categoryName =
                provider.category?.parentCategory?.name ??
                provider.category?.name ??
                "";
              const tags = provider.specialisations
                ? provider.specialisations
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .slice(0, 2)
                : [];

              return (
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
                        {provider.businessName}
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

                    {isVerified && (
                      <span className="verified-badge mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 0l1.67 2.36L12.4 1.4l.28 2.88 2.88.28-1.96 2.13L16 8l-2.36 1.67.96 2.73-2.88.28-.28 2.88-2.13-1.96L8 16l-1.67-2.36L3.6 14.6l-.28-2.88-2.88-.28L2.4 9.31 0 8l2.36-1.67L1.4 3.6l2.88-.28.28-2.88 2.13 1.96L8 0z" />
                          <path d="M6.5 10.5l-2-2 1-1 1 1 3-3 1 1-4 4z" fill="white" />
                        </svg>
                        Verified
                      </span>
                    )}

                    <p className="text-xs text-warm-brown/60 mt-1">
                      {categoryName}
                      {categoryName && provider.town ? " · " : ""}
                      {provider.town ?? ""}
                    </p>

                    {provider.avgRating !== null && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Stars rating={provider.avgRating} />
                        <span className="text-xs text-warm-brown/50">
                          {provider.avgRating} ({provider.reviewCount})
                        </span>
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="flex gap-1.5 mt-2.5">
                        {tags.map((tag) => (
                          <span key={tag} className="badge-olive">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-warm-brown/50 text-center py-4">
            No recommended providers yet.
          </p>
        )}
      </section>
    </div>
  );
}
