// src/services/walkTrackerService.js
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  calculateDistance, 
  filterGPSPoints, 
  calculateCalories,
  formatTime,
  formatDistance 
} from './locationUtils';
import { walkAPI } from './walkApiService';
import { authAPI } from './api';

const BACKGROUND_TASK = 'BACKGROUND_WALK_TRACKING';

// Definir tarea en background
TaskManager.defineTask(BACKGROUND_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Error en background task:', error);
    return;
  }
  
  if (data && data.locations) {
    const location = data.locations[0];
    if (location) {
      // Guardar para que el hook lo recoja
      await AsyncStorage.setItem(
        '@ai7life:last_location',
        JSON.stringify({
          coords: location.coords,
          timestamp: location.timestamp || Date.now()
        })
      );
    }
  }
});

export const useWalkTracker = (goalId = null) => {
  // Estados principales
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  // Datos de la caminata
  const [walkData, setWalkData] = useState({
    startTime: null,
    endTime: null,
    duration: 0, // segundos
    steps: 0,
    distance: 0, // km
    calories: 0, // kcal
    route: [], // {latitude, longitude, timestamp, accuracy}
    averageSpeed: 0,
    pauseCount: 0,
    goal_id: goalId,
    currentSpeed: 0,
  });

  // Refs
  const intervalRef = useRef(null);
  const lastPositionRef = useRef(null);
  const stepCountRef = useRef(0);
  const lastStepTimeRef = useRef(Date.now());
  const [userWeight, setUserWeight] = useState(70);

  // Inicializar - Obtener peso y permisos
  useEffect(() => {
    const initialize = async () => {
      try {
        // Obtener peso del usuario
        const user = await authAPI.getStoredUser();
        if (user?.weight) setUserWeight(user.weight);
        
        // Verificar permisos
        const { status } = await Location.getForegroundPermissionsAsync();
        setPermissionGranted(status === 'granted');
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error inicializando tracker:', error);
      }
    };
    
    initialize();
    
    // Verificar ubicaciones guardadas cada segundo
    const locationInterval = setInterval(checkForNewLocation, 1000);
    
    return () => {
      clearInterval(locationInterval);
      stopTracking();
    };
  }, []);

  // Verificar nuevas ubicaciones desde background
  const checkForNewLocation = async () => {
    if (!isTracking || isPaused) return;
    
    try {
      const locationStr = await AsyncStorage.getItem('@ai7life:last_location');
      if (locationStr) {
        const location = JSON.parse(locationStr);
        updateRoute(location);
        await AsyncStorage.removeItem('@ai7life:last_location');
      }
    } catch (error) {
      console.error('Error leyendo ubicación:', error);
    }
  };

  // Solicitar permisos
  const requestPermissions = async () => {
    try {
      // Permisos foreground
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permisos de ubicación denegados');
      }

      // Permisos background (iOS)
      if (Platform.OS === 'ios') {
        const bgStatus = await Location.requestBackgroundPermissionsAsync();
        if (bgStatus.status !== 'granted') {
          console.warn('Permisos background no concedidos, tracking limitado');
        }
      }

      setPermissionGranted(true);
      return true;
    } catch (error) {
      console.error('Error en permisos:', error);
      return false;
    }
  };

  // INICIAR SEGUIMIENTO
  const startWalk = async () => {
    try {
      // 1. Verificar permisos
      if (!permissionGranted) {
        const granted = await requestPermissions();
        if (!granted) throw new Error('Se necesitan permisos de ubicación');
      }

      // 2. Iniciar actualizaciones de ubicación
      await Location.startLocationUpdatesAsync(BACKGROUND_TASK, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 5, // Metros
        timeInterval: 3000, // 3 segundos
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'AI7 Life - Rastreando caminata',
          notificationBody: 'Tu actividad está siendo registrada',
          notificationColor: '#4CAF50',
        },
        deferredUpdatesInterval: 0,
      });

      // 3. Configurar acelerómetro para pasos
      Accelerometer.setUpdateInterval(500); // 0.5 segundos
      Accelerometer.addListener(({ x, y, z }) => {
        if (!isPaused && isTracking) {
          const acceleration = Math.sqrt(x * x + y * y + z * z);
          const now = Date.now();
          
          // Detección de paso mejorada
          if (acceleration > 1.15 && acceleration < 2.5 && 
              (now - lastStepTimeRef.current) > 300) { // Mínimo 300ms entre pasos
            stepCountRef.current += 1;
            lastStepTimeRef.current = now;
            
            setWalkData(prev => ({ 
              ...prev, 
              steps: stepCountRef.current 
            }));
          }
        }
      });

      // 4. Iniciar estados
      setIsTracking(true);
      setIsPaused(false);
      const startTime = new Date();
      
      setWalkData({
        startTime,
        endTime: null,
        duration: 0,
        steps: 0,
        distance: 0,
        calories: 0,
        route: [],
        averageSpeed: 0,
        pauseCount: 0,
        goal_id: goalId,
        currentSpeed: 0,
      });
      
      stepCountRef.current = 0;
      lastPositionRef.current = null;

      // 5. Iniciar cronómetro
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setWalkData(prev => {
            const newDuration = prev.duration + 1;
            
            // Calcular velocidad actual
            let currentSpeed = 0;
            if (prev.distance > 0 && newDuration > 0) {
              const hours = newDuration / 3600;
              currentSpeed = prev.distance / hours;
            }
            
            return { 
              ...prev, 
              duration: newDuration,
              currentSpeed: parseFloat(currentSpeed.toFixed(1))
            };
          });
          
          // Actualizar calorías
          updateCalories();
        }
      }, 1000);

      return { success: true, startTime };
    } catch (error) {
      console.error('Error al iniciar caminata:', error);
      return { success: false, error: error.message };
    }
  };

  // PAUSAR/REANUDAR
  const togglePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    
    if (newPausedState) {
      // Si se pausa
      setWalkData(prev => ({ 
        ...prev, 
        pauseCount: prev.pauseCount + 1 
      }));
    }
  };

  // ACTUALIZAR RUTA
  const updateRoute = (location) => {
    if (!location || isPaused) return;
    
    const newPoint = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: location.timestamp || Date.now(),
      accuracy: location.coords.accuracy
    };
    
    setWalkData(prev => {
      const newRoute = [...prev.route, newPoint];
      let newDistance = prev.distance;
      
      // Calcular distancia incremental
      if (lastPositionRef.current) {
        const segmentDistance = calculateDistance(lastPositionRef.current, newPoint);
        // Filtrar ruido GPS (máximo 100m entre puntos)
        if (segmentDistance < 0.1 && segmentDistance > 0.0001) {
          newDistance += segmentDistance;
        }
      }
      
      lastPositionRef.current = newPoint;
      
      // Calcular velocidad promedio
      const hours = prev.duration / 3600;
      const avgSpeed = newDistance > 0 && hours > 0 ? newDistance / hours : 0;
      
      return { 
        ...prev, 
        route: newRoute, 
        distance: newDistance,
        averageSpeed: parseFloat(avgSpeed.toFixed(1))
      };
    });
  };

  // ACTUALIZAR CALORÍAS
  const updateCalories = useCallback(() => {
    const hours = walkData.duration / 3600;
    const speed = walkData.distance > 0 ? 
      (walkData.distance / hours) : 5;
    
    const calories = calculateCalories(userWeight, hours, speed);
    setWalkData(prev => ({ ...prev, calories: Math.round(calories) }));
  }, [walkData.duration, walkData.distance, userWeight]);

  // FINALIZAR CAMINATA
  const finishWalk = async () => {
    try {
      // 1. Detener todo
      clearInterval(intervalRef.current);
      await Location.stopLocationUpdatesAsync(BACKGROUND_TASK);
      Accelerometer.removeAllListeners();
      
      // 2. Calcular métricas finales
      const endTime = new Date();
      const durationMinutes = Math.floor(walkData.duration / 60);
      const avgSpeed = walkData.distance > 0 && walkData.duration > 0 ?
        (walkData.distance / (walkData.duration / 3600)) : 0;
      
      const finalData = {
        ...walkData,
        endTime,
        duration_minutes: durationMinutes,
        distance_km: parseFloat(walkData.distance.toFixed(3)),
        steps: walkData.steps,
        calories_burned: Math.round(walkData.calories),
        average_speed: parseFloat(avgSpeed.toFixed(2)),
        pause_count: walkData.pauseCount,
        route: filterGPSPoints(walkData.route), // Filtrar puntos erróneos
        goal_id: goalId,
        completed_at: endTime.toISOString()
      };
      
      // 3. Guardar
      let savedRemotely = false;
      try {
        await walkAPI.saveWalkActivity(finalData);
        savedRemotely = true;
        console.log('✅ Caminata guardada en backend');
      } catch (backendError) {
        console.log('📱 Guardando localmente...');
        await walkAPI.saveWalkLocally(finalData);
      }
      
      // 4. Resetear estado
      setIsTracking(false);
      setIsPaused(false);
      
      return {
        success: true,
        data: finalData,
        savedRemotely,
        formatted: {
          duration: formatTime(finalData.duration_minutes * 60),
          distance: formatDistance(finalData.distance_km),
          steps: finalData.steps.toLocaleString(),
          calories: Math.round(finalData.calories_burned),
          speed: `${finalData.average_speed} km/h`
        }
      };
    } catch (error) {
      console.error('Error al finalizar caminata:', error);
      return { success: false, error: error.message };
    }
  };

  // DETENER SEGUIMIENTO (sin guardar)
  const stopTracking = async () => {
    clearInterval(intervalRef.current);
    try {
      await Location.stopLocationUpdatesAsync(BACKGROUND_TASK);
      Accelerometer.removeAllListeners();
    } catch (error) {
      console.error('Error deteniendo tracking:', error);
    }
    setIsTracking(false);
    setIsPaused(false);
  };

  // OBTENER DATOS FORMATEADOS PARA UI
  const getFormattedData = () => {
    return {
      duration: formatTime(walkData.duration),
      distance: formatDistance(walkData.distance),
      steps: walkData.steps.toLocaleString(),
      calories: Math.round(walkData.calories),
      speed: `${walkData.currentSpeed} km/h`,
      isTracking,
      isPaused
    };
  };

  return {
    // Estados
    isTracking,
    isPaused,
    isInitialized,
    permissionGranted,
    
    // Datos
    walkData,
    formattedData: getFormattedData(),
    userWeight,
    
    // Funciones
    startWalk,
    togglePause,
    finishWalk,
    stopTracking,
    updateRoute,
    requestPermissions,
    
    // Utilidades
    hasRoute: walkData.route.length > 0,
    isActive: isTracking && !isPaused,
  };
};

export default useWalkTracker;