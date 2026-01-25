import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function HealthResults({ route, navigation }) {
  // Recibimos los resultados que pasamos desde el Home
  const { results } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tu Reporte de Salud</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tarjeta de Puntuación General */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Estado General</Text>
          <Text style={styles.scoreValue}>¡Excelente!</Text>
          <Ionicons name="checkmark-circle" size={80} color={COLORS.white} />
        </View>

        {/* Detalle de Resultados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del Check</Text>
          
          <View style={styles.dataBox}>
            <View style={styles.dataItem}>
              <Ionicons name="heart" size={24} color="#FF6B6B" />
              <Text style={styles.dataText}>Ritmo Cardíaco: Normal</Text>
            </View>
            <View style={styles.dataItem}>
              <Ionicons name="water" size={24} color="#54A0FF" />
              <Text style={styles.dataText}>Hidratación: 85%</Text>
            </View>
            <View style={styles.dataItem}>
              <Ionicons name="fitness" size={24} color="#1DD1A1" />
              <Text style={styles.dataText}>Actividad Física: Activa</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.recheckButton}
          onPress={() => navigation.navigate('HealthFlow')}
        >
          <Text style={styles.recheckText}>Repetir Evaluación</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontFamily: 'Manrope_700Bold' },
  scrollContent: { padding: 20 },
  scoreCard: { backgroundColor: COLORS.primary, borderRadius: 25, padding: 30, alignItems: 'center', marginBottom: 25 },
  scoreLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  scoreValue: { color: '#FFF', fontSize: 32, fontFamily: 'Manrope_700Bold', marginVertical: 10 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontFamily: 'Manrope_700Bold', marginBottom: 15 },
  dataBox: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 2 },
  dataItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  dataText: { marginLeft: 15, fontSize: 16, color: '#333' },
  recheckButton: { backgroundColor: '#FFF', borderWidth: 2, borderColor: COLORS.primary, borderRadius: 15, padding: 15, alignItems: 'center', marginTop: 10 },
  recheckText: { color: COLORS.primary, fontFamily: 'Manrope_700Bold' }
});