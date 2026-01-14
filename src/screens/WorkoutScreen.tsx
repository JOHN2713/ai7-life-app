// src/screens/WorkoutScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Platform, ActivityIndicator, ScrollView 
} from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors'; 
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS } from '../constants/colors';
import { saveWorkout } from '../services/workoutsService';
import { getActiveGoals } from '../services/goalsService';

type ActivityType = 'caminar' | 'trotar' | 'senderismo' | 'ciclismo';

const ACTIVITIES: { id: ActivityType; label: string; icon: any; allowedUnits: string[] }[] = [
    { id: 'caminar', label: 'Caminar', icon: 'walk', allowedUnits: ['pasos', 'km', 'min'] },
    { id: 'trotar', label: 'Trotar', icon: 'accessibility', allowedUnits: ['pasos', 'km', 'min'] }, 
    { id: 'senderismo', label: 'Senderismo', icon: 'leaf', allowedUnits: ['veces', 'km', 'pasos'] },
    { id: 'ciclismo', label: 'Ciclismo', icon: 'bicycle', allowedUnits: ['km', 'min'] },
];

const haversineDistance = (coords1: any, coords2: any) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; 
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Promedio de pasos por KM (Estándar global)
const STEPS_PER_KM = 1320; 

export default function WorkoutScreen() {
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('caminar');
  const [activeGoals, setActiveGoals] = useState<any[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const [isTracking, setIsTracking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [seconds, setSeconds] = useState(0);
  
  // LÓGICA HÍBRIDA: Guardamos los pasos del sensor por separado
  const [sensorSteps, setSensorSteps] = useState(0);

  const mapRef = useRef<MapView>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const pedometerSubscription = useRef<any>(null);

  // --- CALCULO INTELIGENTE DE PASOS PARA MOSTRAR ---
  // Si el sensor funciona (> 10 pasos), usamos el sensor.
  // Si estamos en simulador o el sensor falla (0 pasos) pero hay distancia, calculamos matemáticamente.
  const getDisplayedSteps = () => {
    if (selectedActivity === 'ciclismo') return 0; // Bici no tiene pasos
    
    // Si el sensor reporta datos reales consistentes, confiamos en él
    if (sensorSteps > 10) return sensorSteps;

    // Si no, usamos la estimación basada en GPS (Backup para simulador)
    return Math.floor(distanceKm * STEPS_PER_KM);
  };

  const displayedSteps = getDisplayedSteps();

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  const loadGoals = async () => {
    const goals = await getActiveGoals();
    setActiveGoals(goals);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      setPermissionGranted(true);
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    })();
    return () => stopSensors(); 
  }, []);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTracking]);

  const startTracking = async () => {
    setHasStarted(true);
    setIsTracking(true);
    
    // 1. GPS
    locationSubscription.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5 },
      (newLocation) => {
        const { latitude, longitude } = newLocation.coords;
        const newPoint = { latitude, longitude };
        
        setRouteCoordinates(prev => {
          if (prev.length > 0) {
            setDistanceKm(d => d + haversineDistance(prev[prev.length - 1], newPoint));
          }
          return [...prev, newPoint];
        });

        mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 500);
      }
    );

    // 2. Podómetro (Sensor Real)
    if (selectedActivity !== 'ciclismo') {
        const isAvailable = await Pedometer.isAvailableAsync();
        if (isAvailable) {
            pedometerSubscription.current = Pedometer.watchStepCount(result => {
                // Solo sumamos eventos reales del hardware
                setSensorSteps(prev => prev + 1); 
            });
        }
    }
  };

  const stopSensors = () => {
    setIsTracking(false);
    if (locationSubscription.current) locationSubscription.current.remove();
    if (pedometerSubscription.current) pedometerSubscription.current.remove();
  };

  const handlePause = () => stopSensors();

  const handleFinish = () => {
    Alert.alert("¿Terminar entrenamiento?", `Distancia: ${distanceKm.toFixed(2)} km\nPasos: ${displayedSteps}`, [
      { text: "Seguir", style: "cancel" },
      { text: "Guardar", onPress: saveAndExit }
    ]);
  };

  const handleDiscard = () => {
      Alert.alert("¿Descartar?", "Se borrarán los datos.", [
          { text: "Cancelar", style: "cancel"},
          { text: "Borrar", style: 'destructive', onPress: resetState }
      ]);
  }

  const saveAndExit = async () => {
    setIsSaving(true);
    stopSensors(); 
    
    // ENVIAMOS 'displayedSteps' (el valor corregido/híbrido)
    const result = await saveWorkout(distanceKm, seconds, routeCoordinates, displayedSteps, selectedGoalId || undefined); 
    
    setIsSaving(false);
    if (result.success) {
        Alert.alert("¡Guardado!", selectedGoalId ? "Tu reto se ha actualizado." : "Entrenamiento registrado.");
        resetState();
    }
  };

  const resetState = () => {
      stopSensors();
      setHasStarted(false);
      setRouteCoordinates([]);
      setDistanceKm(0);
      setSeconds(0);
      setSensorSteps(0); // Reiniciar sensor
      setSelectedGoalId(null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!permissionGranted) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  const currentActivityConfig = ACTIVITIES.find(a => a.id === selectedActivity);
  const compatibleGoals = activeGoals.filter(g => currentActivityConfig?.allowedUnits.includes(g.unit));

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        showsUserLocation
        followsUserLocation={isTracking}
        initialRegion={{
            latitude: currentLocation?.latitude || -0.1807,
            longitude: currentLocation?.longitude || -78.4678,
            latitudeDelta: 0.01, longitudeDelta: 0.01
        }}
      >
        <Polyline coordinates={routeCoordinates} strokeColor={COLORS.primary} strokeWidth={6} />
      </MapView>

      <SafeAreaView style={styles.controlPanel} edges={['bottom']}>
        <View style={styles.dragHandle} />

        {/* SETUP */}
        {!hasStarted && (
            <View>
                <Text style={styles.sectionTitle}>1. Elige actividad</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 15}}>
                    {ACTIVITIES.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={[
                                styles.activityChip, 
                                selectedActivity === item.id && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                            ]}
                            onPress={() => {
                                setSelectedActivity(item.id);
                                setSelectedGoalId(null);
                            }}
                        >
                            <Ionicons name={item.icon} size={20} color={selectedActivity === item.id ? 'white' : '#888'} />
                            <Text style={[styles.chipText, selectedActivity === item.id && { color: 'white' }]}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.sectionTitle}>2. ¿Aplicar a un reto?</Text>
                {compatibleGoals.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 20}}>
                        <TouchableOpacity 
                            style={[styles.goalChip, selectedGoalId === null && { backgroundColor: '#333' }]}
                            onPress={() => setSelectedGoalId(null)}
                        >
                            <Text style={{color: 'white', fontSize: 12}}>Solo Entrenar</Text>
                        </TouchableOpacity>

                        {compatibleGoals.map((goal) => (
                            <TouchableOpacity 
                                key={goal.id} 
                                style={[
                                    styles.goalChip, 
                                    { backgroundColor: 'white', borderColor: goal.color },
                                    selectedGoalId === goal.id && { backgroundColor: goal.color }
                                ]}
                                onPress={() => setSelectedGoalId(goal.id)}
                            >
                                <Ionicons name={goal.icon} size={16} color={selectedGoalId === goal.id ? 'white' : goal.color} />
                                <Text style={[styles.goalChipText, { color: selectedGoalId === goal.id ? 'white' : '#333' }]}>
                                    {goal.goalName || goal.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={{color: '#999', fontSize: 12, marginBottom: 20}}>No hay retos disponibles.</Text>
                )}
            </View>
        )}

        {/* METRICS */}
        <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>DISTANCIA</Text>
                <Text style={styles.metricValue}>{distanceKm.toFixed(2)}<Text style={styles.unit}>KM</Text></Text>
            </View>
            <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>TIEMPO</Text>
                <Text style={styles.metricValue}>{formatTime(seconds)}</Text>
            </View>
            {selectedActivity !== 'ciclismo' && (
                <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>PASOS</Text>
                    {/* AQUÍ MOSTRAMOS EL VALOR CORREGIDO */}
                    <Text style={styles.metricValue}>{displayedSteps}</Text> 
                </View>
            )}
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonsContainer}>
            {!hasStarted && (
                <TouchableOpacity style={styles.mainButton} onPress={startTracking}>
                    <Ionicons name="play" size={24} color="white" style={{marginRight:10}}/>
                    <Text style={styles.buttonText}>{selectedGoalId ? "Iniciar Reto" : "Iniciar Libre"}</Text>
                </TouchableOpacity>
            )}

            {hasStarted && isTracking && (
                <TouchableOpacity style={[styles.mainButton, { backgroundColor: COLORS.secondaryOrange }]} onPress={handlePause}>
                    <Ionicons name="pause" size={24} color="white" style={{marginRight:10}}/>
                    <Text style={styles.buttonText}>Pausar</Text>
                </TouchableOpacity>
            )}

            {hasStarted && !isTracking && (
                <View style={{flexDirection: 'row', flex: 1, gap: 15}}>
                    <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#EB5757', flex: 1 }]} onPress={handleFinish} disabled={isSaving}>
                         {isSaving ? <ActivityIndicator color="white"/> : (
                             <><Ionicons name="stop" size={24} color="white" style={{marginRight:5}}/><Text style={styles.buttonText}>Terminar</Text></>
                         )}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mainButton, { flex: 1 }]} onPress={startTracking} disabled={isSaving}>
                        <Ionicons name="play" size={24} color="white" style={{marginRight:5}}/>
                        <Text style={styles.buttonText}>Reanudar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
        
        {hasStarted && !isTracking && !isSaving && (
            <TouchableOpacity style={{alignSelf: 'center', marginTop: 15}} onPress={handleDiscard}>
                <Text style={{color: '#999', textDecorationLine: 'underline', fontSize: 13}}>Descartar sesión</Text>
            </TouchableOpacity>
        )}

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height, zIndex: 0 },
  controlPanel: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white',
    borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24,
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, elevation: 20,
  },
  dragHandle: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#BBB', marginBottom: 8, textTransform: 'uppercase' },
  
  activityChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#EEE', marginRight: 10, backgroundColor: '#F9F9F9' },
  chipText: { marginLeft: 8, fontWeight: '600', color: '#555', fontSize: 13 },
  goalChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, marginRight: 10, backgroundColor: '#333' },
  goalChipText: { marginLeft: 6, fontWeight: '600', fontSize: 12 },

  metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, marginTop: 5 },
  metricItem: { alignItems: 'center', flex: 1 },
  metricLabel: { fontSize: 11, fontWeight: 'bold', color: '#BBB', letterSpacing: 1 },
  metricValue: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 4 },
  unit: { fontSize: 12, fontWeight: 'normal', color: '#888' },

  buttonsContainer: { flexDirection: 'row', alignItems: 'center' },
  mainButton: { backgroundColor: COLORS.primary, height: 60, borderRadius: 30, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, elevation: 5 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});