import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './src/constants/colors';
import { SHADOWS } from './src/constants/spacing';

// Importaremos las pantallas (las crearemos en el siguiente paso)
import HomeScreen from './src/screens/HomeScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';

const Tab = createBottomTabNavigator();

// Tema personalizado para quitar el fondo gris por defecto de React Navigation
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.white,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false as boolean,
          tabBarActiveTintColor: COLORS.white,
          tabBarInactiveTintColor: COLORS.textGray,
          tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            ...SHADOWS.medium,
            height: 80,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'help';
            let backgroundColor = 'transparent';

            if (route.name === 'Resumen') {
              iconName = focused ? 'pie-chart' : 'pie-chart-outline';
              backgroundColor = focused ? COLORS.primary : 'transparent';
            } else if (route.name === 'Entrenar') {
              iconName = focused ? 'location' : 'location-outline';
              backgroundColor = focused ? COLORS.primary : 'transparent';
            } else if (route.name === 'Metas') {
              iconName = focused ? 'trophy' : 'trophy-outline';
              backgroundColor = focused ? COLORS.primary : 'transparent';
            }

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={focused ? COLORS.white : COLORS.textGray}
                style={{
                  backgroundColor,
                  borderRadius: 50,
                  padding: 8,
                  width: 40,
                  height: 40,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Resumen" component={HomeScreen} />
        <Tab.Screen name="Entrenar" component={WorkoutScreen} />
        <Tab.Screen name="Metas" component={GoalsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}