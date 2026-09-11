'use client';

import Link from 'next/link';

interface HeaderProps {
  showProfile?: boolean;
}

export default function Header({ showProfile = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-ivory border-b border-sand">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center">
          <h1 className="font-serif text-2xl font-bold text-deep-brown tracking-tight">
            EquiFind
          </h1>
        </Link>

        {showProfile && (
          <Link
            href="/profile"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-cream border border-sand-dark transition-colors hover:bg-sand"
            aria-label="Profile"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5D4037"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        )}
      </div>
    </header>
  );
}
