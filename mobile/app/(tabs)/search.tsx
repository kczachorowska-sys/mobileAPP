import { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Fonts, Spacing } from '../../constants/theme';
import { getCategories, getProviders } from '../../services/api';
import type { Category, Provider, Subcategory } from '../../services/api';
import ProviderCard from '../../components/ProviderCard';

const SORT_OPTIONS = ['Recommended', 'Rating', 'Distance', 'Newest'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const SORT_API_MAP: Record<SortOption, string> = {
  Recommended: 'recommended',
  Rating: 'rating',
  Distance: 'distance',
  Newest: 'newest',
};

interface FilterPill {
  label: string;
  slug: string;
}

export default function SearchScreen() {
  const params = useLocalSearchParams<{ query?: string; category?: string; location?: string }>();

  const [searchText, setSearchText] = useState(params.query ?? '');
  const [activeCategory, setActiveCategory] = useState(params.category ?? '');
  const [sortOption, setSortOption] = useState<SortOption>('Recommended');
  const [categories, setCategories] = useState<Category[]>([]);
  const [pills, setPills] = useState<FilterPill[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const isInitialMount = useRef(true);

  // Load categories once
  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((cats) => {
        if (cancelled) return;
        setCategories(cats);
        const allPills: FilterPill[] = [];
        cats.forEach((cat) => {
          allPills.push({ label: cat.name, slug: cat.slug });
          cat.subcategories.forEach((sub) => {
            allPills.push({ label: sub.name, slug: sub.slug });
          });
        });
        setPills(allPills);
      })
      .catch((err) => console.error('Categories load error:', err));
    return () => { cancelled = true; };
  }, []);

  // Fetch providers
  const fetchProviders = useCallback(
    async (pageNum: number, append: boolean) => {
      try {
        const res = await getProviders({
          search: searchText.trim() || undefined,
          category: activeCategory || undefined,
          sort: SORT_API_MAP[sortOption],
          page: pageNum,
          limit: 10,
        });
        if (append) {
          setProviders((prev) => [...prev, ...res.providers]);
        } else {
          setProviders(res.providers);
        }
        setTotal(res.pagination.total);
        setHasMore(res.pagination.hasMore);
        setPage(pageNum);
      } catch (err) {
        console.error('Providers fetch error:', err);
      }
    },
    [searchText, activeCategory, sortOption],
  );

  // Initial load and refetch on filter changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
    setLoading(true);
    fetchProviders(1, false).finally(() => setLoading(false));
  }, [fetchProviders]);

  // Sync URL params into state on navigation
  useEffect(() => {
    if (params.query !== undefined && params.query !== searchText) {
      setSearchText(params.query);
    }
    if (params.category !== undefined && params.category !== activeCategory) {
      setActiveCategory(params.category);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.query, params.category]);

  const handleSearchSubmit = useCallback(() => {
    setLoading(true);
    fetchProviders(1, false).finally(() => setLoading(false));
  }, [fetchProviders]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchProviders(page + 1, true);
    setLoadingMore(false);
  }, [loadingMore, hasMore, page, fetchProviders]);

  const handleCategoryPress = useCallback((slug: string) => {
    setActiveCategory((prev) => (prev === slug ? '' : slug));
  }, []);

  const cycleSortOption = useCallback(() => {
    setSortOption((prev) => {
      const idx = SORT_OPTIONS.indexOf(prev);
      return SORT_OPTIONS[(idx + 1) % SORT_OPTIONS.length];
    });
  }, []);

  const renderProvider = useCallback(
    ({ item }: { item: Provider }) => <ProviderCard provider={item} />,
    [],
  );

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={48} color={Colors.sandDark} />
        <Text style={styles.emptyTitle}>No providers found</Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search or filters.
        </Text>
      </View>
    );
  }, [loading]);

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Colors.olive} />
        </View>
      );
    }
    return (
      <Pressable style={styles.loadMoreButton} onPress={handleLoadMore}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </Pressable>
    );
  }, [hasMore, loadingMore, handleLoadMore]);

  const renderHeader = useCallback(
    () => (
      <View>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.sandDark} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services, providers..."
            placeholderTextColor={Colors.sandDark}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={handleSearchSubmit}
          />
          {searchText.length > 0 && (
            <Pressable
              onPress={() => {
                setSearchText('');
              }}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={18} color={Colors.sandDark} />
            </Pressable>
          )}
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsContainer}
          style={styles.pillsScroll}
        >
          <Pressable
            style={[styles.pill, activeCategory === '' && styles.pillActive]}
            onPress={() => setActiveCategory('')}
          >
            <Text style={[styles.pillText, activeCategory === '' && styles.pillTextActive]}>
              All
            </Text>
          </Pressable>
          {pills.map((pill) => (
            <Pressable
              key={pill.slug}
              style={[styles.pill, activeCategory === pill.slug && styles.pillActive]}
              onPress={() => handleCategoryPress(pill.slug)}
            >
              <Text
                style={[styles.pillText, activeCategory === pill.slug && styles.pillTextActive]}
              >
                {pill.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Results count and sort */}
        <View style={styles.resultsBar}>
          <Text style={styles.resultsCount}>
            {total} {total === 1 ? 'result' : 'results'}
          </Text>
          <Pressable style={styles.sortButton} onPress={cycleSortOption}>
            <Ionicons name="swap-vertical" size={16} color={Colors.olive} />
            <Text style={styles.sortText}>{sortOption}</Text>
          </Pressable>
        </View>
      </View>
    ),
    [
      searchText,
      activeCategory,
      pills,
      total,
      sortOption,
      handleSearchSubmit,
      handleCategoryPress,
      cycleSortOption,
    ],
  );

  if (loading && providers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.olive} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Results</Text>
      </View>

      <FlatList
        data={providers}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ivory,
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
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.ivory,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    color: Colors.charcoal,
  },

  /* Search Bar */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: Colors.charcoal,
    marginLeft: Spacing.sm,
    paddingVertical: 2,
  },

  /* Pills */
  pillsScroll: {
    marginBottom: Spacing.md,
  },
  pillsContainer: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  pillActive: {
    backgroundColor: Colors.olive,
    borderColor: Colors.olive,
  },
  pillText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.charcoal,
  },
  pillTextActive: {
    color: Colors.white,
  },

  /* Results Bar */
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultsCount: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.warmBrown,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.olive + '12',
  },
  sortText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.olive,
  },

  /* List */
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },

  /* Empty */
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Colors.charcoal,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.warmBrown,
    marginTop: Spacing.xs,
  },

  /* Footer */
  footerLoader: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  loadMoreButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  loadMoreText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.olive,
  },
});
