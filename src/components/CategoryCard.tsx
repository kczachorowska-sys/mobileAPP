'use client';

import Link from 'next/link';

interface CategoryCardProps {
  name: string;
  icon: string;
  slug: string;
}

export default function CategoryCard({ name, icon, slug }: CategoryCardProps) {
  return (
    <Link
      href={`/search?category=${slug}`}
      className="flex flex-col items-center justify-center gap-2 p-4 bg-cream border border-sand rounded-xl transition-all hover:shadow-md hover:border-sand-dark active:scale-[0.97]"
    >
      <div
        className="w-10 h-10 flex items-center justify-center text-olive"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <span className="text-xs font-medium text-charcoal text-center leading-tight">
        {name}
      </span>
    </Link>
  );
}
