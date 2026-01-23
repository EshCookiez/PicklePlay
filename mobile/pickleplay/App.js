import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, View, StyleSheet, Easing} from 'react-native';

// Import screens
import LoadingScreen from './src/screens/LoadingScreen';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import FindCourtsScreen from './src/screens/FindCourtsScreen';
import CourtDetailScreen from './src/screens/CourtDetailScreen';
import MapScreen from './src/screens/MapScreen';
import ShopScreen from './src/screens/ShopScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import GlobalFooter from './src/components/GlobalFooter';
import ScreenWrapper from './src/components/ScreenWrapper';
import Colors from './src/constants/Colors';

const Stack = createStackNavigator();

const getScreenOptions = ({route}) => {
  const screenOptions = {
    headerShown: false,
    gestureEnabled: true,
    animationDuration: 600, // Increased for smoother feel
    animationTypeForReplace: 'push',
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic), // Smooth easing function
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
  
  // Custom animation based on navigation direction
  if (route.params?.direction === 'left') {
    screenOptions.animation = 'slide_from_left';
  } else if (route.params?.direction === 'right') {
    screenOptions.animation = 'slide_from_right';
  } else {
    screenOptions.animation = 'slide_from_right'; // Default
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
    
    // Determine transition direction based on current and target screen index
    const isMovingForward = index > currentScreenIndex;
    const direction = isMovingForward ? 'right' : 'left';
    
    if (__DEV__) {
      console.log(`Transition: ${currentScreenIndex} → ${index} (${direction})`);
    }
    
    setCurrentScreenIndex(index);
    setCurrentRoute(screenName);
    
    // Use the navigation container ref with proper direction
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
    } else {
      if (__DEV__) {
        console.log('Navigation container ref not available');
      }
    }
  }, [currentScreenIndex]);

  // Handle back button navigation from headers
  const handleBackNavigation = useCallback(() => {
    if (__DEV__) {
      console.log('Back button pressed, navigating to Home');
    }
    
    // Use left transition for back button
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
    } else {
      if (__DEV__) {
        console.log('Navigation ref not available for back navigation');
      }
    }
  }, []);

  // Screens that should show the footer
  const footerScreens = useMemo(() => ['Home', 'FindCourts', 'Map', 'Shop', 'Profile'], []);
  const shouldShowFooter = useMemo(() => footerScreens.includes(currentRoute), [currentRoute, footerScreens]);

  // Create screen wrapper to handle route updates - memoized to prevent recreation
  const createScreenWithRouteTracking = useCallback((screenName, ScreenComponent, onBackNavigation) => {
    return ({ navigation }) => {
      useEffect(() => {
        // Update route immediately when screen mounts
        setCurrentRoute(screenName);
        if (__DEV__) {
          console.log('Route updated to:', screenName);
        }
      }, [screenName]);
      
      return (
        <ScreenWrapper>
          <ScreenComponent navigation={navigation} onBackNavigation={onBackNavigation} />
        </ScreenWrapper>
      );
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={styles.container}>
        <Stack.Navigator 
          ref={navigationRef}
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
          <Stack.Screen name="Map">
            {createScreenWithRouteTracking('Map', MapScreen, handleBackNavigation)}
          </Stack.Screen>
          <Stack.Screen name="Shop">
            {createScreenWithRouteTracking('Shop', ShopScreen, handleBackNavigation)}
          </Stack.Screen>
          <Stack.Screen name="Profile">
            {createScreenWithRouteTracking('Profile', ProfileScreen, handleBackNavigation)}
          </Stack.Screen>
        </Stack.Navigator>
        {shouldShowFooter && (
          <GlobalFooter 
            currentScreenIndex={currentScreenIndex}
            onNavigate={handleFooterNavigation}
          />
        )}
      </View>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
