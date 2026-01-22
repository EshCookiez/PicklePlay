import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  BackHandler,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {MaterialIcons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

// Define the new color constants for easy reuse
const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const MapScreen = ({ navigation }) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(2);
  const screens = ['Home', 'FindCourts', 'Map', 'Shop'];

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
    if (navigation && navigation.navigate) {
      navigation.navigate('Home', { direction: 'left', screenIndex: 0 });
    }
  };

  const mapLocations = [
    {
      name: 'Banawa Community Court',
      location: 'Cebu City',
      distance: '2.5 km',
      coordinates: '10.3173° N, 123.8854° E',
    },
    {
      name: 'Downtown Sports Complex',
      location: 'Cebu City',
      distance: '3.8 km',
      coordinates: '10.3156° N, 123.8854° E',
    },
    {
      name: 'Riverside Recreation Center',
      location: 'Cebu City',
      distance: '5.2 km',
      coordinates: '10.3190° N, 123.8900° E',
    },
  ];

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
        {/* Map View Section */}
        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>Court Locations</Text>
          <View style={styles.mapContainer}>
            <Image
              source={{uri: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80'}}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <View style={styles.mapOverlay}>
              <MaterialIcons name="location-on" size={40} color={thematicBlue} />
              <Text style={styles.mapText}>Interactive Map View</Text>
              <Text style={styles.mapSubtext}>Tap to view full map</Text>
            </View>
          </View>
        </View>

        {/* Location List */}
        <View style={styles.locationsSection}>
          <Text style={styles.sectionTitle}>Nearby Courts</Text>
          {mapLocations.map((location, index) => (
            <View key={index} style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <MaterialIcons name="location-on" size={24} color={thematicBlue} />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationAddress}>{location.location}</Text>
                <Text style={styles.locationCoordinates}>{location.coordinates}</Text>
              </View>
              <View style={styles.locationDistance}>
                <Text style={styles.distanceText}>{location.distance}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Map Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Map Features</Text>
          <View style={styles.featureCard}>
            <MaterialIcons name="filter-list" size={24} color={thematicBlue} />
            <Text style={styles.featureText}>Filter by court type and availability</Text>
          </View>
          <View style={styles.featureCard}>
            <MaterialIcons name="directions" size={24} color={thematicBlue} />
            <Text style={styles.featureText}>Get directions to any court</Text>
          </View>
          <View style={styles.featureCard}>
            <MaterialIcons name="my-location" size={24} color={thematicBlue} />
            <Text style={styles.featureText}>Find courts near your current location</Text>
          </View>
        </View>
      </ScrollView>

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
  },
  mapSection: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: thematicBlue,
    marginBottom: 15,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 86, 167, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: thematicBlue,
    marginTop: 10,
  },
  mapSubtext: {
    fontSize: 14,
    color: thematicBlue,
    marginTop: 5,
  },
  locationsSection: {
    margin: 15,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  locationIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: thematicBlue,
    marginBottom: 3,
  },
  locationAddress: {
    fontSize: 13,
    color: thematicBlue,
    marginBottom: 2,
  },
  locationCoordinates: {
    fontSize: 11,
    color: thematicBlue,
    opacity: 0.7,
  },
  locationDistance: {
    alignItems: 'flex-end',
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: thematicBlue,
  },
  featuresSection: {
    margin: 15,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureText: {
    fontSize: 14,
    color: thematicBlue,
    marginLeft: 15,
    flex: 1,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
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
    borderRadius: 20,
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

export default MapScreen;
