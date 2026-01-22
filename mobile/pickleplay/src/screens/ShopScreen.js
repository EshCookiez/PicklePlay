import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  FlatList,
  BackHandler,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {MaterialIcons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

// Define the new color constants for easy reuse
const thematicBlue = '#0A56A7';
const activeColor = '#a3ff01';

const ShopScreen = ({ navigation }) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const screens = ['Home', 'FindCourts', 'Map', 'Shop'];

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
    if (navigation && navigation.navigate) {
      navigation.navigate('Home', { direction: 'left', screenIndex: 0 });
    }
  };

  const categories = ['All', 'Paddles', 'Balls', 'Apparel', 'Accessories'];

  const products = [
    {
      id: 1,
      name: 'Pro Carbon Paddle',
      category: 'Paddles',
      price: '$149.99',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1559826263-a639d6fb4f0?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 2,
      name: 'Tournament Balls (6-pack)',
      category: 'Balls',
      price: '$24.99',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 3,
      name: 'Performance Jersey',
      category: 'Apparel',
      price: '$59.99',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 4,
      name: 'Grip Tape Set',
      category: 'Accessories',
      price: '$19.99',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1559826263-a639d6fb4f0?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 5,
      name: 'Beginner Paddle Set',
      category: 'Paddles',
      price: '$89.99',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1559826263-a639d6fb4f0?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 6,
      name: 'Court Shoes',
      category: 'Apparel',
      price: '$79.99',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const renderProduct = ({item}) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{uri: item.image}} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <View style={styles.productRating}>
          <MaterialIcons name="star" size={16} color={thematicBlue} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.addToCartButton}>
        <MaterialIcons name="add-shopping-cart" size={20} color={Colors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
        {/* Shop Banner */}
        <View style={styles.bannerSection}>
          <LinearGradient
            colors={[thematicBlue, '#084590']}
            style={styles.banner}>
            <Text style={styles.bannerTitle}>PICKLEBALL SHOP</Text>
            <Text style={styles.bannerSubtitle}>Premium gear for every player</Text>
            <TouchableOpacity style={styles.shopNowButton}>
              <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.activeCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Products</Text>
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Special Offers */}
        <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <View style={styles.offerCard}>
            <View style={styles.offerContent}>
              <MaterialIcons name="local-offer" size={30} color={thematicBlue} />
              <View style={styles.offerText}>
                <Text style={styles.offerTitle}>20% OFF Starter Sets</Text>
                <Text style={styles.offerDescription}>Perfect for beginners</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.offerButton}>
              <Text style={styles.offerButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
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
  },
  bannerSection: {
    margin: 15,
  },
  banner: {
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    marginBottom: 10,
  },
  shopNowButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shopNowText: {
    color: thematicBlue,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesSection: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: thematicBlue,
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeCategoryButton: {
    backgroundColor: thematicBlue,
    borderColor: thematicBlue,
  },
  categoryText: {
    fontSize: 14,
    color: thematicBlue,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: Colors.white,
  },
  productsSection: {
    margin: 15,
  },
  productCard: {
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
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: thematicBlue,
    marginBottom: 3,
  },
  productCategory: {
    fontSize: 12,
    color: thematicBlue,
    opacity: 0.7,
    marginBottom: 3,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  ratingText: {
    fontSize: 12,
    color: thematicBlue,
    marginLeft: 3,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: thematicBlue,
  },
  addToCartButton: {
    backgroundColor: thematicBlue,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offersSection: {
    margin: 15,
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  offerText: {
    marginLeft: 15,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: thematicBlue,
    marginBottom: 3,
  },
  offerDescription: {
    fontSize: 13,
    color: thematicBlue,
    opacity: 0.7,
  },
  offerButton: {
    backgroundColor: thematicBlue,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  offerButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
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

export default ShopScreen;
