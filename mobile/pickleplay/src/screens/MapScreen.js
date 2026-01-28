import React, { useState, useEffect } from 'react';
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
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

// Define the new color constants for easy reuse
const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const MapScreen = ({ navigation, onBackNavigation }) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(2);
  const screens = ['Home', 'FindCourts', 'Map', 'Shop', 'Profile'];

  const webViewRef = React.useRef(null);
  const scrollViewRef = React.useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(null);

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
    if (onBackNavigation) {
      onBackNavigation();
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Home', { direction: 'left', screenIndex: 0 });
    }
  };

  const mapLocations = [
    {
      name: 'Banawa Community Court',
      location: 'Cebu City',
      distance: '2.5 km',
      coordinates: '10.3173° N, 123.8854° E',
      lat: 10.3173,
      lon: 123.8854,
      imageUrl: 'https://images.unsplash.com/photo-1599586120429-4828d5423ee4?auto=format&fit=crop&w=1200&q=60', // Outdoor court vibe
    },
    {
      name: 'Downtown Sports Complex',
      location: 'Cebu City',
      distance: '3.8 km',
      coordinates: '10.3156° N, 123.8854° E',
      lat: 10.3156,
      lon: 123.8854,
      imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=60', // Complex/Indoor vibe
    },
    {
      name: 'Riverside Recreation Center',
      location: 'Cebu City',
      distance: '5.2 km',
      coordinates: '10.3190° N, 123.8900° E',
      lat: 10.3190,
      lon: 123.8900,
      imageUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=60',
    },
    {
      name: 'Metrosports Centre',
      location: 'Lahug, Cebu City',
      distance: '1.2 km',
      coordinates: '10.3284° N, 123.9015° E',
      lat: 10.3284,
      lon: 123.9015,
      imageUrl: 'https://images.unsplash.com/photo-1599586120429-4828d5423ee4?auto=format&fit=crop&w=1200&q=60', // Matches FindCourts
    },
    {
      name: 'Alta Vista Golf & Country Club',
      location: 'Pardo, Cebu City',
      distance: '6.5 km',
      coordinates: '10.2833° N, 123.8667° E',
      lat: 10.2833,
      lon: 123.8667,
      imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=60', // Matches FindCourts
    },
    {
      name: 'Citigreen Tennis Resort',
      location: 'Punta Princesa, Cebu City',
      distance: '4.0 km',
      coordinates: '10.3000° N, 123.8833° E',
      lat: 10.3000,
      lon: 123.8833,
      imageUrl: 'https://images.unsplash.com/photo-1622163642998-1ea36746b555?auto=format&fit=crop&w=1200&q=60', // Matches FindCourts
    }
  ];

  const handleLocationPress = (location, index) => {
    // Always scroll to top when a location is clicked
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });

    if (selectedLocationIndex === index) {
      // If clicking the already selected location, deselect and zoom out
      setSelectedLocationIndex(null);
      if (webViewRef.current) {
        // Reset to default view (zoom out)
        const script = `
          map.setView([10.3173, 123.8854], 13, {
            animate: true,
            duration: 1.5
          });
          true;
        `;
        webViewRef.current.injectJavaScript(script);
      }
    } else {
      // Select new location and zoom in
      setSelectedLocationIndex(index);
      if (webViewRef.current) {
        const script = `
          map.setView([${location.lat}, ${location.lon}], 18, {
            animate: true,
            duration: 1.5
          });
          true;
        `;
        webViewRef.current.injectJavaScript(script);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Updated StatusBar color */}
      <StatusBar barStyle="light-content" backgroundColor={thematicBlue} />



      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Map View Section */}
        <View style={styles.mapSection}>
          <Text style={[styles.sectionTitle, { margin: 15 }]}>Court Locations</Text>
          <View style={styles.mapContainer}>
            <WebView
              ref={webViewRef}
              originWhitelist={['*']}
              onLoadEnd={() => setMapLoaded(true)}
              source={{
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
                    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
                    <style>
                        body { margin: 0; padding: 0; }
                        #map { height: 100vh; width: 100vw; }
                    </style>
                </head>
                <body>
                    <div id="map"></div>
                    <script>
                        var map = L.map('map', {
                            zoomControl: false,
                            attributionControl: false
                        }).setView([10.3173, 123.8854], 14);
                        
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 19,
                        }).addTo(map);

                        var locations = [
                            { name: "Banawa Community Court", lat: 10.3173, lon: 123.8854 },
                            { name: "Downtown Sports Complex", lat: 10.3156, lon: 123.8854 },
                            { name: "Riverside Recreation Center", lat: 10.3190, lon: 123.8900 },
                            { name: "Metrosports Centre", lat: 10.3284, lon: 123.9015 },
                            { name: "Alta Vista Golf & Country Club", lat: 10.2833, lon: 123.8667 },
                            { name: "Citigreen Tennis Resort", lat: 10.3000, lon: 123.8833 }
                        ];

                        locations.forEach(function(loc) {
                            L.marker([loc.lat, loc.lon]).addTo(map)
                                .bindPopup(loc.name);
                        });
                    </script>
                </body>
                </html>
              `}}
              style={styles.webView}
            />
          </View>
        </View>

        {/* Location List */}
        <View style={styles.locationsSection}>
          <Text style={styles.sectionTitle}>Nearby Courts</Text>
          {mapLocations.map((location, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.locationCard,
                selectedLocationIndex === index && styles.selectedLocationCard
              ]}
              onPress={() => handleLocationPress(location, index)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: location.imageUrl }}
                style={styles.locationImage}
                resizeMode="cover"
              />
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationAddress}>{location.location}</Text>
                <Text style={styles.locationCoordinates}>{location.coordinates}</Text>
              </View>
              <View style={styles.locationDistance}>
                <Text style={styles.distanceText}>{location.distance}</Text>
              </View>
            </TouchableOpacity>
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
    // margin: 15, // Removed to make map full width
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: thematicBlue,
    marginBottom: 15,
  },
  mapContainer: {
    height: 500,
    // borderRadius: 12, // Removed for full width
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#e1e1e1',
    marginBottom: 20,
  },
  webView: {
    flex: 1,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedLocationCard: {
    borderColor: activeColor,
    backgroundColor: '#f0f9ff', // Light blue tint
  },
  locationImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: Colors.surfaceAlt,
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
    shadowOffset: { width: 0, height: 1 },
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
});

export default MapScreen;
