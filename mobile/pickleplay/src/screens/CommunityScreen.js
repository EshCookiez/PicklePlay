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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const thematicBlue = '#0A56A7';

const CommunityScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('feed');

  const posts = [
    {
      id: 1,
      user: 'John Doe',
      avatar: 'https://picsum.photos/seed/user1/100/100',
      time: '2 hours ago',
      content: 'Just had an amazing game at Banawa Community Court! The new nets are fantastic. Anyone up for doubles tomorrow morning?',
      likes: 24,
      comments: 8,
      image: 'https://picsum.photos/seed/post1/400/300',
    },
    {
      id: 2,
      user: 'Maria Santos',
      avatar: 'https://picsum.photos/seed/user2/100/100',
      time: '5 hours ago',
      content: 'Pro tip: Always warm up for at least 10 minutes before playing. Prevents injuries and improves performance! 🏓',
      likes: 56,
      comments: 12,
      image: null,
    },
    {
      id: 3,
      user: 'Mike Chen',
      avatar: 'https://picsum.photos/seed/user3/100/100',
      time: 'Yesterday',
      content: 'Looking for players for our weekend tournament at IT Park Courts. All skill levels welcome! DM me if interested.',
      likes: 89,
      comments: 34,
      image: 'https://picsum.photos/seed/post3/400/300',
    },
    {
      id: 4,
      user: 'Sarah Kim',
      avatar: 'https://picsum.photos/seed/user4/100/100',
      time: '2 days ago',
      content: 'Finally mastered the third shot drop! Thanks to everyone who gave me tips. This community is the best! 💪',
      likes: 112,
      comments: 28,
      image: null,
    },
  ];

  const events = [
    {
      id: 1,
      title: 'Weekend Open Tournament',
      date: 'Feb 1, 2026',
      location: 'IT Park Courts',
      participants: 32,
      image: 'https://picsum.photos/seed/event1/400/200',
    },
    {
      id: 2,
      title: 'Beginner Clinic',
      date: 'Feb 5, 2026',
      location: 'Ayala Sports Hub',
      participants: 16,
      image: 'https://picsum.photos/seed/event2/400/200',
    },
    {
      id: 3,
      title: 'Doubles Championship',
      date: 'Feb 15, 2026',
      location: 'Downtown Sports Complex',
      participants: 48,
      image: 'https://picsum.photos/seed/event3/400/200',
    },
  ];

  const groups = [
    { id: 1, name: 'Cebu Pickleball Club', members: 1250, image: 'https://picsum.photos/seed/group1/100/100' },
    { id: 2, name: 'Beginners Welcome', members: 680, image: 'https://picsum.photos/seed/group2/100/100' },
    { id: 3, name: 'Tournament Players', members: 420, image: 'https://picsum.photos/seed/group3/100/100' },
    { id: 4, name: 'Weekend Warriors', members: 890, image: 'https://picsum.photos/seed/group4/100/100' },
  ];

  const renderFeed = () => (
    <View style={styles.feedContainer}>
      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image source={{ uri: post.avatar }} style={styles.avatar} />
            <View style={styles.postUserInfo}>
              <Text style={styles.userName}>{post.user}</Text>
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MaterialIcons name="more-vert" size={20} color="#888" />
            </TouchableOpacity>
          </View>
          <Text style={styles.postContent}>{post.content}</Text>
          {post.image && (
            <Image source={{ uri: post.image }} style={styles.postImage} />
          )}
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={22} color={thematicBlue} />
              <Text style={styles.actionText}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={20} color={thematicBlue} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={22} color={thematicBlue} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderEvents = () => (
    <View style={styles.eventsContainer}>
      {events.map((event) => (
        <TouchableOpacity key={event.id} style={styles.eventCard} activeOpacity={0.8}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventDetail}>
              <MaterialIcons name="event" size={16} color={thematicBlue} />
              <Text style={styles.eventDetailText}>{event.date}</Text>
            </View>
            <View style={styles.eventDetail}>
              <MaterialIcons name="location-on" size={16} color={thematicBlue} />
              <Text style={styles.eventDetailText}>{event.location}</Text>
            </View>
            <View style={styles.eventDetail}>
              <MaterialIcons name="people" size={16} color={thematicBlue} />
              <Text style={styles.eventDetailText}>{event.participants} participants</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderGroups = () => (
    <View style={styles.groupsContainer}>
      {groups.map((group) => (
        <TouchableOpacity key={group.id} style={styles.groupCard} activeOpacity={0.8}>
          <Image source={{ uri: group.image }} style={styles.groupImage} />
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupMembers}>{group.members.toLocaleString()} members</Text>
          </View>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={thematicBlue} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Banner */}
        <LinearGradient colors={[thematicBlue, '#084590']} style={styles.headerBanner}>
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerSubtitle}>Connect with fellow players</Text>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
            onPress={() => setActiveTab('feed')}>
            <MaterialIcons 
              name="dynamic-feed" 
              size={20} 
              color={activeTab === 'feed' ? thematicBlue : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'events' && styles.activeTab]}
            onPress={() => setActiveTab('events')}>
            <MaterialIcons 
              name="event" 
              size={20} 
              color={activeTab === 'events' ? thematicBlue : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
            onPress={() => setActiveTab('groups')}>
            <MaterialIcons 
              name="groups" 
              size={20} 
              color={activeTab === 'groups' ? thematicBlue : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>Groups</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'feed' && renderFeed()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'groups' && renderGroups()}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <LinearGradient colors={[thematicBlue, '#084590']} style={styles.fabGradient}>
          <MaterialIcons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  headerBanner: {
    padding: 25,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: -15,
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: thematicBlue + '15',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginLeft: 6,
  },
  activeTabText: {
    color: thematicBlue,
  },
  feedContainer: {
    padding: 15,
    paddingTop: 20,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  postUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  postTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  moreButton: {
    padding: 5,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 21,
    color: '#333',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  actionText: {
    fontSize: 13,
    color: thematicBlue,
    marginLeft: 5,
    fontWeight: '500',
  },
  eventsContainer: {
    padding: 15,
    paddingTop: 20,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDetailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  groupsContainer: {
    padding: 15,
    paddingTop: 20,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  groupImage: {
    width: 55,
    height: 55,
    borderRadius: 12,
  },
  groupInfo: {
    flex: 1,
    marginLeft: 15,
  },
  groupName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 13,
    color: '#888',
  },
  joinButton: {
    backgroundColor: thematicBlue,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommunityScreen;
