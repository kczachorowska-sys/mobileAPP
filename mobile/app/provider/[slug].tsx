import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Fonts, Spacing } from '../../constants/theme';
import Stars from '../../components/Stars';
import { getProvider } from '../../services/api';
import type { Provider, Review } from '../../services/api';

function splitCsv(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatPrice(from: number | null, to: number | null): string {
  if (from != null && to != null) return `£${from} – £${to}`;
  if (from != null) return `From £${from}`;
  if (to != null) return `Up to £${to}`;
  return 'On consultation';
}

function relativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function getInitial(name: string | null): string {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

export default function ProviderDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProvider(slug)
      .then((data) => {
        setProvider(data);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.olive} />
      </View>
    );
  }

  if (error || !provider) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.sandDark} />
        <Text style={styles.errorText}>Provider not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const isVerified = provider.verificationStatus === 'verified';
  const specialisations = splitCsv(provider.specialisations);
  const qualifications = splitCsv(provider.qualifications);
  const areas = splitCsv(provider.areasCovered);
  const reviewsToShow = showAllReviews ? provider.reviews : provider.reviews.slice(0, 2);

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: provider.reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const maxCount = Math.max(...ratingDistribution.map((d) => d.count), 1);

  const contactActions: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    onPress: () => void;
  }[] = [];

  if (provider.phone) {
    contactActions.push({
      icon: 'call',
      label: 'Call',
      onPress: () => Linking.openURL(`tel:${provider.phone}`),
    });
  }
  if (provider.email) {
    contactActions.push({
      icon: 'mail',
      label: 'Email',
      onPress: () => Linking.openURL(`mailto:${provider.email}`),
    });
  }
  if (provider.website) {
    contactActions.push({
      icon: 'globe',
      label: 'Website',
      onPress: () => Linking.openURL(provider.website!),
    });
  }
  if (provider.whatsapp) {
    contactActions.push({
      icon: 'logo-whatsapp',
      label: 'WhatsApp',
      onPress: () => Linking.openURL(`https://wa.me/${provider.whatsapp}`),
    });
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero area */}
        <View style={styles.hero}>
          {provider.profileImage ? (
            <Image source={{ uri: provider.profileImage }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Ionicons name="leaf-outline" size={48} color={Colors.sandDark + '40'} />
            </View>
          )}
        </View>

        {/* Header overlay buttons */}
        <View style={styles.headerOverlay}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.charcoal} />
          </Pressable>
          <View style={styles.headerRight}>
            <Pressable style={styles.headerBtn}>
              <Ionicons name="share-outline" size={22} color={Colors.charcoal} />
            </Pressable>
            <Pressable style={styles.headerBtn} onPress={() => setSaved(!saved)}>
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={22}
                color={saved ? Colors.burgundy : Colors.charcoal}
              />
            </Pressable>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.businessName}>{provider.businessName}</Text>
          {isVerified && (
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.olive} />
              <Text style={styles.verifiedText}>Verified Provider</Text>
            </View>
          )}

          {provider.avgRating != null && provider.avgRating > 0 && (
            <View style={styles.ratingRow}>
              <Stars rating={provider.avgRating} size={16} />
              <Text style={styles.ratingText}>
                {provider.avgRating.toFixed(1)} ({provider.reviewCount}{' '}
                {provider.reviewCount === 1 ? 'review' : 'reviews'})
              </Text>
            </View>
          )}

          <Text style={styles.metaText}>
            {provider.category?.name}
            {provider.town ? ` · ${provider.town}` : ''}
          </Text>
        </View>

        {/* Contact buttons */}
        {contactActions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.contactRow}>
              {contactActions.map((action) => (
                <Pressable
                  key={action.label}
                  style={styles.contactBtn}
                  onPress={action.onPress}
                >
                  <View style={styles.contactIcon}>
                    <Ionicons name={action.icon} size={20} color={Colors.olive} />
                  </View>
                  <Text style={styles.contactLabel}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Availability */}
        <View style={styles.section}>
          <View style={styles.availabilityRow}>
            <View
              style={[
                styles.availabilityDot,
                {
                  backgroundColor: provider.acceptingNewClients
                    ? Colors.green
                    : Colors.sandDark,
                },
              ]}
            />
            <Text style={styles.availabilityText}>
              {provider.acceptingNewClients
                ? 'Taking new clients'
                : 'Not currently accepting'}
            </Text>
          </View>
        </View>

        {/* About */}
        {provider.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bodyText}>{provider.description}</Text>
          </View>
        )}

        {/* Services */}
        {provider.services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.tagsWrap}>
              {provider.services.map((s) => (
                <View key={s.id} style={styles.oliveTag}>
                  <Text style={styles.oliveTagText}>{s.serviceName}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Specialisations */}
        {specialisations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialisations</Text>
            <View style={styles.tagsWrap}>
              {specialisations.map((s) => (
                <View key={s} style={styles.burgundyTag}>
                  <Text style={styles.burgundyTagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Areas Covered */}
        {areas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Areas Covered</Text>
            <View style={styles.tagsWrap}>
              {areas.map((a) => (
                <View key={a} style={styles.areaTag}>
                  <Ionicons name="location" size={12} color={Colors.warmBrown} />
                  <Text style={styles.areaTagText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Price Guide */}
        {provider.services.length > 0 &&
          provider.services.some((s) => s.priceFrom != null || s.priceTo != null) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Guide</Text>
              <View style={styles.priceTable}>
                {provider.services.map((s) => (
                  <View key={s.id} style={styles.priceRow}>
                    <Text style={styles.priceService} numberOfLines={1}>
                      {s.serviceName}
                    </Text>
                    <Text style={styles.priceValue}>
                      {formatPrice(s.priceFrom, s.priceTo)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* Qualifications */}
        {qualifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Qualifications</Text>
            {qualifications.map((q) => (
              <View key={q} style={styles.qualRow}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.olive} />
                <Text style={styles.qualText}>{q}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Reviews */}
        {provider.reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>

            {/* Summary */}
            <View style={styles.reviewSummary}>
              <View style={styles.reviewAvgBlock}>
                <Text style={styles.reviewAvgNumber}>
                  {(provider.avgRating ?? 0).toFixed(1)}
                </Text>
                <Stars rating={provider.avgRating ?? 0} size={18} />
                <Text style={styles.reviewCountSmall}>
                  {provider.reviewCount}{' '}
                  {provider.reviewCount === 1 ? 'review' : 'reviews'}
                </Text>
              </View>

              <View style={styles.reviewBars}>
                {ratingDistribution.map((d) => (
                  <View key={d.star} style={styles.barRow}>
                    <Text style={styles.barLabel}>{d.star}</Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${(d.count / maxCount) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.barCount}>{d.count}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Review cards */}
            {reviewsToShow.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>
                      {getInitial(review.user.name)}
                    </Text>
                  </View>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewAuthor}>
                      {review.user.name ?? 'Anonymous'}
                    </Text>
                    <Text style={styles.reviewDate}>
                      {relativeDate(review.createdAt)}
                    </Text>
                  </View>
                </View>
                <Stars rating={review.rating} size={14} />
                {review.reviewText && (
                  <Text style={styles.reviewBody}>{review.reviewText}</Text>
                )}
              </View>
            ))}

            {!showAllReviews && provider.reviews.length > 2 && (
              <Pressable
                style={styles.showAllBtn}
                onPress={() => setShowAllReviews(true)}
              >
                <Text style={styles.showAllBtnText}>
                  Show all {provider.reviews.length} reviews
                </Text>
              </Pressable>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  scroll: {
    flex: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Colors.charcoal,
    marginTop: Spacing.md,
  },
  backButton: {
    marginTop: Spacing.md,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.olive,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Hero
  hero: {
    height: 220,
  },
  heroImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  heroPlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Header overlay
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white + 'E6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Info card
  infoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    zIndex: 5,
  },
  businessName: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    color: Colors.charcoal,
    lineHeight: 28,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  verifiedText: {
    fontSize: 13,
    color: Colors.olive,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  ratingText: {
    fontSize: 13,
    color: Colors.warmBrown,
  },
  metaText: {
    fontSize: 13,
    color: Colors.warmBrown + '90',
    marginTop: 6,
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Colors.charcoal,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.charcoal + 'CC',
  },

  // Contact buttons
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.sand + '60',
  },
  contactBtn: {
    alignItems: 'center',
    gap: 6,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.olive + '14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: {
    fontSize: 12,
    color: Colors.charcoal,
    fontWeight: '500',
  },

  // Availability
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  availabilityText: {
    fontSize: 14,
    color: Colors.charcoal,
    fontWeight: '500',
  },

  // Tags
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  oliveTag: {
    backgroundColor: Colors.olive + '14',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  oliveTagText: {
    fontSize: 13,
    color: Colors.olive,
    fontWeight: '500',
  },
  burgundyTag: {
    backgroundColor: Colors.burgundy + '12',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  burgundyTagText: {
    fontSize: 13,
    color: Colors.burgundy,
    fontWeight: '500',
  },
  areaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.sand + '80',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  areaTagText: {
    fontSize: 13,
    color: Colors.warmBrown,
    fontWeight: '500',
  },

  // Price Guide
  priceTable: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.sand + '60',
    overflow: 'hidden',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sand + '40',
  },
  priceService: {
    fontSize: 14,
    color: Colors.charcoal,
    flex: 1,
    marginRight: 12,
  },
  priceValue: {
    fontSize: 14,
    color: Colors.olive,
    fontWeight: '600',
  },

  // Qualifications
  qualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  qualText: {
    fontSize: 14,
    color: Colors.charcoal,
    flex: 1,
  },

  // Reviews
  reviewSummary: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  reviewAvgBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  reviewAvgNumber: {
    fontFamily: Fonts.serif,
    fontSize: 36,
    color: Colors.charcoal,
    lineHeight: 42,
  },
  reviewCountSmall: {
    fontSize: 12,
    color: Colors.warmBrown + '80',
    marginTop: 4,
  },
  reviewBars: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.warmBrown + '80',
    width: 12,
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.sand,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    backgroundColor: Colors.amber,
    borderRadius: 4,
  },
  barCount: {
    fontSize: 12,
    color: Colors.warmBrown + '80',
    width: 20,
  },

  // Review cards
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.sand + '60',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.olive + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.olive,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.warmBrown + '80',
    marginTop: 1,
  },
  reviewBody: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.charcoal + 'CC',
    marginTop: 8,
  },
  showAllBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: Colors.olive + '10',
    borderRadius: 12,
  },
  showAllBtnText: {
    fontSize: 14,
    color: Colors.olive,
    fontWeight: '600',
  },
});
