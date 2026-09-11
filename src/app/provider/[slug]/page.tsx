"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

/* ---------- Types ---------- */

interface ProviderCategory {
  id: string;
  name: string;
  slug: string;
}

interface ProviderService {
  id: string;
  serviceName: string;
  description: string | null;
  priceFrom: number | null;
  priceTo: number | null;
}

interface ProviderReview {
  id: string;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  user: {
    name: string | null;
    profileImage: string | null;
  };
}

interface ProviderPhoto {
  id: string;
  url: string;
  caption: string | null;
}

interface ProviderData {
  id: string;
  slug: string;
  businessName: string;
  description: string | null;
  profileImage: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  address: string | null;
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
  category: ProviderCategory;
  services: ProviderService[];
  reviews: ProviderReview[];
  photos: ProviderPhoto[];
  avgRating: number | null;
  reviewCount: number;
}

/* ---------- Helpers ---------- */

function splitCommaSeparated(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatPrice(priceFrom: number | null, priceTo: number | null): string {
  if (priceFrom != null && priceTo != null) {
    if (priceFrom === priceTo) return `£${priceFrom}`;
    return `£${priceFrom} – £${priceTo}`;
  }
  if (priceFrom != null) return `From £${priceFrom}`;
  if (priceTo != null) return `Up to £${priceTo}`;
  return "On consultation";
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  const years = Math.floor(diffDays / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

/* ---------- Stars component ---------- */

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
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

/* ---------- Section component ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="divider" />
      <section>
        <h3 className="section-heading">{title}</h3>
        {children}
      </section>
    </>
  );
}

/* ---------- Loading Skeleton ---------- */

function LoadingSkeleton() {
  return (
    <div className="page-content pt-0 px-0 animate-pulse">
      {/* Hero shimmer */}
      <div className="relative h-56 bg-cream" />

      <div className="px-5 -mt-4 relative">
        {/* Name card shimmer */}
        <div className="card p-5 mb-4">
          <div className="h-6 bg-sand/60 rounded w-3/4 mb-3" />
          <div className="h-4 bg-sand/60 rounded w-1/3 mb-2" />
          <div className="h-4 bg-sand/60 rounded w-1/2" />
        </div>

        {/* Contact buttons shimmer */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-cream" />
          ))}
        </div>

        {/* Availability shimmer */}
        <div className="card p-4 mb-1">
          <div className="h-4 bg-sand/60 rounded w-2/3 mb-2" />
          <div className="h-3 bg-sand/60 rounded w-1/2" />
        </div>

        {/* About shimmer */}
        <div className="divider" />
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-sand/60 rounded w-full" />
          <div className="h-4 bg-sand/60 rounded w-full" />
          <div className="h-4 bg-sand/60 rounded w-5/6" />
          <div className="h-4 bg-sand/60 rounded w-2/3" />
        </div>

        {/* Services shimmer */}
        <div className="divider" />
        <div className="flex flex-wrap gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-7 bg-sand/60 rounded-full w-24" />
          ))}
        </div>

        {/* More sections shimmer */}
        <div className="divider" />
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-sand/60 rounded w-2/3" />
          <div className="h-4 bg-sand/60 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Not Found ---------- */

function ProviderNotFound() {
  return (
    <div className="page-content flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
      <svg
        width="64"
        height="64"
        viewBox="0 0 32 32"
        fill="none"
        className="text-sand-dark/30 mb-4"
      >
        <path
          d="M8 26C8 26 10 18 16 12C22 18 24 26 24 26"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      <h2 className="text-xl font-serif text-charcoal mb-2">Provider not found</h2>
      <p className="text-sm text-warm-brown/60 mb-6">
        This provider may have been removed or the link may be incorrect.
      </p>
      <Link href="/search" className="btn-primary text-sm">
        Back to search
      </Link>
    </div>
  );
}

/* ---------- Page ---------- */

