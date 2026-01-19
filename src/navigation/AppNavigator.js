import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar las pantallas
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
// CAMBIO: Importamos el nuevo archivo que creamos
import ChatScreenList from '../screens/ChatScreenList'; 
import MainTabNavigator from './MainTabNavigator';
import FriendsListScreen from '../screens/FriendsListScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        
        {/* CAMBIO: Usamos el nombre 'ChatDetail' para la conversación individual */}
        <Stack.Screen name="ChatDetail" component={ChatScreenList} />
        
        <Stack.Screen name="FriendsList" component={FriendsListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}