// AgeScreenPreview.js (en la raíz o en src/)
import React, { useState } from 'react';
import AgeScreen from './src/screens/AgeScreen';
import BodyMetricsScreen from './src/screens/BodyMetricsScreen';
import SleepWaterScreen from './src/screens/SleepWaterScreen';
import ActivityLevelScreen from './src/screens/ActivityLevelScreen';
import HealthResultsScreen from './src/screens/HealthResultsScreen';



export default function AgeScreenPreview() {
  const [currentScreen, setCurrentScreen] = useState('Age');
  const [screenParams, setScreenParams] = useState({});

  // Navegación mock mejorada
  const mockNavigation = {
    navigate: (screen, params) => {
      console.log(`📱 Navegar a: ${screen}`, params);
      
      if (screen === 'BodyMetricsScreen') {
        setScreenParams(params || {});
        setCurrentScreen('BodyMetrics');
      }
      else if (screen === 'SleepWater') { // NUEVO
        setScreenParams(params || {});
        setCurrentScreen('SleepWater');
      }
      else if (screen === 'ActivityLevel') {
        setScreenParams(params || {});
        setCurrentScreen('ActivityLevel');
      }
      else if (screen === 'HealthResults') { // NUEVO
        setScreenParams(params || {});
        setCurrentScreen('HealthResults');
      }
      /* else if (screen === 'Dashboard') {
        console.log('Navegando al Dashboard principal');
        // Aquí podrías resetear a la primera pantalla si quieres
        // setCurrentScreen('Age');
        // setScreenParams({});
      } */
    },
    goBack: () => {
      if (currentScreen === 'BodyMetrics') {
        setCurrentScreen('Age');
      }
      else if (currentScreen === 'SleepWater') { // NUEVO
        setCurrentScreen('BodyMetrics');
      }
      else if (currentScreen === 'ActivityLevel') {
        setCurrentScreen('SleepWater'); // NUEVO
      }
      else if (currentScreen === 'HealthResults') { // NUEVO
        setCurrentScreen('ActivityLevel');
      }
    }
  };

  // Mock de route para pasar parámetros
  const mockRoute = {
    params: screenParams
  };

  // Renderizar pantalla actual
  if (currentScreen === 'Age') {
    return <AgeScreen navigation={mockNavigation} />;
  } else if (currentScreen === 'BodyMetrics') {
    return <BodyMetricsScreen navigation={mockNavigation} route={mockRoute} />;
  } else if (currentScreen === 'SleepWater') { // NUEVO
    return <SleepWaterScreen navigation={mockNavigation} route={mockRoute} />;
  } else if (currentScreen === 'ActivityLevel') {
    return <ActivityLevelScreen navigation={mockNavigation} route={mockRoute} />;
   } else if (currentScreen === 'HealthResults') { // NUEVO
    return <HealthResultsScreen navigation={mockNavigation} route={mockRoute} />;
  }
}