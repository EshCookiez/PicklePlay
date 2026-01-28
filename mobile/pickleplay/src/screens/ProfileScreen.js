import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {MaterialIcons} from '@expo/vector-icons';
import Colors from '../constants/Colors';

const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const ProfileScreen = ({ navigation, onBackNavigation }) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(4);
  const screens = ['Home', 'Find', 'Map', 'Shop', 'Profile'];

  const playerStats = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    ranking: 'Gold',
    rankingTier: 2,
    experience: 650,
    experienceRequired: 1000,
    wins: 28,
    losses: 14,
    rating: 4.8,
    gamesPlayed: 42,
    friends: 12,
    winRate: 66.7,
    avgScore: 21,
  };

  const getRankColor = (ranking) => {
    const ranks = {
      'Bronze': '#CD7F32',
      'Silver': '#C0C0C0',
      'Gold': '#FFD700',
      'Platinum': '#E5E4E2',
      'Diamond': '#B9F2FF',
      'Master': '#FF1493',
    };
    return ranks[ranking] || '#FFD700';
  };

  const navigateWithDirection = (targetIndex) => {
    if (targetIndex === currentScreenIndex) return;
    const isMovingForward = targetIndex > currentScreenIndex;
    setCurrentScreenIndex(targetIndex);
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
      screen: 'PersonalInformation',
    },
    {
      icon: 'settings',
      title: 'Settings',
      description: 'Manage app preferences',
      screen: 'Settings',
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      description: 'Configure notification settings',
      screen: 'NotificationsPrefs',
    },
    {
      icon: 'security',
      title: 'Privacy & Security',
      description: 'Manage your privacy settings',
      screen: 'PrivacySecurity',
    },
    {
      icon: 'help',
      title: 'Help & Support',
      description: 'Get help with the app',
      screen: 'HelpSupport',
    },
    {
      icon: 'info',
      title: 'About',
      description: 'App version and information',
      screen: 'About',
    },
  ];

  const handleLogout = () => {
    navigation.navigate('Login', { direction: 'left', screenIndex: 0 });
  };

  const StatCard = ({ icon, label, value, backgroundColor }) => (
    <View style={[styles.statCard, { backgroundColor }]}>
      <MaterialIcons name={icon} size={28} color={Colors.white} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={thematicBlue} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <View style={styles.profileHeaderSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{uri: playerStats.profileImage}} 
              style={styles.profileImage} 
            />
            <View style={[styles.rankBadge, { backgroundColor: getRankColor(playerStats.ranking) }]}>
              <Text style={styles.rankBadgeText}>{playerStats.ranking}</Text>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <MaterialIcons name="camera-alt" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{playerStats.name}</Text>
          <Text style={styles.rankingNameText}>{playerStats.ranking} Ranked Player</Text>
          <Text style={styles.profileEmail}>{playerStats.email}</Text>
          
          {/* Experience Bar */}
          <View style={styles.experienceContainer}>
            <View style={styles.experienceBar}>
              <View 
                style={[
                  styles.experienceProgress,
                  { 
                    width: `${(playerStats.experience / playerStats.experienceRequired) * 100}%`,
                    backgroundColor: getRankColor(playerStats.ranking)
                  }
                ]} 
              />
            </View>
            <Text style={styles.experienceText}>
              {playerStats.experience} / {playerStats.experienceRequired} XP
            </Text>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="emoji-events" label="Wins" value={playerStats.wins} backgroundColor="#4CAF50" />
            <StatCard icon="trending-up" label="Win Rate" value={`${playerStats.winRate}%`} backgroundColor="#2196F3" />
            <StatCard icon="sports-tennis" label="Games" value={playerStats.gamesPlayed} backgroundColor="#FF9800" />
            <StatCard icon="star" label="Rating" value={playerStats.rating} backgroundColor="#9C27B0" />
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {profileOptions.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionItem}
              onPress={() => navigation.navigate(option.screen)}
            >
              <View style={styles.optionIcon}>
                <MaterialIcons name={option.icon} size={24} color={thematicBlue} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{height: 30}} />
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
  },
  profileHeaderSection: {
    backgroundColor: thematicBlue,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  rankBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankBadgeText: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: thematicBlue,
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 5,
  },
  rankingNameText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 15,
  },
  experienceContainer: {
    width: '80%',
    alignItems: 'center',
  },
  experienceBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  experienceProgress: {
    height: '100%',
    borderRadius: 4,
  },
  experienceText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: thematicBlue,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  optionsSection: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${thematicBlue}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: '#888',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 10,
  },
});

export default ProfileScreen;
