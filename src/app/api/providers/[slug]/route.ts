import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const provider = await prisma.provider.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            parentCategory: true,
          },
        },
        services: {
          orderBy: { serviceName: 'asc' },
        },
        reviews: {
          where: { status: 'approved' },
          include: {
            user: {
              select: {
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        photos: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const ratings = provider.reviews.map((r) => r.rating)
    const avgRating =
      ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : null
    const reviewCount = ratings.length

    return NextResponse.json({
      ...provider,
      avgRating,
      reviewCount,
    })
  } catch (error) {
    console.error('Error fetching provider:', error)
    return NextResponse.json(
      { error: 'Failed to fetch provider' },
      { status: 500 }
    )
  }
}
