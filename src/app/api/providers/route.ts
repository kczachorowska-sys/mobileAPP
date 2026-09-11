import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Calculate distance between two coordinates using the Haversine formula.
 * Returns distance in miles.
 */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8 // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius')
    const sort = searchParams.get('sort') // 'distance' | 'rating' | 'name' | 'newest'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50)

    // Build where clause
    const where: Record<string, unknown> = {}

    // Filter by category slug (matches subcategory or parent category)
    if (category) {
      // First check if this is a parent category
      const parentCategory = await prisma.category.findUnique({
        where: { slug: category },
        include: { subcategories: true },
      })

      if (parentCategory && parentCategory.subcategories.length > 0) {
        // It is a parent category -- match all its subcategories
        where.categoryId = {
          in: parentCategory.subcategories.map((sc) => sc.id),
        }
      } else if (parentCategory) {
        // It is a subcategory
        where.categoryId = parentCategory.id
      }
    }

    // Search by business name, description, town, or postcode
    if (search) {
      where.OR = [
        { businessName: { contains: search } },
        { description: { contains: search } },
        { town: { contains: search } },
        { postcode: { contains: search } },
        { areasCovered: { contains: search } },
      ]
    }

    // Fetch providers with reviews and category
    const providers = await prisma.provider.findMany({
      where,
      include: {
        category: {
          include: {
            parentCategory: true,
          },
        },
        reviews: {
          where: { status: 'approved' },
          select: { rating: true },
        },
        services: {
          select: {
            serviceName: true,
            priceFrom: true,
            priceTo: true,
          },
        },
      },
    })

    // Calculate average rating and distance for each provider
    const userLat = lat ? parseFloat(lat) : null
    const userLng = lng ? parseFloat(lng) : null
    const maxRadius = radius ? parseFloat(radius) : null

    const enriched = providers.map((provider) => {
      const ratings = provider.reviews.map((r) => r.rating)
      const avgRating =
        ratings.length > 0
          ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
          : null
      const reviewCount = ratings.length

      let distance: number | null = null
      if (
        userLat !== null &&
        userLng !== null &&
        provider.latitude !== null &&
        provider.longitude !== null
      ) {
        distance = Math.round(
          haversineDistance(userLat, userLng, provider.latitude, provider.longitude) * 10
        ) / 10
      }

      // Strip raw reviews from response (only send aggregates)
      const { reviews: _reviews, ...providerData } = provider

      return {
        ...providerData,
        avgRating,
        reviewCount,
        distance,
      }
    })

    // Filter by radius if location provided
    let filtered = enriched
    if (userLat !== null && userLng !== null && maxRadius !== null) {
      filtered = enriched.filter(
        (p) => p.distance !== null && p.distance <= maxRadius
      )
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sort) {
        case 'distance':
          if (a.distance === null) return 1
          if (b.distance === null) return -1
          return a.distance - b.distance
        case 'rating':
          if (a.avgRating === null) return 1
          if (b.avgRating === null) return -1
          return b.avgRating - a.avgRating
        case 'name':
          return a.businessName.localeCompare(b.businessName)
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          // Default: sort by rating, then distance
          if (a.avgRating !== null && b.avgRating !== null && a.avgRating !== b.avgRating) {
            return b.avgRating - a.avgRating
          }
          if (a.distance !== null && b.distance !== null) {
            return a.distance - b.distance
          }
          return 0
      }
    })

    // Paginate
    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginated = filtered.slice(offset, offset + limit)

    return NextResponse.json({
      providers: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    )
  }
}
