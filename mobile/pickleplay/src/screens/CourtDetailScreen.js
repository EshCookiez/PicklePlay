import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

// Define the new color constants for easy reuse
const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const CourtDetailScreen = ({ navigation, route }) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const screens = ['Home', 'Find', 'Map', 'Shop'];

  const navigateWithDirection = (targetIndex) => {
    if (targetIndex === currentScreenIndex) return;

    // Determine transition direction
    const isMovingForward = targetIndex > currentScreenIndex;

    // Set the target screen index first
    setCurrentScreenIndex(targetIndex);

    // Navigate with appropriate direction parameter and screen index
    const direction = isMovingForward ? 'right' : 'left';
    navigation.navigate(screens[targetIndex], { direction, screenIndex: targetIndex });
  };

  const handleBackPress = () => {
    navigation.navigate('FindCourts', { direction: 'left', screenIndex: 1 });
  };

  // Static data for specific courts to simulate rich backend data
  const staticCourtData = {
    'Metrosports Centre': {
      description: 'A premier indoor sports facility featuring multiple professional-grade pickleball courts. Known for its well-maintained surface and competitive atmosphere.',
      amenities: ['Indoor Courts', 'Pro Shop', 'Locker Rooms', 'Cafe', 'Parking'],
      hours: '6:00 AM - 11:00 PM',
      phone: '+63 32 231 9988',
      images: [
        'https://images.unsplash.com/photo-1599586120429-4828d5423ee4?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1626248532464-9428564b1275?auto=format&fit=crop&w=1200&q=60',
      ]
    },
    'Alta Vista Golf & Country Club': {
      description: 'Experience pickleball with a view. Located within the prestigious Alta Vista club, these courts offer a luxurious playing environment with stunning city overlooks.',
      amenities: ['Scenic Views', 'Clubhouse Access', 'Dining', 'Shower Facilities', 'Private Parking'],
      hours: '7:00 AM - 9:00 PM',
      phone: '+63 32 272 7971',
      images: [
        'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1622163642998-1ea36746b555?auto=format&fit=crop&w=1200&q=60',
      ]
    },
    'Citigreen Tennis Resort': {
      description: 'A dedicated racket sports haven. While famous for tennis, Citigreen offers top-tier pickleball courts surrounded by lush greenery for a refreshing game.',
      amenities: ['Red Clay Courts', 'Garden Setting', 'Refreshment Bar', 'Equipment Rental', 'Coaching'],
      hours: '6:00 AM - 10:00 PM',
      phone: '+63 32 261 1111',
      images: [
        'https://images.unsplash.com/photo-1622163642998-1ea36746b555?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1551855217-0209c13dc88c?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=60',
      ]
    },
    'Banawa Community Court': {
      description: 'A friendly community hub for local pickleball enthusiasts. Features well-maintained outdoor courts perfect for casual games and meetups.',
      amenities: ['Outdoor Courts', 'Community Area', 'Restrooms', 'Lighting'],
      hours: '6:00 AM - 10:00 PM',
      phone: '+63 32 255 1234',
      images: [
        'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=60',
      ]
    },
    'Downtown Sports Complex': {
      description: 'The city\'s central spot for sports action. Offers high-quality indoor pickleball courts with excellent lighting and ventilation.',
      amenities: ['Indoor Courts', 'Bleachers', 'Changing Rooms', 'Vending Machines'],
      hours: '8:00 AM - 10:00 PM',
      phone: '+63 32 233 4455',
      images: [
        'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1599586120429-4828d5423ee4?auto=format&fit=crop&w=1200&q=60',
      ]
    },
    'Riverside Recreation Center': {
      description: 'Located by the river, this center provides a refreshing breeze for outdoor play. A popular spot for morning and late afternoon games.',
      amenities: ['Riverside View', 'Outdoor Courts', 'Picnic Area', 'Parking'],
      hours: '5:00 AM - 9:00 PM',
      phone: '+63 32 254 7788',
      images: [
        'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1622163642998-1ea36746b555?auto=format&fit=crop&w=1200&q=60',
      ]
    },
  };

  // Get court data from route params, or use a default fallback
  const params = route?.params || {};
  const passedCourt = params.court;

  // Default fallback data if no court is passed
  const defaultCourt = {
    name: 'Court Details',
    location: 'Location not available',
    rating: 0,
    imageUrl: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1200&q=60',
    description: 'A beautiful community court with excellent facilities.',
    amenities: ['Parking', 'Restrooms', 'Lighting', 'Water Fountain'],
    hours: '6:00 AM - 10:00 PM',
    phone: '',
  };

  // Merge passed data with static data if available
  let court = passedCourt || defaultCourt;

  if (court.name && staticCourtData[court.name]) {
    court = { ...court, ...staticCourtData[court.name] };
  }

  // Ensure necessary fields exist if not in static data or params
  // Ensure necessary fields exist if not in static data or params
  if (!court.amenities) {
    court.amenities = defaultCourt.amenities;
  }
  if (!court.description) {
    court.description = defaultCourt.description;
  }
  if (!court.images) {
    court.images = court.imageUrl ? [court.imageUrl] : [defaultCourt.imageUrl];
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Updated StatusBar color */}
      <StatusBar barStyle="light-content" backgroundColor={thematicBlue} />



      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Court Image */}
        <Image
          source={{ uri: court.imageUrl }}
          style={styles.courtHeroImage}
          resizeMode="cover"
        />

        {/* Court Details */}
        <View style={styles.courtDetails}>
          <Text style={styles.courtName}>{court.name}</Text>
          <View style={styles.courtLocation}>
            <MaterialIcons
              name="location-on"
              size={20}
              color={thematicBlue}
            />
            <Text style={styles.courtLocationText}>{court.location}</Text>
          </View>
          <View style={styles.courtRating}>
            <MaterialIcons name="star" size={20} color={thematicBlue} />
            <Text style={styles.ratingText}>{court.rating}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Court</Text>
            <Text style={styles.sectionText}>
              This is a great pickleball court located in {court.location}.
              Perfect for players of all skill levels with excellent facilities
              and a welcoming community.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesList}>
              <View style={styles.amenityItem}>
                <MaterialIcons name="check-circle" size={16} color={thematicBlue} />
                <Text style={styles.amenityText}>Professional Court Surface</Text>
              </View>
              <View style={styles.amenityItem}>
                <MaterialIcons name="check-circle" size={16} color={thematicBlue} />
                <Text style={styles.amenityText}>Lighting for Night Play</Text>
              </View>
              <View style={styles.amenityItem}>
                <MaterialIcons name="check-circle" size={16} color={thematicBlue} />
                <Text style={styles.amenityText}>Parking Available</Text>
              </View>
              <View style={styles.amenityItem}>
                <MaterialIcons name="check-circle" size={16} color={thematicBlue} />
                <Text style={styles.amenityText}>Restroom Facilities</Text>
              </View>
            </View>
          </View>

          {/* Gallery Section */}
          {court.images && court.images.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gallery</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
                {court.images.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('Booking', { court })}
          >
            <Text style={styles.bookButtonText}>Book This Court</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.floatingBackButton}
        onPress={handleBackPress}>
        <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
      </TouchableOpacity>

      {/* Bottom Navigation with Swipe Gestures */}

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: 2,
  },
  content: {
    flex: 1,
  },
  floatingBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    elevation: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courtHeroImage: {
    width: '100%',
    height: 200,
  },
  courtDetails: {
    padding: 20,
  },
  courtName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: thematicBlue,
    marginBottom: 10,
  },
  courtLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  courtLocationText: {
    fontSize: 16,
    color: thematicBlue,
    marginLeft: 5,
  },
  courtRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    color: thematicBlue,
    marginLeft: 5,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: thematicBlue,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: thematicBlue,
    lineHeight: 20,
  },
  amenitiesList: {
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityText: {
    fontSize: 14,
    color: thematicBlue,
    marginLeft: 8,
  },
  bookButton: {
    backgroundColor: thematicBlue,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 10,
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeNavItem: {
    backgroundColor: thematicBlue,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavIcon: {
    backgroundColor: thematicBlue,
  },
  navText: {
    fontSize: 11,
    color: thematicBlue,
    marginTop: 4,
  },
  activeNavText: {
    color: activeColor,
    fontWeight: 'bold',
  },
  galleryScroll: {
    marginTop: 10,
  },
  galleryImage: {
    width: 200,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: Colors.surfaceAlt,
  },
});

export default CourtDetailScreen;
