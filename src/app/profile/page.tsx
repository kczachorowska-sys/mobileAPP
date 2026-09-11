"use client";

import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-ivory pb-20">
      <Header />

      <div className="px-5 pt-4">
        <h1 className="font-serif text-2xl text-charcoal">Profile</h1>
      </div>

      {/* Guest State */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-sand/50 text-center">
          <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke="#6B7B5E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="#6B7B5E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="font-serif text-lg text-charcoal mb-2">
            Welcome to EquiFind
          </h2>
          <p className="text-sm text-warm-brown leading-relaxed mb-6">
            Create an account to save your favourite providers, leave reviews,
            and manage your profile.
          </p>
          <button className="w-full bg-olive text-white py-3 rounded-lg font-medium text-sm mb-3">
            Create Account
          </button>
          <button className="w-full bg-cream text-charcoal py-3 rounded-lg font-medium text-sm border border-sand">
            Sign In
          </button>
        </div>
      </div>

      {/* Provider CTA */}
      <div className="px-5 mt-6">
        <div className="bg-gradient-to-br from-olive/10 to-cream rounded-xl p-5 border border-olive/20">
          <h3 className="font-serif text-base text-charcoal mb-1">
            Are you an equestrian professional?
          </h3>
          <p className="text-sm text-warm-brown mb-4 leading-relaxed">
            List your business on EquiFind and reach horse owners across the UK.
          </p>
          <button className="bg-olive text-white px-5 py-2.5 rounded-lg font-medium text-sm">
            List Your Business
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-sand/50 divide-y divide-sand/50">
          {[
            { label: "About EquiFind", icon: "info" },
            { label: "Help & Support", icon: "help" },
            { label: "Privacy Policy", icon: "shield" },
            { label: "Terms of Service", icon: "doc" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-5 py-4 text-sm text-charcoal"
            >
              <span>{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="#D4C5B5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-6 text-center">
        <p className="text-xs text-warm-brown/40">EquiFind v1.0.0</p>
        <p className="text-xs text-warm-brown/40 mt-1">
          Find the right people for your horse.
        </p>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
