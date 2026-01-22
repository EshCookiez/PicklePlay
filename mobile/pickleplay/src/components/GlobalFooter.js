import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../constants/Colors';

// Define the new color constants for easy reuse
const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const GlobalFooter = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const screens = ['Home', 'FindCourts', 'Map', 'Shop'];

  // Update screen index based on current route
  useEffect(() => {
    const routeName = route.name;
    const index = screens.indexOf(routeName);
    if (index !== -1) {
      setCurrentScreenIndex(index);
    }
  }, [route.name]);

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

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigateWithDirection(0)}>
        <View style={[styles.navIconContainer, currentScreenIndex === 0 && styles.activeNavIcon]}>
          <MaterialIcons name="home" size={24} color={currentScreenIndex === 0 ? activeColor : thematicBlue} />
        </View>
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateWithDirection(1)}>
        <View style={[styles.navIconContainer, currentScreenIndex === 1 && styles.activeNavIcon]}>
          <MaterialIcons name="search" size={24} color={currentScreenIndex === 1 ? activeColor : thematicBlue} />
        </View>
        <Text style={styles.navText}>Find</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateWithDirection(2)}>
        <View style={[styles.navIconContainer, currentScreenIndex === 2 && styles.activeNavIcon]}>
          <MaterialIcons name="map" size={24} color={currentScreenIndex === 2 ? activeColor : thematicBlue} />
        </View>
        <Text style={styles.navText}>Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateWithDirection(3)}>
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
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(163, 255, 1, 0.1)',
  },
  navText: {
    fontSize: 11,
    color: thematicBlue,
    marginTop: 2,
    fontWeight: '500',
  },
});

export default GlobalFooter;
