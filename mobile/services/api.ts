import Constants from 'expo-constants';

const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:3000`;
  }
  return 'http://localhost:3000';
};

const BASE_URL = getBaseUrl();

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  providerCount: number;
}

export interface Provider {
  id: string;
  slug: string;
  businessName: string;
  categoryId: string;
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
  category: {
    id: string;
    name: string;
    slug: string;
    parentCategory?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  services: Service[];
  reviews: Review[];
  photos: { id: string; url: string; caption: string | null }[];
  avgRating: number | null;
  reviewCount: number;
  distance?: number | null;
}

export interface Service {
  id: string;
  serviceName: string;
  description: string | null;
  priceFrom: number | null;
  priceTo: number | null;
}

export interface Review {
  id: string;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  user: {
    name: string | null;
    profileImage: string | null;
  };
}

export interface ProvidersResponse {
  providers: Provider[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchJson<{ categories: Category[] }>('/api/categories');
  return data.categories;
}

export async function getProviders(params?: {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
  radius?: number;
}): Promise<ProvidersResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category) query.set('category', params.category);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.lat) query.set('lat', String(params.lat));
  if (params?.lng) query.set('lng', String(params.lng));
  if (params?.radius) query.set('radius', String(params.radius));
  const qs = query.toString();
  return fetchJson<ProvidersResponse>(`/api/providers${qs ? `?${qs}` : ''}`);
}

export async function getProvider(slug: string): Promise<Provider> {
  return fetchJson<Provider>(`/api/providers/${slug}`);
}
