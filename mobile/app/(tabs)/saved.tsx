import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Spacing } from '../../constants/theme';
import Stars from '../../components/Stars';
import type { Provider } from '../../services/api';

const MOCK_SAVED: Provider[] = [
  {
    id: '1',
    slug: 'sarah-mitchell-equine-therapy',
    businessName: 'Sarah Mitchell Equine Therapy',
    categoryId: 'cat-1',
    description: 'Specialist equine physiotherapy and rehabilitation.',
    profileImage: null,
    phone: '07700 900123',
    email: 'sarah@equinetherapy.co.uk',
    website: 'https://equinetherapy.co.uk',
    whatsapp: null,
    instagram: null,
    facebook: null,
    address: '12 Stable Lane',
    postcode: 'OX1 1AA',
    town: 'Oxford',
    latitude: null,
    longitude: null,
    serviceRadius: 30,
    areasCovered: 'Oxford, Abingdon, Witney',
    priceRange: null,
    acceptingNewClients: true,
    verificationStatus: 'verified',
    isDemo: false,
    specialisations: 'Rehabilitation, Sports Therapy',
    qualifications: null,
    category: { id: 'cat-1', name: 'Equine Therapist', slug: 'equine-therapist' },
    services: [],
    reviews: [],
    photos: [],
    avgRating: 4.8,
    reviewCount: 12,
  },
  {
    id: '2',
    slug: 'james-henderson-farrier',
    businessName: 'James Henderson Farrier Services',
    categoryId: 'cat-2',
    description: 'Experienced farrier covering the Home Counties.',
    profileImage: null,
    phone: '07700 900456',
    email: 'james@hendersonfarrier.co.uk',
    website: null,
    whatsapp: '447700900456',
    instagram: null,
    facebook: null,
    address: '8 Forge Close',
    postcode: 'HP1 2BB',
    town: 'Hemel Hempstead',
    latitude: null,
    longitude: null,
    serviceRadius: 25,
    areasCovered: 'Hertfordshire, Buckinghamshire',
    priceRange: null,
    acceptingNewClients: true,
    verificationStatus: 'verified',
    isDemo: false,
    specialisations: 'Corrective Shoeing, Barefoot Trimming',
    qualifications: null,
    category: { id: 'cat-2', name: 'Farrier', slug: 'farrier' },
    services: [],
    reviews: [],
    photos: [],
    avgRating: 4.9,
    reviewCount: 24,
  },
  {
    id: '3',
    slug: 'meadow-brook-livery',
    businessName: 'Meadow Brook Livery Yard',
    categoryId: 'cat-3',
    description: 'Full and part livery in beautiful countryside setting.',
    profileImage: null,
    phone: '01onal 555123',
    email: 'info@meadowbrook.co.uk',
    website: 'https://meadowbrook.co.uk',
    whatsapp: null,
    instagram: null,
    facebook: null,
    address: 'Meadow Brook Farm',
    postcode: 'RG7 3CC',
    town: 'Reading',
    latitude: null,
    longitude: null,
    serviceRadius: null,
    areasCovered: 'Reading, Newbury',
    priceRange: null,
    acceptingNewClients: false,
    verificationStatus: 'pending',
    isDemo: false,
    specialisations: 'Full Livery, Part Livery',
    qualifications: null,
    category: { id: 'cat-3', name: 'Livery Yard', slug: 'livery-yard' },
    services: [],
    reviews: [],
    photos: [],
    avgRating: 4.5,
    reviewCount: 8,
  },
  {
    id: '4',
    slug: 'emma-clark-saddler',
    businessName: 'Emma Clark Saddlery',
    categoryId: 'cat-4',
    description: 'Bespoke saddle fitting and adjustments.',
    profileImage: null,
    phone: '07700 900789',
    email: 'emma@clarksaddlery.co.uk',
    website: 'https://clarksaddlery.co.uk',
    whatsapp: '447700900789',
    instagram: null,
    facebook: null,
    address: '5 The Workshop',
    postcode: 'GU1 4DD',
    town: 'Guildford',
    latitude: null,
    longitude: null,
    serviceRadius: 40,
    areasCovered: 'Surrey, Hampshire',
    priceRange: null,
    acceptingNewClients: true,
    verificationStatus: 'verified',
    isDemo: false,
    specialisations: 'Custom Fitting, Repairs',
    qualifications: null,
    category: { id: 'cat-4', name: 'Saddler', slug: 'saddler' },
    services: [],
    reviews: [],
    photos: [],
    avgRating: 4.7,
    reviewCount: 15,
  },
];

