"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";

/* ---------- Types ---------- */

interface ProviderResult {
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
  serviceRadius: number | null;
  areasCovered: string | null;
  priceRange: string | null;
  acceptingNewClients: boolean;
  verificationStatus: string;
  isDemo: boolean;
  specialisations: string | null;
  qualifications: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
    parentCategoryId: string | null;
  };
  services: { serviceName: string; priceFrom: number | null; priceTo: number | null }[];
  avgRating: number | null;
  reviewCount: number;
  distance: number | null;
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    providerCount: number;
  }[];
}

/* ---------- Constants ---------- */

const sortOptions = [
  { value: "recommended", label: "Recommended", apiValue: "" },
  { value: "distance", label: "Distance", apiValue: "distance" },
  { value: "rating", label: "Rating", apiValue: "rating" },
  { value: "recent", label: "Recently added", apiValue: "newest" },
];

const RESULTS_PER_PAGE = 20;

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

/* ---------- Inner page (reads searchParams) ---------- */

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get("query") || "";
  const locationParam = searchParams.get("location") || "";
  const categoryParam = searchParams.get("category") || "";

  const [providers, setProviders] = useState<ProviderResult[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [activeFilter, setActiveFilter] = useState(categoryParam || "all");
  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchInput, setSearchInput] = useState(queryParam);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch {
        // Categories are non-critical; pills will just show "All"
      }
    }
    fetchCategories();
  }, []);

  // Build the API URL for providers
  const buildApiUrl = useCallback(
    (page: number, sort: string, category: string) => {
      const params = new URLSearchParams();
      if (queryParam) params.set("search", queryParam);
      if (category && category !== "all") params.set("category", category);
      const sortApiValue = sortOptions.find((o) => o.value === sort)?.apiValue;
      if (sortApiValue) params.set("sort", sortApiValue);
      params.set("page", String(page));
      params.set("limit", String(RESULTS_PER_PAGE));
      return `/api/providers?${params.toString()}`;
    },
    [queryParam]
  );

  // Fetch providers when search params, sort, or filter change
  const fetchProviders = useCallback(
    async (page: number, append: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const url = buildApiUrl(page, sortBy, activeFilter);
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const newProviders: ProviderResult[] = data.providers || [];
          const pagination = data.pagination || {};

          if (append) {
            setProviders((prev) => [...prev, ...newProviders]);
          } else {
            setProviders(newProviders);
          }

          setTotalResults(pagination.total ?? 0);
          setHasMore(pagination.hasMore ?? false);
          setCurrentPage(pagination.page ?? page);
        }
      } catch {
        if (!append) {
          setProviders([]);
          setTotalResults(0);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [buildApiUrl, sortBy, activeFilter]
  );

  // Re-fetch when dependencies change (not appending)
  useEffect(() => {
    fetchProviders(1, false);
  }, [fetchProviders]);

  // Sync active filter when URL category param changes
  useEffect(() => {
    setActiveFilter(categoryParam || "all");
  }, [categoryParam]);

  // Build flat list of filter pills from categories
  const filterPills: { label: string; slug: string }[] = [{ label: "All", slug: "all" }];
  categories.forEach((parent) => {
    // Add parent category
    filterPills.push({ label: parent.name, slug: parent.slug });
    // Flatten subcategories
    parent.subcategories.forEach((sub) => {
      filterPills.push({ label: sub.name, slug: sub.slug });
    });
  });

  // Handle filter pill tap
  function handleFilterChange(slug: string) {
    setActiveFilter(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`/search?${params.toString()}`);
  }

  // Handle sort change
  function handleSortChange(value: string) {
    setSortBy(value);
  }

  // Handle search submission
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) {
      params.set("query", searchInput.trim());
    } else {
      params.delete("query");
    }
    router.push(`/search?${params.toString()}`);
  }

  // Handle load more
  function handleLoadMore() {
    fetchProviders(currentPage + 1, true);
  }

  // Helper: parse specialisations into tags
  function getTags(specialisations: string | null): string[] {
    if (!specialisations) return [];
    return specialisations
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 2);
  }

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
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search providers..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
        <button type="submit" className="input-field w-auto px-3 py-3 flex items-center" aria-label="Search">
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
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </form>

      {/* Category filters (horizontal scroll) */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-5 px-5 mb-3">
        {filterPills.map((pill) => (
          <button
            key={pill.slug}
            onClick={() => handleFilterChange(pill.slug)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors duration-150 ${
              activeFilter === pill.slug
                ? "bg-olive text-white"
                : "bg-cream text-warm-brown/70 border border-sand-dark/20"
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Results count + sort + view toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-warm-brown/60">
          <span className="font-medium text-charcoal">{totalResults}</span> result{totalResults !== 1 ? "s" : ""}
          {locationParam && (
            <>
              {" "}near <span className="font-medium text-charcoal">{locationParam}</span>
            </>
          )}
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
          onChange={(e) => handleSortChange(e.target.value)}
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

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-olive/30 border-t-olive rounded-full animate-spin mb-3" />
          <p className="text-sm text-warm-brown/50">Searching providers...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && providers.length === 0 && (
        <div className="py-12 text-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-3 text-warm-brown/30"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <p className="text-sm font-medium text-charcoal mb-1">No providers found</p>
          <p className="text-xs text-warm-brown/50">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Results list */}
      {!loading && providers.length > 0 && (
        <div className="space-y-3">
          {providers.map((result) => {
            const tags = getTags(result.specialisations);
            const isVerified = result.verificationStatus === "verified";

            return (
              <Link
                key={result.id}
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
                        {result.businessName}
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
                      {isVerified && (
                        <span className="verified-badge">
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0l1.67 2.36L12.4 1.4l.28 2.88 2.88.28-1.96 2.13L16 8l-2.36 1.67.96 2.73-2.88.28-.28 2.88-2.13-1.96L8 16l-1.67-2.36L3.6 14.6l-.28-2.88-2.88-.28L2.4 9.31 0 8l2.36-1.67L1.4 3.6l2.88-.28.28-2.88 2.13 1.96L8 0z" />
                            <path d="M6.5 10.5l-2-2 1-1 1 1 3-3 1 1-4 4z" fill="white" />
                          </svg>
                        </span>
                      )}
                      <span className="text-xs text-warm-brown/60">
                        {result.category?.name}
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
                      {result.town || "Location not specified"}
                      {result.distance !== null && (
                        <> &middot; {result.distance} miles</>
                      )}
                    </p>

                    {result.avgRating !== null && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Stars rating={result.avgRating} />
                        <span className="text-xs text-warm-brown/50">
                          {result.avgRating} ({result.reviewCount})
                        </span>
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {tags.map((tag) => (
                          <span key={tag} className="badge-olive">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {result.description && (
                  <p className="text-xs text-warm-brown/60 leading-relaxed mt-3 line-clamp-2">
                    {result.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Load more */}
      {!loading && hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="btn-secondary text-xs px-8 py-3"
          >
            {loadingMore ? "Loading..." : "Load more results"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Page (with Suspense boundary for useSearchParams) ---------- */

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="page-content pt-2">
          <div className="py-12 text-center">
            <div className="inline-block w-6 h-6 border-2 border-olive/30 border-t-olive rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
