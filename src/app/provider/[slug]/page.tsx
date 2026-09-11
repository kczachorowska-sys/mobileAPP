"use client";

import Link from "next/link";
import { useState } from "react";

/* ---------- Mock provider data ---------- */

const provider = {
  slug: "james-thornton-farrier",
  name: "James Thornton AWCF",
  category: "Farrier",
  location: "Newbury, Berkshire",
  distance: "3.2 miles away",
  rating: 4.9,
  reviewCount: 47,
  verified: true,
  phone: "07700 900123",
  email: "james@thorntonfarriery.co.uk",
  website: "www.thorntonfarriery.co.uk",
  whatsapp: "447700900123",
  about:
    "I'm a qualified AWCF farrier with over 15 years of experience working with horses of all types, from happy hackers to competition horses at the highest level. I trained under master farrier David Wilson in Yorkshire before moving south to establish my own practice in Berkshire.\n\nI believe in a patient, horse-first approach and work closely with vets and equine physios to ensure the best outcomes for every horse in my care.",
  services: [
    "Hot shoeing",
    "Cold shoeing",
    "Remedial farriery",
    "Corrective trimming",
    "Barefoot trimming",
    "Stud fitting",
    "Emergency call-outs",
  ],
  specialisations: [
    "Laminitis management",
    "Navicular support",
    "Club foot correction",
    "Performance horses",
    "Foal trimming",
  ],
  areasCovered: [
    "Newbury",
    "Hungerford",
    "Marlborough",
    "Wantage",
    "Lambourn",
    "Thatcham",
    "Kingsclere",
    "Andover",
  ],
  availability: {
    status: "Taking new clients",
    waitTime: "Approximately 2-3 week wait for new clients",
    schedule: "Monday to Friday, occasional Saturdays for emergencies",
  },
  priceGuide: [
    { service: "Full set of shoes (hot)", price: "From £120" },
    { service: "Full set of shoes (cold)", price: "From £100" },
    { service: "Front shoes only", price: "From £75" },
    { service: "Barefoot trim", price: "From £40" },
    { service: "Remedial work", price: "On consultation" },
    { service: "Emergency call-out", price: "From £150" },
  ],
  qualifications: [
    "AWCF - Associate of the Worshipful Company of Farriers",
    "DipWCF - Diploma of the Worshipful Company of Farriers",
    "Registered with the Farriers Registration Council",
    "Fully insured and DBS checked",
    "CPD certified - Laminitis management (2024)",
    "CPD certified - Equine biomechanics (2023)",
  ],
  reviews: [
    {
      id: "1",
      author: "Sarah M.",
      rating: 5,
      date: "3 weeks ago",
      text: "James has been shoeing my two horses for over three years now. He's always on time, brilliant with nervous horses, and does a fantastic job. Can't recommend him highly enough.",
      horseName: "Murphy & Bramble",
    },
    {
      id: "2",
      author: "Caroline T.",
      rating: 5,
      date: "1 month ago",
      text: "Took on my mare who had chronic laminitis issues. His remedial work has made such a difference - she's now comfortable in the field and even hacking out again. Worth every penny.",
      horseName: "Rosie",
    },
    {
      id: "3",
      author: "David H.",
      rating: 4,
      date: "2 months ago",
      text: "Very knowledgeable and thorough. Always explains what he's doing and why. The only reason for 4 stars is that he can be quite difficult to get hold of on the phone, but once you're booked in he's very reliable.",
      horseName: "Chester",
    },
  ],
  similarProviders: [
    {
      slug: "peter-wilkins-farrier",
      name: "Peter Wilkins DipWCF",
      category: "Farrier",
      location: "Hungerford",
      rating: 4.7,
      reviewCount: 23,
    },
    {
      slug: "alex-reid-farrier",
      name: "Alex Reid AWCF",
      category: "Farrier",
      location: "Lambourn",
      rating: 4.8,
      reviewCount: 35,
    },
  ],
};

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

/* ---------- Page ---------- */

