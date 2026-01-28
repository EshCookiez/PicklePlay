import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, View, StyleSheet, Easing} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Import screens
import LoadingScreen from './src/screens/LoadingScreen';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import FindCourtsScreen from './src/screens/FindCourtsScreen';
import CourtDetailScreen from './src/screens/CourtDetailScreen';
import BookingScreen from './src/screens/BookingScreen';
import BookingReceiptScreen from './src/screens/BookingReceiptScreen';
import MapScreen from './src/screens/MapScreen';
import ShopScreen from './src/screens/ShopScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ShopReceiptScreen from './src/screens/ShopReceiptScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PersonalInformationScreen from './src/screens/PersonalInformationScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import PrivacySecurityScreen from './src/screens/PrivacySecurityScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import AboutScreen from './src/screens/AboutScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import GlobalFooter from './src/components/GlobalFooter';
import GlobalHeader from './src/components/GlobalHeader';
import ScreenWrapper from './src/components/ScreenWrapper';
import Colors from './src/constants/Colors';

const Stack = createStackNavigator();

const getScreenOptions = ({route}) => {
  const screenOptions = {
    headerShown: false,
    gestureEnabled: true,
    animationDuration: 600,
    animationTypeForReplace: 'push',
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        },
      },
    },
  };
  
  if (route.params?.direction === 'left') {
    screenOptions.animation = 'slide_from_left';
  } else if (route.params?.direction === 'right') {
    screenOptions.animation = 'slide_from_right';
  } else {
    screenOptions.animation = 'slide_from_right';
  }
  
  return screenOptions;
};

