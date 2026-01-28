import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

const thematicBlue = '#0A56A7';

const GlobalHeader = ({ title = 'PICKLEPLAY' }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <LinearGradient
      colors={[thematicBlue, thematicBlue]}
      style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      <View style={styles.headerContent}>
        <View style={styles.backButtonPlaceholder} />
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/PicklePlayLogo.jpg')}
            style={styles.logoImage}
          />
          <Text style={styles.logo}>{title}</Text>
        </View>
        <View style={styles.rightPlaceholder} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  rightPlaceholder: {
    width: 40,
    height: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
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
});

export default GlobalHeader;
