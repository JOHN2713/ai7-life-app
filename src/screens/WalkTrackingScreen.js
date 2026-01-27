// src/screens/WalkTrackingScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  BackHandler,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import useWalkTracker from '../services/walkTrackerService';
import WalkStats from '../components/WalkStats';
import WalkMap from '../components/WalkMap';
import WalkControls from '../components/WalkControls';

export default function WalkTrackingScreen({ route, navigation }) {
  const { goalId, goalName } = route.params || {};
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  // Usar nuestro hook de tracking
  const {
    isTracking,
    isPaused,
    isInitialized,
    permissionGranted,
    walkData,
    formattedData,
    startWalk,
    togglePause,
    finishWalk,
    stopTracking,
    requestPermissions,
    hasRoute,
    isActive,
  } = useWalkTracker(goalId);

  // Iniciar automáticamente al entrar
  useEffect(() => {
    const startTracking = async () => {
      if (!isTracking && isInitialized) {
        const result = await startWalk();
        if (!result.success) {
          Alert.alert('Error', result.error || 'No se pudo iniciar el tracking');
        }
      }
    };
    
    startTracking();
  }, [isInitialized]);

  // Manejar botón de retroceso
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isTracking) {
          Alert.alert(
            'Caminata en progreso',
            '¿Estás seguro de que quieres salir? Se perderán los datos no guardados.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { 
                text: 'Salir', 
                style: 'destructive',
                onPress: () => {
                  stopTracking();
                  navigation.goBack();
                }
              }
            ]
          );
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isTracking, navigation])
  );

  // Finalizar caminata
  const handleFinish = async () => {
    Alert.alert(
      'Finalizar caminata',
      '¿Estás seguro de que quieres finalizar la caminata?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Finalizar', 
          onPress: async () => {
            const result = await finishWalk();
            if (result.success) {
              setSummaryData(result);
              setShowSummary(true);
            } else {
              Alert.alert('Error', result.error || 'Error al finalizar');
            }
          }
        }
      ]
    );
  };

  // Si no hay permisos
  if (!permissionGranted && isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        
        <View style={styles.permissionContainer}>
          <Ionicons name="location-outline" size={80} color={COLORS.gray} />
          <Text style={styles.permissionTitle}>Permisos necesarios</Text>
          <Text style={styles.permissionText}>
            Para rastrear tu caminata necesitamos acceso a tu ubicación.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermissions}
          >
            <Text style={styles.permissionButtonText}>Conceder permisos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Pantalla principal
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (isTracking) {
              Alert.alert(
                'Caminata en progreso',
                '¿Estás seguro de que quieres salir?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: 'Salir', 
                    onPress: () => {
                      stopTracking();
                      navigation.goBack();
                    }
                  }
                ]
              );
            } else {
              navigation.goBack();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {goalName || 'Caminata'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isActive ? 'En progreso' : isPaused ? 'Pausada' : 'Preparando...'}
          </Text>
        </View>
        
        <View style={styles.headerRight} />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {/* Estadísticas */}
        <WalkStats 
          duration={formattedData.duration}
          steps={formattedData.steps}
          distance={formattedData.distance}
          calories={formattedData.calories}
          speed={formattedData.speed}
          isPaused={isPaused}
        />
        
        {/* Mapa */}
        <View style={styles.mapContainer}>
          <WalkMap 
            route={walkData.route}
            isTracking={isTracking}
            isPaused={isPaused}
          />
          
          {!hasRoute && isTracking && (
            <View style={styles.mapOverlay}>
              <Text style={styles.mapOverlayText}>
                Esperando señal GPS...
              </Text>
            </View>
          )}
        </View>
        
        {/* Controles */}
        <WalkControls 
          isTracking={isTracking}
          isPaused={isPaused}
          onPause={togglePause}
          onFinish={handleFinish}
        />
        
        {/* Indicadores */}
        <View style={styles.indicators}>
          <View style={styles.indicator}>
            <View style={[styles.indicatorDot, { 
              backgroundColor: isActive ? '#4CAF50' : isPaused ? '#FF9800' : '#9E9E9E' 
            }]} />
            <Text style={styles.indicatorText}>
              {isActive ? 'Activo' : isPaused ? 'Pausado' : 'Inactivo'}
            </Text>
          </View>
          
          {walkData.route.length > 0 && (
            <View style={styles.indicator}>
              <Ionicons name="location" size={16} color="#2196F3" />
              <Text style={styles.indicatorText}>
                {walkData.route.length} puntos
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  permissionTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    color: COLORS.black,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  permissionButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: COLORS.black,
  },
  headerSubtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: COLORS.gray,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  indicatorText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
  },
});