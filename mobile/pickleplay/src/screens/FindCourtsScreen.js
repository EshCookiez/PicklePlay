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
import Colors from '../constants/Colors';

// Define the new color constants for easy reuse
const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const FindCourtsScreen = ({ navigation, onBackNavigation }) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(1);
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

  const handleBackPress = () => {
    if (onBackNavigation) {
      onBackNavigation();
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Home', { direction: 'left', screenIndex: 0 });
    }
  };

  const courts = [
    {
      id: 1,
      name: 'Banawa Community Court',
      location: 'Banawa, Cebu City',
      rating: 4.5,
      distance: '1.2 km',
      imageUrl:
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 2,
      name: 'Downtown Sports Complex',
      location: 'Downtown, Cebu City',
      rating: 4.8,
      distance: '2.5 km',
      imageUrl:
        'https://images.unsplash.com/photo-1529926706528-db9e5010cd3e?auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 3,
      name: 'Riverside Recreation Center',
      location: 'Riverside, Cebu City',
      rating: 4.3,
      distance: '3.1 km',
      imageUrl:
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 4,
      name: 'Ayala Sports Hub',
      location: 'Ayala Center, Cebu City',
      rating: 4.9,
      distance: '4.0 km',
      imageUrl:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 5,
      name: 'IT Park Pickle Courts',
      location: 'IT Park, Cebu City',
      rating: 4.6,
      distance: '5.2 km',
      imageUrl:
        'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 6,
      name: 'Mactan Island Courts',
      location: 'Lapu-Lapu City',
      rating: 4.4,
      distance: '8.5 km',
      imageUrl:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=60',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Updated StatusBar color */}
      <StatusBar barStyle="light-content" backgroundColor={thematicBlue} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.courtsSection}>
          <Text style={styles.sectionTitle}>Available Courts</Text>
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
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  
  content: {
    flex: 1,
    paddingBottom: 10,
  },
  courtsSection: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: thematicBlue,
    marginBottom: 15,
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
});

export default FindCourtsScreen;
