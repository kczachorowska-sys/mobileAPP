import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../constants/theme';
import Stars from './Stars';
import type { Provider } from '../services/api';

function splitTags(value: string | null | undefined): string[] {
  if (!value) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 2);
}

export default function ProviderCard({ provider }: { provider: Provider }) {
  const router = useRouter();
  const isVerified = provider.verificationStatus === 'verified';
  const tags = splitTags(provider.specialisations);

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/provider/${provider.slug}`)}
    >
      <View style={styles.row}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="leaf-outline" size={24} color={Colors.sandDark + '60'} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={2}>{provider.businessName}</Text>
            <Pressable hitSlop={8}>
              <Ionicons name="heart-outline" size={20} color={Colors.sandDark + '70'} />
            </Pressable>
          </View>

          {isVerified && (
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={13} color={Colors.olive} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}

          <Text style={styles.meta}>
            {provider.category?.name} · {provider.town}
            {provider.distance != null ? ` · ${provider.distance.toFixed(1)} miles` : ''}
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
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  row: {
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
  content: {
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
});
