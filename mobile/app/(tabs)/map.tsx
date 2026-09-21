import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Spacing } from '../../constants/theme';
import { getCategories, getProviders } from '../../services/api';
import type { Category, Provider } from '../../services/api';

const UK_CENTER = { lat: 52.0, lng: -1.5 };
const DEFAULT_ZOOM = 7;

const CATEGORY_COLORS: Record<string, string> = {
  'horse-care': '#E74C3C',
  'training-riding': '#3498DB',
  'yards-facilities': '#2ECC71',
  'horse-services-shopping': '#F39C12',
};

function getCategoryColor(slug: string): string {
  return CATEGORY_COLORS[slug] ?? Colors.olive;
}

export default function MapScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [cats, provRes] = await Promise.all([
          getCategories(),
          getProviders({ limit: 100 }),
        ]);
        if (!cancelled) {
          setCategories(cats);
          setProviders(provRes.providers);
        }
      } catch (err) {
        console.error('Map load error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredProviders = useMemo(() => {
    if (!activeCategory) return providers;
    return providers.filter((p) => {
      const parentSlug = p.category?.parentCategory?.slug ?? p.category?.slug;
      return parentSlug === activeCategory || p.category?.slug === activeCategory;
    });
  }, [providers, activeCategory]);

  const handleCategoryPress = useCallback((slug: string) => {
    setActiveCategory((prev) => (prev === slug ? '' : slug));
    setSelectedProvider(null);
  }, []);

  const handleProviderPress = useCallback((slug: string) => {
    router.push(`/provider/${slug}`);
  }, [router]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'markerClick') {
            const provider = providers.find((p) => p.id === data.providerId);
            if (provider) setSelectedProvider(provider);
          } else if (data.type === 'providerNavigate') {
            handleProviderPress(data.slug);
          }
        } catch {}
      };
      window.addEventListener('message', handler);
      return () => window.removeEventListener('message', handler);
    }
  }, [providers, handleProviderPress]);

  const mapHtml = useMemo(() => {
    const markers = filteredProviders
      .filter((p) => p.latitude && p.longitude)
      .map((p) => {
        const parentSlug = p.category?.parentCategory?.slug ?? p.category?.slug ?? '';
        const color = getCategoryColor(parentSlug);
        const rating = p.avgRating ? `${p.avgRating.toFixed(1)} ★` : '';
        const catName = p.category?.parentCategory?.name ?? p.category?.name ?? '';
        return {
          id: p.id,
          slug: p.slug,
          lat: p.latitude,
          lng: p.longitude,
          name: p.businessName,
          category: catName,
          town: p.town ?? '',
          rating,
          color,
          verified: p.verificationStatus === 'verified',
        };
      });

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,system-ui,sans-serif}
#map{width:100%;height:100vh}
.popup-card{min-width:200px;font-family:-apple-system,system-ui,sans-serif}
.popup-name{font-size:14px;font-weight:700;color:#2C2C2C;margin-bottom:4px;cursor:pointer}
.popup-name:hover{color:#6B7B5E}
.popup-cat{font-size:11px;color:#5D4037;margin-bottom:2px}
.popup-town{font-size:12px;color:#888;margin-bottom:4px}
.popup-rating{font-size:12px;color:#F59E0B;font-weight:600}
.popup-badge{display:inline-block;font-size:10px;background:#6B7B5E;color:#fff;padding:2px 6px;border-radius:4px;margin-left:6px}
</style>
</head>
<body>
<div id="map"></div>
<script>
var map=L.map('map').setView([${UK_CENTER.lat},${UK_CENTER.lng}],${DEFAULT_ZOOM});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'© OpenStreetMap',
  maxZoom:18
}).addTo(map);

var markers=${JSON.stringify(markers)};
var bounds=[];
markers.forEach(function(m){
  var icon=L.divIcon({
    className:'',
    html:'<div style="width:28px;height:28px;border-radius:50%;background:'+m.color+';border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
    iconSize:[28,28],
    iconAnchor:[14,14],
    popupAnchor:[0,-16]
  });
  var popup='<div class="popup-card">'
    +'<div class="popup-name" onclick="window.parent.postMessage(JSON.stringify({type:\\'providerNavigate\\',slug:\\''+m.slug+'\\'}),\\'*\\')">'+m.name+'</div>'
    +'<div class="popup-cat">'+m.category+'</div>'
    +'<div class="popup-town">'+m.town+'</div>'
    +(m.rating?'<span class="popup-rating">'+m.rating+'</span>':'')
    +(m.verified?'<span class="popup-badge">Verified</span>':'')
    +'</div>';
  var marker=L.marker([m.lat,m.lng],{icon:icon}).addTo(map).bindPopup(popup);
  marker.on('click',function(){
    window.parent.postMessage(JSON.stringify({type:'markerClick',providerId:m.id}),'*');
  });
  bounds.push([m.lat,m.lng]);
});
if(bounds.length>0){
  map.fitBounds(bounds,{padding:[40,40],maxZoom:10});
}
<\/script>
</body>
</html>`;
  }, [filteredProviders]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.olive} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Map</Text>
        <Text style={styles.headerSubtitle}>
          {filteredProviders.filter((p) => p.latitude).length} providers
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsContainer}
        style={styles.pillsScroll}
      >
        <Pressable
          style={[styles.pill, activeCategory === '' && styles.pillActive]}
          onPress={() => { setActiveCategory(''); setSelectedProvider(null); }}
        >
          <Text style={[styles.pillText, activeCategory === '' && styles.pillTextActive]}>
            All
          </Text>
        </Pressable>
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={[styles.pill, activeCategory === cat.slug && styles.pillActive]}
            onPress={() => handleCategoryPress(cat.slug)}
          >
            <View style={[styles.pillDot, { backgroundColor: getCategoryColor(cat.slug) }]} />
            <Text style={[styles.pillText, activeCategory === cat.slug && styles.pillTextActive]}>
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            ref={iframeRef as any}
            srcDoc={mapHtml}
            style={{ width: '100%', height: '100%', border: 'none' } as any}
          />
        ) : (
          <View style={styles.nativeMapPlaceholder}>
            <Ionicons name="map" size={48} color={Colors.sandDark} />
            <Text style={styles.placeholderText}>
              Map view is available in the web browser.
            </Text>
            <Text style={styles.placeholderSubtext}>
              Native map coming in a future update.
            </Text>
          </View>
        )}
      </View>

      {selectedProvider && (
        <Pressable
          style={styles.selectedCard}
          onPress={() => handleProviderPress(selectedProvider.slug)}
        >
          <View style={styles.selectedCardContent}>
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedName} numberOfLines={1}>
                {selectedProvider.businessName}
              </Text>
              <Text style={styles.selectedCategory} numberOfLines={1}>
                {selectedProvider.category?.parentCategory?.name ?? selectedProvider.category?.name}
                {selectedProvider.town ? ` · ${selectedProvider.town}` : ''}
              </Text>
              {selectedProvider.avgRating && (
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={Colors.amber} />
                  <Text style={styles.ratingText}>
                    {selectedProvider.avgRating.toFixed(1)}
                  </Text>
                  <Text style={styles.reviewCount}>
                    ({selectedProvider.reviewCount} {selectedProvider.reviewCount === 1 ? 'review' : 'reviews'})
                  </Text>
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.sandDark} />
          </View>
        </Pressable>
      )}
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
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    color: Colors.charcoal,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.warmBrown + '90',
  },
  pillsScroll: {
    flexGrow: 0,
    paddingHorizontal: Spacing.lg,
    marginBottom: 8,
  },
  pillsContainer: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.sand,
    gap: 6,
  },
  pillActive: {
    backgroundColor: Colors.olive,
    borderColor: Colors.olive,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.sand + '60',
  },
  nativeMapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cream,
    gap: 12,
  },
  placeholderText: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    color: Colors.charcoal,
  },
  placeholderSubtext: {
    fontSize: 13,
    color: Colors.warmBrown + '90',
  },
  selectedCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.sand + '60',
  },
  selectedCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    color: Colors.charcoal,
    fontWeight: '600',
  },
  selectedCategory: {
    fontSize: 13,
    color: Colors.warmBrown + '90',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.warmBrown + '90',
  },
});