export default function ProviderPage() {
  const [saved, setSaved] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayedReviews = showAllReviews
    ? provider.reviews
    : provider.reviews.slice(0, 2);

  return (
    <div className="page-content pt-0 px-0">
      {/* Hero image area */}
      <div className="relative h-56 bg-cream">
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
            5 photos
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="px-5 -mt-4 relative">
        {/* Name card */}
        <div className="card p-5 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-serif text-charcoal leading-tight">
                {provider.name}
              </h1>
              {provider.verified && (
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

          <div className="flex items-center gap-1.5 mt-2">
            <Stars rating={provider.rating} size={16} />
            <span className="text-sm font-medium text-charcoal">{provider.rating}</span>
            <span className="text-sm text-warm-brown/50">
              ({provider.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-warm-brown/70">
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
              {provider.category}
            </span>
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
              {provider.location}
            </span>
          </div>

          <p className="text-xs text-olive mt-1 ml-[18px]">{provider.distance}</p>
        </div>

        {/* Contact buttons */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {[
            {
              label: "Call",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              ),
              href: `tel:${provider.phone}`,
            },
            {
              label: "WhatsApp",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              ),
              href: `https://wa.me/${provider.whatsapp}`,
            },
            {
              label: "Email",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 7L2 7" />
                </svg>
              ),
              href: `mailto:${provider.email}`,
            },
            {
              label: "Website",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              ),
              href: `https://${provider.website}`,
            },
          ].map((action) => (
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

        {/* Availability status */}
        <div className="card p-4 mb-1 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-charcoal">
              {provider.availability.status}
            </p>
            <p className="text-xs text-warm-brown/60 mt-0.5">
              {provider.availability.waitTime}
            </p>
          </div>
        </div>

        {/* About */}
        <Section title="About">
          <div className="text-sm text-warm-brown/80 leading-relaxed whitespace-pre-line">
            {provider.about}
          </div>
        </Section>

        {/* Services */}
        <Section title="Services">
          <div className="flex flex-wrap gap-2">
            {provider.services.map((service) => (
              <span key={service} className="badge-olive">
                {service}
              </span>
            ))}
          </div>
        </Section>

        {/* Specialisations */}
        <Section title="Specialisations">
          <div className="flex flex-wrap gap-2">
            {provider.specialisations.map((spec) => (
              <span key={spec} className="badge-burgundy">
                {spec}
              </span>
            ))}
          </div>
        </Section>

        {/* Areas Covered */}
        <Section title="Areas Covered">
          <div className="flex flex-wrap gap-2">
            {provider.areasCovered.map((area) => (
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

        {/* Availability */}
        <Section title="Availability">
          <div className="card p-4 bg-cream/50">
            <p className="text-sm text-charcoal">{provider.availability.schedule}</p>
            <p className="text-xs text-warm-brown/60 mt-1">{provider.availability.waitTime}</p>
          </div>
        </Section>

        {/* Price Guide */}
        <Section title="Price Guide">
          <div className="space-y-0">
            {provider.priceGuide.map((item, i) => (
              <div
                key={item.service}
                className={`flex items-center justify-between py-3 ${
                  i < provider.priceGuide.length - 1
                    ? "border-b border-sand/40"
                    : ""
                }`}
              >
                <span className="text-sm text-charcoal">{item.service}</span>
                <span className="text-sm font-medium text-olive">{item.price}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-warm-brown/50 mt-3">
            Prices are a guide and may vary. Contact for an accurate quote.
          </p>
        </Section>

        {/* Qualifications */}
        <Section title="Qualifications &amp; Accreditations">
          <ul className="space-y-2.5">
            {provider.qualifications.map((qual) => (
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

        {/* Photos */}
        <Section title="Photos">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-32 h-32 rounded-xl bg-cream flex-shrink-0 flex items-center justify-center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  className="text-sand-dark/30"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            ))}
          </div>
        </Section>

        {/* Reviews */}
        <Section title="Reviews">
          <div className="flex items-center gap-3 mb-5">
            <div className="text-center">
              <p className="text-3xl font-serif text-charcoal">{provider.rating}</p>
              <Stars rating={provider.rating} size={14} />
              <p className="text-xs text-warm-brown/50 mt-1">
                {provider.reviewCount} reviews
              </p>
            </div>
            <div className="flex-1 space-y-1.5 ml-4">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count =
                  stars === 5
                    ? 38
                    : stars === 4
                    ? 7
                    : stars === 3
                    ? 2
                    : 0;
                const pct = Math.round((count / provider.reviewCount) * 100);
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
            {displayedReviews.map((review) => (
              <div key={review.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-xs font-medium text-warm-brown/60">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">
                        {review.author}
                      </p>
                      <p className="text-[11px] text-warm-brown/50">{review.date}</p>
                    </div>
                  </div>
                  <Stars rating={review.rating} size={12} />
                </div>
                <p className="text-sm text-warm-brown/80 leading-relaxed">
                  {review.text}
                </p>
                {review.horseName && (
                  <p className="text-xs text-olive mt-2 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 26C8 26 10 18 16 12C22 18 24 26 24 26" />
                    </svg>
                    {review.horseName}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!showAllReviews && provider.reviews.length > 2 && (
            <button
              onClick={() => setShowAllReviews(true)}
              className="btn-outline w-full mt-4 text-xs"
            >
              Show all {provider.reviewCount} reviews
            </button>
          )}
        </Section>

        {/* Similar Providers */}
        <Section title="Similar Providers">
          <div className="space-y-3">
            {provider.similarProviders.map((sp) => (
              <Link
                key={sp.slug}
                href={`/provider/${sp.slug}`}
                className="card p-4 flex items-center gap-3"
              >
                <div className="w-14 h-14 rounded-xl bg-cream flex-shrink-0 flex items-center justify-center">
                  <svg
                    width="22"
                    height="22"
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
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm text-charcoal">{sp.name}</h4>
                  <p className="text-xs text-warm-brown/60 mt-0.5">
                    {sp.category} &middot; {sp.location}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Stars rating={sp.rating} size={11} />
                    <span className="text-xs text-warm-brown/50">
                      {sp.rating} ({sp.reviewCount})
                    </span>
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-sand-dark/40"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>
        </Section>

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
