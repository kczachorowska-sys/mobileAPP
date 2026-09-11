import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Spacing } from '../../constants/theme';
import { getCategories, getProviders } from '../../services/api';
import type { Category, Provider } from '../../services/api';
import ProviderCard from '../../components/ProviderCard';

const CATEGORY_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  farriers: 'hammer',
  vets: 'medkit',
  physios: 'fitness',
  instructors: 'school',
  livery: 'home',
  'saddle-fitters': 'construct',
  'tack-shops': 'bag',
  transport: 'car',
};

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [recommended, setRecommended] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceQuery, setServiceQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [cats, provRes] = await Promise.all([
          getCategories(),
          getProviders({ limit: 3, sort: 'rating' }),
        ]);
        if (!cancelled) {
          setCategories(cats);
          setRecommended(provRes.providers);
        }
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (serviceQuery.trim()) params.set('query', serviceQuery.trim());
    if (locationQuery.trim()) params.set('location', locationQuery.trim());
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : '/search');
  }, [serviceQuery, locationQuery, router]);

  const handleCategoryPress = useCallback(
    (slug: string) => {
      router.push(`/search?category=${slug}`);
    },
    [router],
  );

  const getCategoryIcon = (slug: string): React.ComponentProps<typeof Ionicons>['name'] => {
    return CATEGORY_ICONS[slug] ?? 'ellipsis-horizontal';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.olive} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EquiFind</Text>
        <Text style={styles.headerSubtitle}>EQUESTRIAN SERVICES</Text>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Find the right people for your horse.</Text>
        <Text style={styles.heroSubtitle}>
          Browse trusted equestrian professionals in your area.
        </Text>
      </View>

      {/* Search Card */}
      <View style={styles.searchCard}>
        <View style={styles.inputRow}>
          <Ionicons name="search" size={18} color={Colors.sandDark} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="What service do you need?"
            placeholderTextColor={Colors.sandDark}
            value={serviceQuery}
            onChangeText={setServiceQuery}
            returnKeyType="next"
          />
        </View>
        <View style={styles.inputDivider} />
        <View style={styles.inputRow}>
          <Ionicons name="location" size={18} color={Colors.sandDark} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor={Colors.sandDark}
            value={locationQuery}
            onChangeText={setLocationQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <View style={styles.categoryGrid}>
          {categories.slice(0, 8).map((cat) => {
            const totalProviders = cat.subcategories.reduce(
              (sum, sub) => sum + sub.providerCount,
              0,
            );
            return (
              <Pressable
                key={cat.id}
                style={styles.categoryTile}
                onPress={() => handleCategoryPress(cat.slug)}
              >
                <View style={styles.categoryIconCircle}>
                  <Ionicons
                    name={getCategoryIcon(cat.slug)}
                    size={24}
                    color={Colors.olive}
                  />
                </View>
                <Text style={styles.categoryName} numberOfLines={1}>
                  {cat.name}
                </Text>
                <Text style={styles.categoryCount}>
                  {totalProviders} {totalProviders === 1 ? 'provider' : 'providers'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Recommended */}
      {recommended.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          {recommended.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Header */
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    color: Colors.charcoal,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.sans,
    fontWeight: '600',
    color: Colors.olive,
    letterSpacing: 3,
    marginTop: 4,
  },

  /* Hero */
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  heroTitle: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    color: Colors.charcoal,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Colors.warmBrown,
    marginTop: Spacing.sm,
    lineHeight: 22,
  },

  /* Search Card */
  searchCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Colors.charcoal,
    paddingVertical: 12,
  },
  inputDivider: {
    height: 1,
    backgroundColor: Colors.sand,
    marginVertical: 2,
  },
  searchButton: {
    backgroundColor: Colors.olive,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  searchButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },

  /* Section */
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Colors.charcoal,
    marginBottom: Spacing.md,
  },

  /* Category Grid */
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.md,
  },
  categoryTile: {
    width: '23%',
    alignItems: 'center',
  },
  categoryIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.olive + '14',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  categoryName: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.charcoal,
    textAlign: 'center',
    marginTop: 2,
  },
  categoryCount: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    color: Colors.warmBrown + '90',
    textAlign: 'center',
    marginTop: 1,
  },
});
