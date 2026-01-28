import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const PrivacySecurityScreen = ({ navigation }) => {
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showOnlineStatus: true,
    allowFriendRequests: true,
    shareGameStats: true,
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const PrivacyItem = ({ icon, title, description, value, onToggle }) => (
    <View style={styles.privacyItem}>
      <View style={styles.privacyInfo}>
        <View style={styles.privacyHeader}>
          <MaterialIcons name={icon} size={24} color={thematicBlue} />
          <Text style={styles.privacyTitle}>{title}</Text>
        </View>
        <Text style={styles.privacyDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: activeColor }}
        thumbColor={value ? thematicBlue : '#f4f3f4'}
      />
    </View>
  );

  const ActionItem = ({ icon, title, description, onPress, isDanger }) => (
    <TouchableOpacity
      style={[styles.actionItem, isDanger && styles.dangerItem]}
      onPress={onPress}
    >
      <View style={styles.actionInfo}>
        <MaterialIcons name={icon} size={24} color={isDanger ? '#FF6B6B' : thematicBlue} />
        <View style={styles.actionContent}>
          <Text style={[styles.actionTitle, isDanger && styles.dangerText]}>{title}</Text>
          <Text style={styles.actionDescription}>{description}</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={isDanger ? '#FF6B6B' : Colors.border} />
    </TouchableOpacity>
  );

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Feature coming soon', [{ text: 'OK' }]);
  };

  const handleBlockedUsers = () => {
    Alert.alert('Blocked Users', 'You have 0 blocked users', [{ text: 'OK' }]);
  };

  const handleDataDownload = () => {
    Alert.alert('Download Data', 'Your data download is being prepared', [{ text: 'OK' }]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => Alert.alert('Account Deleted', 'Your account has been deleted'),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={thematicBlue} />


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <PrivacyItem
            icon="public"
            title="Public Profile"
            description="Allow others to view your profile"
            value={privacy.profilePublic}
            onToggle={(value) => setPrivacy({ ...privacy, profilePublic: value })}
          />
          <PrivacyItem
            icon="check-circle"
            title="Online Status"
            description="Show when you're using the app"
            value={privacy.showOnlineStatus}
            onToggle={(value) => setPrivacy({ ...privacy, showOnlineStatus: value })}
          />
          <PrivacyItem
            icon="person-add"
            title="Friend Requests"
            description="Allow others to send friend requests"
            value={privacy.allowFriendRequests}
            onToggle={(value) => setPrivacy({ ...privacy, allowFriendRequests: value })}
          />
          <PrivacyItem
            icon="trending-up"
            title="Share Statistics"
            description="Share your game stats publicly"
            value={privacy.shareGameStats}
            onToggle={(value) => setPrivacy({ ...privacy, shareGameStats: value })}
          />
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <PrivacyItem
            icon="lock"
            title="Two-Factor Auth"
            description="Add an extra layer of security"
            value={privacy.twoFactorAuth}
            onToggle={(value) => setPrivacy({ ...privacy, twoFactorAuth: value })}
          />
          <PrivacyItem
            icon="notifications"
            title="Login Alerts"
            description="Get notified of new sign-ins"
            value={privacy.loginAlerts}
            onToggle={(value) => setPrivacy({ ...privacy, loginAlerts: value })}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <ActionItem
            icon="lock"
            title="Change Password"
            description="Update your account password"
            onPress={handleChangePassword}
          />
          <ActionItem
            icon="block"
            title="Blocked Users"
            description="Manage your blocked users list"
            onPress={handleBlockedUsers}
          />
          <ActionItem
            icon="download"
            title="Download Your Data"
            description="Get a copy of your personal data"
            onPress={handleDataDownload}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#FF6B6B' }]}>Danger Zone</Text>
          <ActionItem
            icon="delete-forever"
            title="Delete Account"
            description="Permanently delete your account"
            onPress={handleDeleteAccount}
            isDanger={true}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <MaterialIcons name="info" size={20} color={thematicBlue} />
          <Text style={styles.infoText}>
            Your privacy and security are important to us. Review these settings regularly.
          </Text>
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
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  sectionTitle: {
    color: thematicBlue,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  privacyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  privacyInfo: {
    flex: 1,
    marginRight: 10,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  privacyTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  privacyDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
    marginLeft: 36,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  dangerItem: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  actionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionContent: {
    marginLeft: 12,
  },
  actionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  dangerText: {
    color: '#FF6B6B',
  },
  actionDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    margin: 15,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: thematicBlue,
  },
  infoText: {
    color: Colors.text,
    fontSize: 13,
    marginLeft: 12,
    flex: 1,
  },
});

export default PrivacySecurityScreen;
