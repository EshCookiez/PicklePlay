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
import {BlurView} from 'expo-blur';
import Colors from '../constants/Colors';
// Define the new color constants for easy reuse
const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const HomeScreen = ({navigation}) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const screens = ['Home', 'FindCourts', 'Map', 'Shop', 'Profile'];

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

  const features = [
    {
      icon: 'location-on',
      title: 'Quick Matching',
      description: 'Find available courts and players instantly',
    },
    {
      icon: 'people',
      title: 'Community',
      description: 'Connect with local pickleball enthusiasts',
    },
    {
      icon: 'emoji-events',
      title: 'Tournaments',
      description: 'Participate in organized competitions',
    },
    {
      icon: 'update',
      title: 'Real-time Updates',
      description: 'Get live court availability and scores',
    },
  ];

  const courts = [
    {
      name: 'Banawa Community Court',
      location: 'Cebu City',
      rating: 4.5,
      imageUrl:
        'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1200&q=60',
    },
    {
      name: 'Downtown Sports Complex',
      location: 'Cebu City',
      rating: 4.8,
      imageUrl:
        'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1200&q=60',
    },
    {
      name: 'Riverside Recreation Center',
      location: 'Cebu City',
      rating: 4.3,
      imageUrl:
        'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=60',
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
          <View style={styles.logoContainer}>
            <Image source={require('../assets/PicklePlayLogo.jpg')} style={styles.logoImage} />
            <Text style={styles.logo}>PICKLEPLAY</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Blurred Background */}
        <View style={styles.heroSection}>
          <Image
            source={{uri: 'https://images.unsplash.com/photo-1559826263-a639d6fb4f0?auto=format&fit=crop&w=1200&q=80'}}
            style={styles.heroImage}
            resizeMode="cover"
            blurRadius={10}
          />
          <BlurView intensity={80} style={styles.blurOverlay} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>FIND A LOCAL COURT NEAR YOU</Text>
            <Text style={styles.heroSubtitle}>
              Connect with pickleball courts in your area and start playing today
            </Text>
            <TouchableOpacity
              style={styles.findCourtsButton}
              onPress={() => navigation.navigate('FindCourts')}>
              <MaterialIcons name="search" size={20} color={Colors.white} />
              <Text style={styles.findCourtsText}>Find Courts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose PicklePlay?</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <MaterialIcons
                  name={feature.icon}
                  size={30}
                  color={thematicBlue}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Popular Courts Section */}
        <View style={styles.courtsSection}>
          <Text style={styles.sectionTitle}>Popular Courts</Text>
          {courts.map((court, index) => (
            <TouchableOpacity
              key={index}
              style={styles.courtCard}
              onPress={() => navigation.navigate('CourtDetail', {court})}>
              <Image
                source={{uri: court.imageUrl}}
                style={styles.courtImage}
                resizeMode="cover"
              />
              <View style={styles.courtInfo}>
                <Text style={styles.courtName}>{court.name}</Text>
                <View style={styles.courtLocation}>
                  <MaterialIcons
                    name="location-on"
                    size={16}
                    color={thematicBlue}
                  />
                  <Text style={styles.courtLocationText}>{court.location}</Text>
                </View>
              </View>
              <View style={styles.courtRating}>
                <MaterialIcons name="star" size={16} color={thematicBlue} />
                <Text style={styles.ratingText}>{court.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaText}>
            Find courts. Play pickleball. Build community.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  heroSection: {
    backgroundColor: Colors.surface,
    margin: 15,
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
    width: '100%',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: thematicBlue,
    textAlign: 'center',
    marginBottom: 0,
  },
  heroSubtitle: {
    fontSize: 14,
    color: thematicBlue,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  findCourtsButton: {
    flexDirection: 'row',
    backgroundColor: thematicBlue,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  findCourtsText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  featuresSection: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: thematicBlue,
    marginBottom: 15,
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
  featureIcon: {
    width: 50,
    height: 50,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: thematicBlue,
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 13,
    color: thematicBlue,
    lineHeight: 18,
  },
  courtsSection: {
    margin: 15,
  },
  courtCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  courtImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: Colors.surfaceAlt,
  },
  courtInfo: {
    flex: 1,
  },
  courtName: {
    fontSize: 16,
    fontWeight: '600',
    color: thematicBlue,
    marginBottom: 5,
  },
  courtLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courtLocationText: {
    fontSize: 13,
    color: thematicBlue,
    marginLeft: 3,
  },
  courtRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: thematicBlue,
    marginLeft: 3,
    fontWeight: '500',
  },
  ctaSection: {
    backgroundColor: thematicBlue,
    margin: 15,
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: thematicBlue,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;