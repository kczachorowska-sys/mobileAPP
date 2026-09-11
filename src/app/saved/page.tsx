"use client";

import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-ivory pb-20">
      <Header showProfile />

      <div className="px-5 pt-4">
        <h1 className="font-serif text-2xl text-charcoal">Saved</h1>
        <p className="text-sm text-warm-brown mt-1">
          Your favourite providers
        </p>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 mt-16">
        <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              stroke="#6B7B5E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="font-serif text-lg text-charcoal mb-2">
          No saved providers yet
        </h2>
        <p className="text-sm text-warm-brown text-center max-w-xs leading-relaxed">
          When you find providers you like, tap the heart icon to save them here
          for easy access.
        </p>
        <a
          href="/search"
          className="mt-6 bg-olive text-white px-6 py-3 rounded-lg font-medium text-sm"
        >
          Find Providers
        </a>
      </div>

      <BottomNav active="saved" />
    </div>
  );
}
