import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Animated,
  PanResponder,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {MaterialIcons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

// Define the new color constants for easy reuse
const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const FindCourtsScreen = ({navigation}) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(1);
  const screens = ['Home', 'Find', 'Map', 'Shop'];
  
  const translateX = useRef(new Animated.Value(0)).current;
  
  const onPanGestureMove = Animated.event(
    [],
    { listener: (evt, gestureState) => {
      const {dx} = gestureState;
      translateX.setValue(dx);
    }, useNativeDriver: false },
  );
  
  const onPanGestureRelease = (evt, gestureState) => {
    const {dx, vx} = gestureState;
    
    // Determine swipe direction
    if (Math.abs(dx) > 50) {
      if (dx < 0 && currentScreenIndex > 0) {
        // Swipe left - go to previous screen
        setCurrentScreenIndex(currentScreenIndex - 1);
        navigateToScreen(currentScreenIndex - 1);
      } else if (dx > 0 && currentScreenIndex < screens.length - 1) {
        // Swipe right - go to next screen
        setCurrentScreenIndex(currentScreenIndex + 1);
        navigateToScreen(currentScreenIndex + 1);
      }
    }
    
    // Reset position with spring animation
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };
  
  const navigateToScreen = (index) => {
    // Animate screen transition
    Animated.spring(translateX, {
      toValue: index > currentScreenIndex ? 300 : -300,
      useNativeDriver: false,
      duration: 300,
    }).start(() => {
      setCurrentScreenIndex(index);
      setTimeout(() => {
        switch (index) {
          case 0:
            navigation.navigate('Home');
            break;
          case 1:
            navigation.navigate('FindCourts');
            break;
          case 2:
            // Map screen - not implemented yet
            break;
          case 3:
            // Shop screen - not implemented yet
            break;
        }
      }, 350);
    });
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onMove: onPanGestureMove,
      onRelease: onPanGestureRelease,
    })
  ).current;
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/PicklePlayLogo.jpg')} style={styles.logoImage} />
            <Text style={styles.logo}>PICKLEPLAY</Text>
          </View>
        </View>
      </LinearGradient>

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

      {/* Bottom Navigation with Swipe Gestures */}
      <Animated.View 
        style={[styles.bottomNav, {transform: [{translateX}]}]}
        {...panResponder.panHandlers}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {
            navigateToScreen(0);
          }}>
          <View style={[styles.navIconContainer, currentScreenIndex === 0 && styles.activeNavIcon]}>
            <MaterialIcons name="home" size={24} color={currentScreenIndex === 0 ? activeColor : thematicBlue} />
          </View>
          <Text style={[styles.navText, currentScreenIndex === 0 && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIconContainer, currentScreenIndex === 1 && styles.activeNavIcon]}>
            <MaterialIcons name="search" size={24} color={currentScreenIndex === 1 ? activeColor : thematicBlue} />
          </View>
          <Text style={[styles.navText, currentScreenIndex === 1 && styles.activeNavText]}>Find</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIconContainer, currentScreenIndex === 2 && styles.activeNavIcon]}>
            <MaterialIcons name="map" size={24} color={currentScreenIndex === 2 ? activeColor : thematicBlue} />
          </View>
          <Text style={[styles.navText, currentScreenIndex === 2 && styles.activeNavText]}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIconContainer, currentScreenIndex === 3 && styles.activeNavIcon]}>
            <MaterialIcons
              name="shopping-cart"
              size={24}
              color={currentScreenIndex === 3 ? activeColor : thematicBlue}
            />
          </View>
          <Text style={[styles.navText, currentScreenIndex === 3 && styles.activeNavText]}>Shop</Text>
        </TouchableOpacity>
      </Animated.View>
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

export default FindCourtsScreen;
