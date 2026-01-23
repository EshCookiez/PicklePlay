import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

// Define the new color constants for easy reuse
const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const GlobalFooter = ({ currentScreenIndex = 0, onNavigate }) => {
  const screens = ['Home', 'FindCourts', 'Map', 'Shop', 'Profile'];

  const handleNavigation = (screenName, index) => {
    if (__DEV__) {
      console.log('Footer navigation pressed:', screenName, index);
    }
    if (onNavigate) {
      if (__DEV__) {
        console.log('Calling onNavigate with:', screenName, index);
      }
      onNavigate(screenName, index);
    } else {
      if (__DEV__) {
        console.log('onNavigate is not defined');
      }
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => {
          if (__DEV__) console.log('Home icon pressed');
          handleNavigation('Home', 0);
        }}>
        <View style={[styles.navIconContainer, currentScreenIndex === 0 && styles.activeNavIcon]}>
          <MaterialIcons name="home" size={24} color={currentScreenIndex === 0 ? activeColor : thematicBlue} />
        </View>
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          if (__DEV__) console.log('FindCourts icon pressed');
          handleNavigation('FindCourts', 1);
        }}>
        <View style={[styles.navIconContainer, currentScreenIndex === 1 && styles.activeNavIcon]}>
          <MaterialIcons name="search" size={24} color={currentScreenIndex === 1 ? activeColor : thematicBlue} />
        </View>
        <Text style={styles.navText}>Find</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          if (__DEV__) console.log('Map icon pressed');
          handleNavigation('Map', 2);
        }}>
        <View style={[styles.navIconContainer, currentScreenIndex === 2 && styles.activeNavIcon]}>
          <MaterialIcons name="map" size={24} color={currentScreenIndex === 2 ? activeColor : thematicBlue} />
        </View>
        <Text style={styles.navText}>Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          if (__DEV__) console.log('Shop icon pressed');
          handleNavigation('Shop', 3);
        }}>
        <View style={[styles.navIconContainer, currentScreenIndex === 3 && styles.activeNavIcon]}>
          <MaterialIcons
            name="shopping-cart"
            size={24}
            color={currentScreenIndex === 3 ? activeColor : thematicBlue}
          />
        </View>
        <Text style={styles.navText}>Shop</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          if (__DEV__) console.log('Profile icon pressed');
          handleNavigation('Profile', 4);
        }}>
        <View style={[styles.navIconContainer, currentScreenIndex === 4 && styles.activeNavIcon]}>
          <MaterialIcons
            name="person"
            size={24}
            color={currentScreenIndex === 4 ? activeColor : thematicBlue}
          />
        </View>
        <Text style={styles.navText}>Profile</Text>
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
    paddingBottom: 10,
    paddingTop: 8,
    height: 70,
    zIndex: 1000,
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
