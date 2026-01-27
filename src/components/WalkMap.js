// src/components/WalkMap.js
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export default function WalkMap({ route, isTracking, isPaused }) {
  const mapRef = useRef(null);

  // Centrar mapa en la última ubicación
  useEffect(() => {
    if (route.length > 0 && mapRef.current && isTracking && !isPaused) {
      const lastPoint = route[route.length - 1];
      mapRef.current.animateToRegion({
        latitude: lastPoint.latitude,
        longitude: lastPoint.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  }, [route, isTracking, isPaused]);

  // Si no hay ruta, mostrar mapa por defecto
  const initialRegion = route.length > 0 
    ? {
        latitude: route[0].latitude,
        longitude: route[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 19.432608,
        longitude: -99.133209,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={isTracking && !isPaused}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={false}
      >
        {/* Dibujar ruta */}
        {route.length > 1 && (
          <Polyline
            coordinates={route}
            strokeColor="#4CAF50"
            strokeWidth={4}
            lineDashPattern={isPaused ? [10, 10] : []}
          />
        )}
        
        {/* Marcador de inicio */}
        {route.length > 0 && (
          <Marker
            coordinate={route[0]}
            title="Inicio"
            pinColor="#4CAF50"
          />
        )}
        
        {/* Marcador actual (si hay ruta) */}
        {route.length > 0 && isTracking && (
          <Marker
            coordinate={route[route.length - 1]}
            title="Ubicación actual"
            description={isPaused ? 'Pausado' : 'En movimiento'}
            pinColor={isPaused ? '#FF9800' : '#2196F3'}
          />
        )}
      </MapView>
      
      {/* Estado overlay */}
      {isPaused && (
        <View style={styles.pausedOverlay}>
          <View style={styles.pausedBadge}>
            <Text style={styles.pausedText}>PAUSADO</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  pausedOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  pausedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pausedText: {
    color: COLORS.white,
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
  },
});