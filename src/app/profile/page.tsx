"use client";

import { useState } from "react";

/* ---------- Mock user data ---------- */

const mockUser = {
  name: "Charlotte Winslow",
  email: "charlotte.winslow@email.co.uk",
  location: "Newbury, Berkshire",
  initials: "CW",
  horsesCount: 2,
  savedCount: 4,
  reviewsCount: 3,
};

/* ---------- Settings links ---------- */

const settingsSections = [
  {
    title: "Account",
    items: [
      {
        label: "Edit Profile",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ),
      },
      {
        label: "My Horses",
        icon: (
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 26C8 26 10 18 16 12C22 18 24 26 24 26" />
          </svg>
        ),
      },
      {
        label: "My Reviews",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ),
      },
      {
        label: "Notification Settings",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        label: "Location Settings",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        ),
      },
      {
        label: "Default Search Radius",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        label: "Help & FAQ",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        ),
      },
      {
        label: "About EquiFind",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        ),
      },
      {
        label: "Privacy Policy",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        ),
      },
      {
        label: "Terms of Service",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
    ],
  },
];

/* ---------- Page ---------- */

export default function ProfilePage() {
  const [isLoggedIn] = useState(true);

  return (
    <div className="page-content">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-serif text-charcoal">Profile</h1>
      </header>

      {isLoggedIn ? (
        <>
          {/* User card */}
          <div className="card p-5 mb-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-serif text-olive">
                  {mockUser.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-lg text-charcoal">
                  {mockUser.name}
                </h2>
                <p className="text-sm text-warm-brown/60 truncate">
                  {mockUser.email}
                </p>
                <p className="text-xs text-warm-brown/50 mt-0.5 flex items-center gap-1">
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
                  {mockUser.location}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-sand/40">
              <div className="text-center">
                <p className="text-lg font-serif text-charcoal">
                  {mockUser.horsesCount}
                </p>
                <p className="text-[11px] text-warm-brown/50">Horses</p>
              </div>
              <div className="text-center border-x border-sand/40">
                <p className="text-lg font-serif text-charcoal">
                  {mockUser.savedCount}
                </p>
                <p className="text-[11px] text-warm-brown/50">Saved</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-serif text-charcoal">
                  {mockUser.reviewsCount}
                </p>
                <p className="text-[11px] text-warm-brown/50">Reviews</p>
              </div>
            </div>
          </div>

          {/* Provider CTA */}
          <div className="card p-5 mb-6 bg-gradient-to-br from-olive/5 to-cream border-olive/15">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-olive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-olive"
                >
                  <rect x="2" y="7" width="20" height="15" rx="2" />
                  <path d="M16 7V5a4 4 0 00-8 0v2" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-[15px] text-charcoal">
                  Are you an equestrian professional?
                </h3>
                <p className="text-xs text-warm-brown/60 mt-1 leading-relaxed">
                  List your business on EquiFind and connect with horse owners
                  across the UK.
                </p>
                <button className="btn-primary text-xs px-5 py-2.5 mt-3">
                  List your business
                </button>
              </div>
            </div>
          </div>

          {/* Settings sections */}
          {settingsSections.map((section) => (
            <div key={section.title} className="mb-5">
              <h3 className="text-xs font-medium text-warm-brown/50 uppercase tracking-wider mb-2 px-1">
                {section.title}
              </h3>
              <div className="card overflow-hidden">
                {section.items.map((item, i) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm text-charcoal active:bg-cream/50 transition-colors ${
                      i < section.items.length - 1
                        ? "border-b border-sand/30"
                        : ""
                    }`}
                  >
                    <span className="text-warm-brown/50">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg
                      width="14"
                      height="14"
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
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Sign out */}
          <div className="mt-4 mb-2">
            <button className="w-full text-center text-sm text-burgundy/70 py-3 active:text-burgundy transition-colors">
              Sign Out
            </button>
          </div>

          {/* Version */}
          <div className="text-center mt-4">
            <p className="text-[11px] text-warm-brown/30">EquiFind v1.0.0</p>
          </div>
        </>
      ) : (
        /* Guest state */
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-cream mx-auto flex items-center justify-center mb-5">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-sand-dark/50"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-lg font-serif text-charcoal mb-2">
            Welcome to EquiFind
          </h2>
          <p className="text-sm text-warm-brown/60 max-w-[280px] mx-auto leading-relaxed mb-6">
            Create an account to save providers, leave reviews, and manage your
            preferences.
          </p>
          <div className="space-y-3 max-w-[280px] mx-auto">
            <button className="btn-primary w-full">Create Account</button>
            <button className="btn-secondary w-full">Sign In</button>
          </div>
        </div>
      )}
    </div>
  );
}
