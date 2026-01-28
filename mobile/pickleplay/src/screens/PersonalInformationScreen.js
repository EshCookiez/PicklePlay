import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const PersonalInformationScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    city: 'New York',
    state: 'NY',
    bio: 'Passionate pickleball player and enthusiast!',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => setIsEditing(false) },
    ]);
  };

  /* Removed useLayoutEffect in favor of Custom Header */

  const InputField = ({ label, value, onChangeText, icon }) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabelRow}>
        <MaterialIcons name={icon} size={20} color={thematicBlue} />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      {isEditing ? (
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#999"
        />
      ) : (
        <Text style={styles.staticValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={thematicBlue} />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Personal Information</Text>

        <TouchableOpacity
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          style={styles.headerButton}
        >
          <MaterialIcons
            name={isEditing ? "check" : "edit"}
            size={24}
            color={Colors.white}
            style={isEditing ? { color: activeColor } : {}}
          />
        </TouchableOpacity>
      </View>


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
            }}
            style={styles.avatar}
          />
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <MaterialIcons name="camera-alt" size={20} color={Colors.white} />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <InputField
            icon="person"
            label="First Name"
            value={userData.firstName}
            onChangeText={(text) => setUserData({ ...userData, firstName: text })}
          />
          <InputField
            icon="person"
            label="Last Name"
            value={userData.lastName}
            onChangeText={(text) => setUserData({ ...userData, lastName: text })}
          />
          <InputField
            icon="email"
            label="Email"
            value={userData.email}
            onChangeText={(text) => setUserData({ ...userData, email: text })}
          />
          <InputField
            icon="phone"
            label="Phone Number"
            value={userData.phone}
            onChangeText={(text) => setUserData({ ...userData, phone: text })}
          />
          <InputField
            icon="location-on"
            label="City"
            value={userData.city}
            onChangeText={(text) => setUserData({ ...userData, city: text })}
          />
          <InputField
            icon="map"
            label="State"
            value={userData.state}
            onChangeText={(text) => setUserData({ ...userData, state: text })}
          />
          <View style={styles.inputContainer}>
            <View style={styles.inputLabelRow}>
              <MaterialIcons name="description" size={20} color={thematicBlue} />
              <Text style={styles.inputLabel}>Bio</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={userData.bio}
                onChangeText={(text) => setUserData({ ...userData, bio: text })}
                multiline
                numberOfLines={3}
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.staticValue}>{userData.bio}</Text>
            )}
          </View>
        </View>

        {/* Save Button */}
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
    backgroundColor: thematicBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: activeColor,
  },
  changePhotoButton: {
    marginTop: 15,
    flexDirection: 'row',
    backgroundColor: thematicBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  changePhotoText: {
    color: Colors.white,
    marginLeft: 8,
    fontWeight: '600',
  },
  formSection: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: thematicBlue,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 16,
    backgroundColor: Colors.surface,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  staticValue: {
    color: Colors.text,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  saveButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: activeColor,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: thematicBlue,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default PersonalInformationScreen;
