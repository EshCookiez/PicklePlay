import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoadingScreen from './src/screens/LoadingScreen';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import FindCourtsScreen from './src/screens/FindCourtsScreen';
import CourtDetailScreen from './src/screens/CourtDetailScreen';
import MapScreen from './src/screens/MapScreen';
import ShopScreen from './src/screens/ShopScreen';
import ScreenWrapper from './src/components/ScreenWrapper';

const Stack = createNativeStackNavigator();

const getScreenOptions = ({route}) => {
  const screenOptions = {
    headerShown: false,
    gestureEnabled: true,
    animationDuration: 300,
  };
  
  // Custom animation based on navigation direction
  if (route.params?.direction === 'left') {
    screenOptions.animation = 'slide_from_left';
  } else {
    screenOptions.animation = 'slide_from_right';
  }
  
  return screenOptions;
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={getScreenOptions} initialRouteName="Loading">
        {/* Authentication Flow */}
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Main App Flow */}
        <Stack.Screen name="Home">
          {() => (
            <ScreenWrapper>
              <HomeScreen />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="FindCourts">
          {({ navigation }) => (
            <ScreenWrapper>
              <FindCourtsScreen navigation={navigation} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="CourtDetail" component={CourtDetailScreen} />
        <Stack.Screen name="Map">
          {({ navigation }) => (
            <ScreenWrapper>
              <MapScreen navigation={navigation} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Shop">
          {({ navigation }) => (
            <ScreenWrapper>
              <ShopScreen navigation={navigation} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
