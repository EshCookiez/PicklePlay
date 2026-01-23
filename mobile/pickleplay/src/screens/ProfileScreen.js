import React, {useState} from 'react';
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

const ProfileScreen = ({ navigation, onBackNavigation }) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(4);
  const screens = ['Home', 'Find', 'Map', 'Shop', 'Profile'];

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

  const profileOptions = [
    {
      icon: 'person',
      title: 'Personal Information',
      description: 'Update your profile details',
      onPress: () => console.log('Personal Information pressed'),
    },
    {
      icon: 'settings',
      title: 'Settings',
      description: 'Manage app preferences',
      onPress: () => console.log('Settings pressed'),
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      description: 'Configure notification settings',
      onPress: () => console.log('Notifications pressed'),
    },
    {
      icon: 'security',
      title: 'Privacy & Security',
      description: 'Manage your privacy settings',
      onPress: () => console.log('Privacy & Security pressed'),
    },
    {
      icon: 'help',
      title: 'Help & Support',
      description: 'Get help with the app',
      onPress: () => console.log('Help & Support pressed'),
    },
    {
      icon: 'info',
      title: 'About',
      description: 'App version and information',
      onPress: () => console.log('About pressed'),
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
        {/* Profile Header Section */}
        <View style={styles.profileHeaderSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}} 
              style={styles.profileImage} 
            />
            <TouchableOpacity style={styles.editProfileButton}>
              <MaterialIcons name="camera-alt" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@example.com</Text>
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
          </View>
        </View>

        {/* Profile Options Section */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionCard}
              onPress={option.onPress}>
              <View style={styles.optionIcon}>
                <MaterialIcons
                  name={option.icon}
                  size={24}
                  color={thematicBlue}
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={Colors.border} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton}>
            <MaterialIcons name="logout" size={20} color={Colors.white} />
            <Text style={styles.logoutText}>Log Out</Text>
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
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
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
  profileHeaderSection: {
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
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: thematicBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: thematicBlue,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.border,
    marginBottom: 20,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: thematicBlue,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.border,
  },
  optionsSection: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: thematicBlue,
    marginBottom: 15,
  },
  optionCard: {
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
  optionIcon: {
    width: 50,
    height: 50,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: thematicBlue,
    marginBottom: 3,
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.border,
    lineHeight: 18,
  },
  logoutSection: {
    margin: 15,
    marginBottom: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff4757',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;
