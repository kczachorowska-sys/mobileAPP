import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuItem {
  icon: IoniconsName;
  label: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const SECTIONS: MenuSection[] = [
  {
    title: 'Account',
    items: [
      { icon: 'person', label: 'Edit Profile' },
      { icon: 'leaf', label: 'My Horses' },
      { icon: 'star', label: 'My Reviews' },
      { icon: 'notifications', label: 'Notification Settings' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'location', label: 'Location Settings' },
      { icon: 'radio-button-on', label: 'Default Search Radius' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle', label: 'Help & FAQ' },
      { icon: 'information-circle', label: 'About EquiFind' },
      { icon: 'shield-checkmark', label: 'Privacy Policy' },
      { icon: 'document-text', label: 'Terms of Service' },
    ],
  },
];

export default function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.userTop}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>CW</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Charlotte Winslow</Text>
              <Text style={styles.userEmail}>charlotte.winslow@email.com</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={13} color={Colors.warmBrown + '90'} />
                <Text style={styles.userLocation}>Oxfordshire, UK</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Horses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        {/* Provider CTA */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Are you an equestrian professional?</Text>
          <Text style={styles.ctaBody}>
            Reach horse owners in your area and grow your business with EquiFind.
          </Text>
          <Pressable style={styles.ctaBtn}>
            <Text style={styles.ctaBtnText}>List your business</Text>
          </Pressable>
        </View>

        {/* Settings sections */}
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, index) => (
                <Pressable
                  key={item.label}
                  style={[
                    styles.menuItem,
                    index === section.items.length - 1 && styles.menuItemLast,
                  ]}
                >
                  <View style={styles.menuIconCircle}>
                    <Ionicons name={item.icon} size={20} color={Colors.olive} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.sandDark}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Sign out */}
        <Pressable style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>

        {/* Version */}
        <Text style={styles.versionText}>EquiFind v1.0.0</Text>

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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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

  // User card
  userCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.sand + '60',
  },
  userTop: {
    flexDirection: 'row',
    gap: 14,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Colors.olive,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    color: Colors.charcoal,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.warmBrown + '90',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  userLocation: {
    fontSize: 13,
    color: Colors.warmBrown + '90',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.sand + '60',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Colors.charcoal,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.warmBrown + '90',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.sand + '80',
  },

  // CTA card
  ctaCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.olive + '14',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.olive + '20',
  },
  ctaTitle: {
    fontFamily: Fonts.serif,
    fontSize: 17,
    color: Colors.charcoal,
    marginBottom: 6,
  },
  ctaBody: {
    fontSize: 13,
    color: Colors.warmBrown + 'CC',
    lineHeight: 20,
    marginBottom: 14,
  },
  ctaBtn: {
    backgroundColor: Colors.olive,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Settings sections
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.warmBrown + '90',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.sand + '60',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sand + '40',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.olive + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.charcoal,
    fontWeight: '500',
  },

  // Sign out
  signOutBtn: {
    alignItems: 'center',
    marginTop: 28,
    paddingVertical: 14,
  },
  signOutText: {
    fontSize: 15,
    color: Colors.burgundy,
    fontWeight: '600',
  },

  // Version
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.sandDark + '80',
    marginTop: 4,
  },
});
