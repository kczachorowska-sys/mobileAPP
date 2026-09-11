import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Fetch all parent categories with their subcategories and provider counts
    const parentCategories = await prisma.category.findMany({
      where: {
        parentCategoryId: null,
        active: true,
      },
      include: {
        subcategories: {
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: {
              select: { providers: true },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })

    // Shape the response
    const categories = parentCategories.map((parent) => ({
      id: parent.id,
      name: parent.name,
      slug: parent.slug,
      description: parent.description,
      icon: parent.icon,
      subcategories: parent.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        icon: sub.icon,
        providerCount: sub._count.providers,
      })),
    }))

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
