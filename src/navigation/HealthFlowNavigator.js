// src/components/navigation/HealthFlowNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AgeScreen from '../screens/AgeScreen';
import BodyMetricsScreen from '../screens/BodyMetricsScreen';
import SleepWaterScreen from '../screens/SleepWaterScreen';
import ActivityLevelScreen from '../screens/ActivityLevelScreen';
import HealthResultsScreen from '../screens/HealthResultsScreen';

const Stack = createNativeStackNavigator();

const HealthFlowNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="AgeScreen"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="AgeScreen" 
        component={AgeScreen}
      />
      <Stack.Screen 
        name="BodyMetricsScreen" 
        component={BodyMetricsScreen}
      />
      <Stack.Screen 
        name="SleepWater" 
        component={SleepWaterScreen}
      />
      <Stack.Screen 
        name="ActivityLevel" 
        component={ActivityLevelScreen}
      />
      <Stack.Screen 
        name="HealthResults" 
        component={HealthResultsScreen}
      />
    </Stack.Navigator>
  );
};

export default HealthFlowNavigator;