export default function ProviderPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function fetchProvider() {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await fetch(`/api/providers/${slug}`);
        if (!cancelled) {
          if (res.status === 404) {
            setNotFound(true);
            setProvider(null);
          } else if (res.ok) {
            const data: ProviderData = await res.json();
            setProvider(data);
          } else {
            setNotFound(true);
            setProvider(null);
          }
        }
      } catch {
        if (!cancelled) {
          setNotFound(true);
          setProvider(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProvider();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (notFound || !provider) {
    return <ProviderNotFound />;
  }

  const specialisations = splitCommaSeparated(provider.specialisations);
  const areasCovered = splitCommaSeparated(provider.areasCovered);
  const qualifications = splitCommaSeparated(provider.qualifications);
  const isVerified = provider.verificationStatus === "verified";
  const location = [provider.town, provider.postcode].filter(Boolean).join(", ");
  const rating = provider.avgRating ?? 0;
  const reviews = provider.reviews ?? [];
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  // Calculate rating distribution from actual reviews
  const ratingDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const bucket = Math.min(5, Math.max(1, Math.round(r.rating)));
    ratingDistribution[bucket] = (ratingDistribution[bucket] || 0) + 1;
  });

  // Build contact actions dynamically, filtering out null fields
  const contactActions: {
    label: string;
    icon: React.ReactNode;
    href: string;
  }[] = [];

  if (provider.phone) {
    contactActions.push({
      label: "Call",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
      href: `tel:${provider.phone}`,
    });
  }

  if (provider.whatsapp) {
    contactActions.push({
      label: "WhatsApp",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      href: `https://wa.me/${provider.whatsapp}`,
    });
  }

  if (provider.email) {
    contactActions.push({
      label: "Email",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-10 7L2 7" />
        </svg>
      ),
      href: `mailto:${provider.email}`,
    });
  }

  if (provider.website) {
    const websiteUrl = provider.website.startsWith("http")
      ? provider.website
      : `https://${provider.website}`;
    contactActions.push({
      label: "Website",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      ),
      href: websiteUrl,
    });
  }

  return (
    <div className="page-content pt-0 px-0">
      {/* Hero image area */}
      <div className="relative h-56 bg-cream">
        {provider.profileImage ? (
          <img
            src={provider.profileImage}
            alt={provider.businessName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 image-placeholder flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 32 32"
              fill="none"
              className="text-sand-dark/30"
            >
              <path
                d="M8 26C8 26 10 18 16 12C22 18 24 26 24 26"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </div>
        )}

        {/* Top bar overlay */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-[calc(1rem+var(--safe-area-top))]">
          <Link
            href="/search"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
            aria-label="Back"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2C2C2C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex gap-2">
            <button
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
              aria-label="Share"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2C2C2C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
              aria-label={saved ? "Unsave" : "Save"}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={saved ? "#722F37" : "none"}
                stroke={saved ? "#722F37" : "#2C2C2C"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Photo count badge */}
        {provider.photos.length > 0 && (
          <div className="absolute bottom-3 right-4">
            <span className="bg-charcoal/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {provider.photos.length} {provider.photos.length === 1 ? "photo" : "photos"}
            </span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="px-5 -mt-4 relative">
        {/* Name card */}
        <div className="card p-5 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-serif text-charcoal leading-tight">
                {provider.businessName}
              </h1>
              {isVerified && (
                <span className="verified-badge mt-1">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0l1.67 2.36L12.4 1.4l.28 2.88 2.88.28-1.96 2.13L16 8l-2.36 1.67.96 2.73-2.88.28-.28 2.88-2.13-1.96L8 16l-1.67-2.36L3.6 14.6l-.28-2.88-2.88-.28L2.4 9.31 0 8l2.36-1.67L1.4 3.6l2.88-.28.28-2.88 2.13 1.96L8 0z" />
                    <path d="M6.5 10.5l-2-2 1-1 1 1 3-3 1 1-4 4z" fill="white" />
                  </svg>
                  Verified professional
                </span>
              )}
            </div>
          </div>

          {provider.reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <Stars rating={rating} size={16} />
              <span className="text-sm font-medium text-charcoal">{rating}</span>
              <span className="text-sm text-warm-brown/50">
                ({provider.reviewCount} {provider.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 mt-3 text-sm text-warm-brown/70">
            {provider.category?.name && (
              <span className="flex items-center gap-1">
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
                  <rect x="2" y="7" width="20" height="15" rx="2" />
                  <path d="M16 7V5a4 4 0 00-8 0v2" />
                </svg>
                {provider.category.name}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1">
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
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {location}
              </span>
            )}
          </div>
        </div>

        {/* Contact buttons */}
        {contactActions.length > 0 && (
          <div className={`grid grid-cols-${Math.min(contactActions.length, 4)} gap-2 mb-2`}>
            {contactActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-cream text-olive active:bg-sand transition-colors"
              >
                {action.icon}
                <span className="text-[11px] font-medium text-warm-brown/70">
                  {action.label}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Availability status */}
        <div className="card p-4 mb-1 flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              provider.acceptingNewClients ? "bg-green-500" : "bg-warm-brown/40"
            }`}
          />
          <div>
            <p className="text-sm font-medium text-charcoal">
              {provider.acceptingNewClients
                ? "Taking new clients"
                : "Not currently accepting new clients"}
            </p>
          </div>
        </div>

        {/* About */}
        {provider.description && (
          <Section title="About">
            <div className="text-sm text-warm-brown/80 leading-relaxed whitespace-pre-line">
              {provider.description}
            </div>
          </Section>
        )}

        {/* Services */}
        {provider.services.length > 0 && (
          <Section title="Services">
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service) => (
                <span key={service.id} className="badge-olive">
                  {service.serviceName}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Specialisations */}
        {specialisations.length > 0 && (
          <Section title="Specialisations">
            <div className="flex flex-wrap gap-2">
              {specialisations.map((spec) => (
                <span key={spec} className="badge-burgundy">
                  {spec}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Areas Covered */}
        {areasCovered.length > 0 && (
          <Section title="Areas Covered">
            <div className="flex flex-wrap gap-2">
              {areasCovered.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-cream text-warm-brown/70"
                >
                  <svg
                    width="10"
                    height="10"
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
                  {area}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Price Guide */}
        {provider.services.length > 0 &&
          provider.services.some((s) => s.priceFrom != null || s.priceTo != null) && (
          <Section title="Price Guide">
            <div className="space-y-0">
              {provider.services.map((service, i) => (
                <div
                  key={service.id}
                  className={`flex items-center justify-between py-3 ${
                    i < provider.services.length - 1
                      ? "border-b border-sand/40"
                      : ""
                  }`}
                >
                  <span className="text-sm text-charcoal">{service.serviceName}</span>
                  <span className="text-sm font-medium text-olive">
                    {formatPrice(service.priceFrom, service.priceTo)}
                  </span>
                </div>
              ))}
            </div>
            {provider.priceRange && (
              <p className="text-xs text-warm-brown/50 mt-3">
                General price range: {provider.priceRange}
              </p>
            )}
            <p className="text-xs text-warm-brown/50 mt-1">
              Prices are a guide and may vary. Contact for an accurate quote.
            </p>
          </Section>
        )}

        {/* Price Range fallback (when no service prices but priceRange exists) */}
        {provider.priceRange &&
          !provider.services.some((s) => s.priceFrom != null || s.priceTo != null) && (
          <Section title="Price Guide">
            <p className="text-sm text-charcoal">{provider.priceRange}</p>
            <p className="text-xs text-warm-brown/50 mt-3">
              Prices are a guide and may vary. Contact for an accurate quote.
            </p>
          </Section>
        )}

        {/* Qualifications */}
        {qualifications.length > 0 && (
          <Section title="Qualifications &amp; Accreditations">
            <ul className="space-y-2.5">
              {qualifications.map((qual) => (
                <li key={qual} className="flex items-start gap-2.5 text-sm text-warm-brown/80">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-olive flex-shrink-0 mt-0.5"
                  >
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  {qual}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Photos */}
        {provider.photos.length > 0 && (
          <Section title="Photos">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
              {provider.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="w-32 h-32 rounded-xl bg-cream flex-shrink-0 overflow-hidden"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || "Provider photo"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <Section title="Reviews">
            <div className="flex items-center gap-3 mb-5">
              <div className="text-center">
                <p className="text-3xl font-serif text-charcoal">{rating}</p>
                <Stars rating={rating} size={14} />
                <p className="text-xs text-warm-brown/50 mt-1">
                  {provider.reviewCount} {provider.reviewCount === 1 ? "review" : "reviews"}
                </p>
              </div>
              <div className="flex-1 space-y-1.5 ml-4">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingDistribution[stars] || 0;
                  const pct =
                    provider.reviewCount > 0
                      ? Math.round((count / provider.reviewCount) * 100)
                      : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-xs text-warm-brown/50 w-3">{stars}</span>
                      <div className="flex-1 h-1.5 bg-sand/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {displayedReviews.map((review) => {
                const authorName = review.user?.name || "Anonymous";
                return (
                  <div key={review.id} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-xs font-medium text-warm-brown/60">
                          {authorName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-charcoal">
                            {authorName}
                          </p>
                          <p className="text-[11px] text-warm-brown/50">
                            {formatRelativeDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Stars rating={review.rating} size={12} />
                    </div>
                    {review.reviewText && (
                      <p className="text-sm text-warm-brown/80 leading-relaxed">
                        {review.reviewText}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {!showAllReviews && reviews.length > 2 && (
              <button
                onClick={() => setShowAllReviews(true)}
                className="btn-outline w-full mt-4 text-xs"
              >
                Show all {provider.reviewCount} reviews
              </button>
            )}
          </Section>
        )}

        {/* Report */}
        <div className="text-center mt-8 mb-4">
          <button className="text-xs text-warm-brown/40 underline underline-offset-2">
            Report this listing
          </button>
        </div>
      </div>
    </div>
  );
}
