import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {MaterialIcons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

// Define the new color constants for easy reuse
const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const CourtDetailScreen = ({ navigation }) => {
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
    navigation.navigate('Home');
  };

  // Sample court data since we're not using route params
  const court = {
    name: 'Banawa Community Court',
    location: 'Cebu City',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1200&q=60',
    description: 'A beautiful community court with excellent facilities.',
    amenities: ['Parking', 'Restrooms', 'Lighting', 'Water Fountain'],
    hours: '6:00 AM - 10:00 PM',
    phone: '+63 123 456 7890',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Updated StatusBar color */}
      <StatusBar barStyle="light-content" backgroundColor={thematicBlue} />

      {/* Header */}
      <LinearGradient
        colors={[thematicBlue, thematicBlue]}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/PicklePlayLogo.jpg')} style={styles.logoImage} />
            <Text style={styles.logo}>PICKLEPLAY</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Court Image */}
        <Image
          source={{uri: court.imageUrl}}
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
          
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book This Court</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation with Swipe Gestures */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {
            setCurrentScreenIndex(0);
            navigation.navigate('Home');
          }}>
          <View style={[styles.navIconContainer, currentScreenIndex === 0 && styles.activeNavIcon]}>
            <MaterialIcons name="home" size={24} color={currentScreenIndex === 0 ? activeColor : thematicBlue} />
          </View>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {
            setCurrentScreenIndex(1);
            navigation.navigate('FindCourts');
          }}>
          <View style={[styles.navIconContainer, currentScreenIndex === 1 && styles.activeNavIcon]}>
            <MaterialIcons name="search" size={24} color={currentScreenIndex === 1 ? activeColor : thematicBlue} />
          </View>
          <Text style={styles.navText}>Find</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <View style={[styles.navIconContainer, currentScreenIndex === 2 && styles.activeNavIcon]}>
            <MaterialIcons name="map" size={24} color={currentScreenIndex === 2 ? activeColor : thematicBlue} />
          </View>
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIconContainer, currentScreenIndex === 3 && styles.activeNavIcon]}>
            <MaterialIcons
              name="shopping-cart"
              size={24}
              color={currentScreenIndex === 3 ? activeColor : thematicBlue}
            />
          </View>
          <Text style={styles.navText}>Shop</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    marginBottom: 70,
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
});

export default CourtDetailScreen;