function splitTags(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2);
}

export default function SavedScreen() {
  const router = useRouter();
  const [savedProviders, setSavedProviders] = useState<Provider[]>(MOCK_SAVED);

  const removeProvider = (id: string) => {
    setSavedProviders((prev) => prev.filter((p) => p.id !== id));
  };

  if (savedProviders.length === 0) {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={48} color={Colors.sandDark} />
          </View>
          <Text style={styles.emptyTitle}>No saved providers yet</Text>
          <Text style={styles.emptyBody}>
            When you find providers you like, tap the heart icon to save them here for
            easy access later.
          </Text>
          <Pressable
            style={styles.emptyBtn}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Text style={styles.emptyBtnText}>Find providers</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved</Text>
          <Text style={styles.headerSubtitle}>
            {savedProviders.length}{' '}
            {savedProviders.length === 1 ? 'provider' : 'providers'}
          </Text>
        </View>

        <View style={styles.list}>
          {savedProviders.map((provider) => {
            const isVerified = provider.verificationStatus === 'verified';
            const tags = splitTags(provider.specialisations);

            return (
              <View key={provider.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={styles.imagePlaceholder}>
                    <Ionicons
                      name="leaf-outline"
                      size={24}
                      color={Colors.sandDark + '60'}
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <View style={styles.titleRow}>
                      <Text style={styles.name} numberOfLines={2}>
                        {provider.businessName}
                      </Text>
                      <Pressable
                        hitSlop={8}
                        onPress={() => removeProvider(provider.id)}
                      >
                        <Ionicons name="heart" size={20} color={Colors.burgundy} />
                      </Pressable>
                    </View>

                    {isVerified && (
                      <View style={styles.verifiedRow}>
                        <Ionicons
                          name="checkmark-circle"
                          size={13}
                          color={Colors.olive}
                        />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}

                    <Text style={styles.meta}>
                      {provider.category?.name} · {provider.town}
                    </Text>

                    {provider.avgRating != null && provider.avgRating > 0 && (
                      <View style={styles.ratingRow}>
                        <Stars rating={provider.avgRating} size={13} />
                        <Text style={styles.ratingText}>
                          {provider.avgRating} ({provider.reviewCount})
                        </Text>
                      </View>
                    )}

                    {tags.length > 0 && (
                      <View style={styles.tagsRow}>
                        {tags.map((tag) => (
                          <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.actionRow}>
                      <Pressable
                        style={styles.actionBtn}
                        onPress={() =>
                          router.push(`/provider/${provider.slug}`)
                        }
                      >
                        <Text style={styles.actionBtnText}>View profile</Text>
                      </Pressable>
                      <Pressable
                        style={styles.actionBtnOutline}
                        onPress={() => {
                          if (provider.phone) {
                            // Contact action placeholder
                          }
                        }}
                      >
                        <Text style={styles.actionBtnOutlineText}>Contact</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    color: Colors.charcoal,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.warmBrown + '90',
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.sand + '60',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  name: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    color: Colors.charcoal,
    flex: 1,
    lineHeight: 20,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  verifiedText: {
    fontSize: 11,
    color: Colors.olive,
    fontWeight: '500',
  },
  meta: {
    fontSize: 12,
    color: Colors.warmBrown + '90',
    marginTop: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.warmBrown + '80',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.olive + '12',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    color: Colors.olive,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.olive,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  actionBtnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.olive,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnOutlineText: {
    color: Colors.olive,
    fontSize: 13,
    fontWeight: '600',
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.sand + '60',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Colors.charcoal,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    color: Colors.warmBrown + '90',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
  },
  emptyBtn: {
    marginTop: 24,
    backgroundColor: Colors.olive,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
