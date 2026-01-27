import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- IMPORTA TUS PANTALLAS REALES ---
import AgeScreen from '../screens/AgeScreen'; // <--- CORREGIDO: Usamos AgeScreen
import BodyMetricsScreen from '../screens/BodyMetricsScreen';
import SleepWaterScreen from '../screens/SleepWaterScreen';
import ActivityLevelScreen from '../screens/ActivityLevelScreen';
import HealthResults from '../screens/HealthResults';

const Stack = createNativeStackNavigator();

const HealthFlowNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="AgeScreen" // <--- Empezamos aquí
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
        component={HealthResults}
      />
    </Stack.Navigator>
  );
};

export default HealthFlowNavigator;