// src/components/WalkStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const StatCard = ({ icon, value, label, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function WalkStats({ 
  duration, 
  steps, 
  distance, 
  calories, 
  speed,
  isPaused 
}) {
  return (
    <View style={[styles.container, isPaused && styles.paused]}>
      <View style={styles.statsGrid}>
        <StatCard 
          icon="time-outline"
          value={duration}
          label="Tiempo"
          color="#2196F3"
        />
        <StatCard 
          icon="footsteps-outline"
          value={steps}
          label="Pasos"
          color="#4CAF50"
        />
        <StatCard 
          icon="location-outline"
          value={distance}
          label="Distancia"
          color="#FF9800"
        />
        <StatCard 
          icon="flame-outline"
          value={calories}
          label="Calorías"
          color="#F44336"
        />
      </View>
      
      {speed && (
        <View style={styles.speedContainer}>
          <Ionicons name="speedometer-outline" size={20} color="#673AB7" />
          <Text style={styles.speedText}>{speed}</Text>
          <Text style={styles.speedLabel}>Velocidad promedio</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  paused: {
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    alignItems: 'center',
    minWidth: 70,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: COLORS.gray,
  },
  speedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  speedText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.black,
  },
  speedLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
  },
});