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

const CourtDetailScreen = ({route, navigation}) => {
  const {court} = route.params;
  const [currentScreenIndex, setCurrentScreenIndex] = useState(2);
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
      toValue: index > currentScreenIndex ? -300 : 300,
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
      <Animated.View 
        style={[styles.bottomNav, {transform: [{translateX}]}]}
        {...panResponder.panHandlers}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {
            setCurrentScreenIndex(0);
            navigation.navigate('Home');
          }}>
          <View style={[styles.navIconContainer, currentScreenIndex === 0 && styles.activeNavIcon]}>
            <MaterialIcons name="home" size={24} color={currentScreenIndex === 0 ? activeColor : thematicBlue} />
          </View>
          <Text style={[styles.navText, currentScreenIndex === 0 && styles.activeNavText]}>Home</Text>
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
          <Text style={[styles.navText, currentScreenIndex === 1 && styles.activeNavText]}>Find</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
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