const App = () => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [currentRoute, setCurrentRoute] = useState('Loading');
  const navigationRef = useNavigationContainerRef();

  const handleFooterNavigation = useCallback((screenName, index) => {
    if (__DEV__) {
      console.log('App handleFooterNavigation called:', screenName, index);
    }
    
    const isMovingForward = index > currentScreenIndex;
    const direction = isMovingForward ? 'right' : 'left';
    
    if (__DEV__) {
      console.log(`Transition: ${currentScreenIndex} → ${index} (${direction})`);
    }
    
    setCurrentScreenIndex(index);
    setCurrentRoute(screenName);
    
    if (navigationRef.current) {
      if (__DEV__) {
        console.log('Navigation container ref available, navigating to:', screenName, 'with direction:', direction);
      }
      try {
        navigationRef.current.navigate(screenName, { direction, screenIndex: index });
      } catch (error) {
        if (__DEV__) {
          console.log('Navigation error:', error);
        }
      }
    }
  }, [currentScreenIndex]);

  const handleBackNavigation = useCallback(() => {
    if (__DEV__) {
      console.log('Back button pressed, navigating to Home');
    }
    
    setCurrentScreenIndex(0);
    setCurrentRoute('Home');
    
    if (navigationRef.current) {
      try {
        navigationRef.current.navigate('Home', { direction: 'left', screenIndex: 0 });
      } catch (error) {
        if (__DEV__) {
          console.log('Back navigation error:', error);
        }
      }
    }
  }, []);

  const footerScreens = useMemo(() => ['Home', 'FindCourts', 'Map', 'Shop', 'Profile', 'CourtDetail', 'Community'], []);
  const shouldShowFooter = useMemo(() => footerScreens.includes(currentRoute), [currentRoute, footerScreens]);

  const createScreenWithRouteTracking = useCallback((screenName, ScreenComponent, onBackNavigation) => {
    return ({ navigation, route }) => {
      useEffect(() => {
        setCurrentRoute(screenName);
        if (__DEV__) {
          console.log('Route updated to:', screenName);
        }
      }, [screenName]);
      
      return (
        <ScreenWrapper>
          <ScreenComponent navigation={navigation} route={route} onBackNavigation={onBackNavigation} />
        </ScreenWrapper>
      );
    };
  }, []);

  const screenIndexMap = useMemo(() => ({
    'Home': 0,
    'FindCourts': 1,
    'Map': 2,
    'Shop': 3,
    'Profile': 4,
    'Community': 5,
  }), []);

  const onNavigationStateChange = useCallback((state) => {
    if (!state) return;
    
    const currentRouteName = state.routes[state.index]?.name;
    const routeParams = state.routes[state.index]?.params;
    
    if (__DEV__) {
      console.log('Navigation state changed:', currentRouteName, routeParams);
    }
    
    if (routeParams?.screenIndex !== undefined) {
      setCurrentScreenIndex(routeParams.screenIndex);
    } else if (screenIndexMap[currentRouteName] !== undefined) {
      setCurrentScreenIndex(screenIndexMap[currentRouteName]);
    }
    
    setCurrentRoute(currentRouteName);
  }, [screenIndexMap]);

  const noHeaderScreens = useMemo(() => [
    'Loading', 'Landing', 'Login', 'Register',
    'PersonalInformation', 'Settings', 'NotificationsPrefs', 'PrivacySecurity', 'HelpSupport', 'About',
    'Booking', 'BookingReceipt', 'CourtDetail',
    'Cart', 'Checkout', 'ShopReceipt', 'ProductDetail'
  ], []);
  const shouldShowHeader = useMemo(() => !noHeaderScreens.includes(currentRoute), [currentRoute, noHeaderScreens]);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} onStateChange={onNavigationStateChange}>
        <View style={styles.container}>
          {shouldShowHeader && (
            <GlobalHeader />
          )}
          <View style={styles.stackContainer}>
            <Stack.Navigator 
              screenOptions={getScreenOptions}
              initialRouteName="Loading">
              {/* Authentication Flow */}
              <Stack.Screen name="Loading" component={LoadingScreen} />
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              
              {/* Main App Flow */}
              <Stack.Screen name="Home">
                {createScreenWithRouteTracking('Home', HomeScreen)}
              </Stack.Screen>
              <Stack.Screen name="FindCourts">
                {createScreenWithRouteTracking('FindCourts', FindCourtsScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="CourtDetail">
                {createScreenWithRouteTracking('CourtDetail', CourtDetailScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="Booking">
                {createScreenWithRouteTracking('Booking', BookingScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="BookingReceipt">
                {createScreenWithRouteTracking('BookingReceipt', BookingReceiptScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="Map">
                {createScreenWithRouteTracking('Map', MapScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="Shop">
                {createScreenWithRouteTracking('Shop', ShopScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="ProductDetail">
                {createScreenWithRouteTracking('ProductDetail', ProductDetailScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="Cart">
                {createScreenWithRouteTracking('Cart', CartScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="Checkout">
                {createScreenWithRouteTracking('Checkout', CheckoutScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="ShopReceipt">
                {createScreenWithRouteTracking('ShopReceipt', ShopReceiptScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="Profile">
                {createScreenWithRouteTracking('Profile', ProfileScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="Community">
                {createScreenWithRouteTracking('Community', CommunityScreen, handleBackNavigation)}
              </Stack.Screen>

              {/* Profile Settings Screens */}
              <Stack.Screen name="PersonalInformation">
                {createScreenWithRouteTracking('PersonalInformation', PersonalInformationScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="Settings">
                {createScreenWithRouteTracking('Settings', SettingsScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="NotificationsPrefs">
                {createScreenWithRouteTracking('NotificationsPrefs', NotificationsScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="PrivacySecurity">
                {createScreenWithRouteTracking('PrivacySecurity', PrivacySecurityScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="HelpSupport">
                {createScreenWithRouteTracking('HelpSupport', HelpSupportScreen, handleBackNavigation)}
              </Stack.Screen>
              <Stack.Screen name="About">
                {createScreenWithRouteTracking('About', AboutScreen, handleBackNavigation)}
              </Stack.Screen>
            </Stack.Navigator>
          </View>
          {shouldShowFooter && (
            <GlobalFooter 
              currentScreenIndex={currentScreenIndex}
              onNavigate={handleFooterNavigation}
            />
          )}
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0A56A7',
  },
  stackContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});
