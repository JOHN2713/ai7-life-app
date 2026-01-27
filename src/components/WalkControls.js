// src/components/WalkControls.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function WalkControls({ 
  isTracking, 
  isPaused, 
  onPause, 
  onFinish 
}) {
  if (!isTracking) {
    return (
      <View style={styles.container}>
        <View style={styles.notTrackingContainer}>
          <Text style={styles.notTrackingText}>
            Iniciando seguimiento...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.controlsRow}>
        {/* Botón de pausa/reanudar */}
        <TouchableOpacity
          style={[styles.controlButton, styles.pauseButton]}
          onPress={onPause}
          disabled={!isTracking}
        >
          <Ionicons 
            name={isPaused ? 'play' : 'pause'} 
            size={28} 
            color={COLORS.white} 
          />
          <Text style={styles.controlButtonText}>
            {isPaused ? 'Reanudar' : 'Pausar'}
          </Text>
        </TouchableOpacity>
        
        {/* Botón de finalizar */}
        <TouchableOpacity
          style={[styles.controlButton, styles.finishButton]}
          onPress={onFinish}
        >
          <Ionicons name="flag" size={28} color={COLORS.white} />
          <Text style={styles.controlButtonText}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
  },
  notTrackingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  notTrackingText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: COLORS.gray,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  finishButton: {
    backgroundColor: '#4CAF50',
  },
  controlButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.white,
  },
});