// src/screens/HomeScreen.tsx
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg'; // <--- IMPORTANTE: Gráficos
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../constants/colors';
import { getActiveGoals, updateGoalProgress } from '../services/goalsService';

const { width } = Dimensions.get('window');

// --- COMPONENTE: ANILLO DE PROGRESO (SVG) ---
const ActivityRing = ({ radius, stroke, color, progress, icon }: any) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
  
    return (
      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
        <Svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
          <G rotation="-90" origin={`${radius}, ${radius}`}>
             {/* Fondo del anillo (Gris clarito) */}
            <Circle
              stroke={color}
              strokeWidth={stroke}
              strokeOpacity={0.2}
              fill="transparent"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progreso del anillo (Color vivo) */}
            <Circle
              stroke={color}
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </G>
        </Svg>
        {/* Icono central (solo para el anillo más pequeño o decorativo) */}
        {icon && <Ionicons name={icon} size={20} color={color} style={{position: 'absolute'}} />}
      </View>
    );
};

// --- COMPONENTE: GRÁFICO DE BARRAS SEMANAL ---
const WeeklyChart = () => {
    // Datos simulados (Mock) - Luego podrías conectarlos a Firebase
    const data = [40, 60, 30, 80, 50, 90, 20]; 
    const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const maxVal = 100;

    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Tendencia</Text>
                <Text style={styles.chartSubtitle}>Últimos 7 días</Text>
            </View>
            <View style={styles.barsRow}>
                {data.map((value, index) => (
                    <View key={index} style={styles.barWrapper}>
                        <View style={styles.barTrack}>
                            <View 
                                style={[
                                    styles.barFill, 
                                    { height: `${value}%`, backgroundColor: value > 80 ? COLORS.primary : '#D1D5DB' }
                                ]} 
                            />
                        </View>
                        <Text style={styles.dayLabel}>{days[index]}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Totales para los anillos
  const [totalSteps, setTotalSteps] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

  const loadData = async () => {
    setLoading(true);
    const data = await getActiveGoals();
    setGoals(data);
    
    // Calcular totales simples basados en las metas (Esto es visual)
    let steps = 0;
    data.forEach(g => {
        if(g.unit === 'pasos') steps += g.progress || 0;
    });
    setTotalSteps(steps);
    // Calorias estimadas (ejemplo visual)
    setTotalCalories(Math.round(steps * 0.04)); 

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleAddProgress = async (id: string, unit: string) => {
    let step = 1;
    if (unit === 'min') step = 5;
    setGoals(prev => prev.map(g => g.id === id ? { ...g, progress: (g.progress || 0) + step } : g));
    await updateGoalProgress(id, step);
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
        {/* Top Bar */}
        <View style={styles.topBar}>
            
            <Image 
                source={{ uri: 'https://ui-avatars.com/api/?name=Jimmy&background=20A57F&color=fff' }} 
                style={styles.avatar} 
            />
        </View>

        {/* HERO SECTION: ANILLOS */}
        <View style={styles.heroCard}>
            <View style={styles.ringsContainer}>
                {/* Anillo Exterior (Pasos) */}
                <ActivityRing radius={70} stroke={12} color={COLORS.primary} progress={Math.min((totalSteps / 10000)*100, 100)} />
                {/* Anillo Medio (Calorías) */}
                <ActivityRing radius={50} stroke={12} color={COLORS.secondaryOrange} progress={65} /> 
                {/* Anillo Interior (Minutos) */}
                <ActivityRing radius={30} stroke={12} color="#56CCF2" progress={40} icon="flash" />
            </View>

            <View style={styles.statsColumn}>
                <Text style={styles.heroTitle}>Actividad Diaria</Text>
                
                <View style={styles.statRow}>
                    <View style={[styles.dot, {backgroundColor: COLORS.primary}]} />
                    <Text style={styles.statLabel}>Pasos</Text>
                    <Text style={styles.statValue}>{totalSteps} <Text style={styles.statUnit}>/ 10k</Text></Text>
                </View>
                <View style={styles.statRow}>
                    <View style={[styles.dot, {backgroundColor: COLORS.secondaryOrange}]} />
                    <Text style={styles.statLabel}>Calorías</Text>
                    <Text style={styles.statValue}>{totalCalories} <Text style={styles.statUnit}>kcal</Text></Text>
                </View>
                <View style={styles.statRow}>
                    <View style={[styles.dot, {backgroundColor: '#56CCF2'}]} />
                    <Text style={styles.statLabel}>Tiempo</Text>
                    <Text style={styles.statValue}>45 <Text style={styles.statUnit}>min</Text></Text>
                </View>
            </View>
        </View>

        {/* GRÁFICO SEMANAL */}
        <WeeklyChart />

        <Text style={styles.sectionHeader}>Mis Retos Activos</Text>
    </View>
  );

  const renderGoalItem = ({ item }: any) => {
    const progress = item.progress || 0;
    const percentage = Math.min((progress / item.targetValue) * 100, 100);
    const isCompleted = progress >= item.targetValue;
    const isAuto = ['pasos', 'km'].includes(item.unit);

    return (
      <View style={styles.goalCard}>
        <View style={styles.cardLeft}>
            <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
        </View>
        
        <View style={styles.cardCenter}>
            <Text style={styles.goalTitle}>{item.title}</Text>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: item.color }]} />
            </View>
            <Text style={styles.goalProgressText}>
                {progress}/{item.targetValue} {item.unit}
            </Text>
        </View>

        <View style={styles.cardRight}>
            {!isCompleted ? (
                isAuto ? (
                    <TouchableOpacity style={styles.btnAuto} onPress={() => navigation.navigate('Entrenar')}>
                         <Ionicons name="arrow-forward" size={18} color="#999" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.btnAdd, {backgroundColor: item.color}]} onPress={() => handleAddProgress(item.id, item.unit)}>
                         <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                )
            ) : (
                <Ionicons name="checkmark-circle" size={28} color={COLORS.success} />
            )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={renderGoalItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} colors={[COLORS.primary]} />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>Sin retos activos</Text> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' }, // Fondo gris premium

  // HEADER
  headerSection: { marginBottom: 10, paddingTop: 10 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  date: { fontSize: 13, color: '#888', textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'white' },

  // HERO CARD (ANILLOS)
  heroCard: {
      backgroundColor: 'white', borderRadius: 24, padding: 20, flexDirection: 'row',
      shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.06, shadowRadius: 10, elevation: 4,
      marginBottom: 20, alignItems: 'center'
  },
  ringsContainer: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center' },
  
  statsColumn: { flex: 1, paddingLeft: 20 },
  heroTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statLabel: { fontSize: 12, color: '#888', width: 60 },
  statValue: { fontSize: 14, fontWeight: '700', color: '#333' },
  statUnit: { fontSize: 10, color: '#999', fontWeight: '400' },

  // GRÁFICO SEMANAL
  chartContainer: {
      backgroundColor: 'white', borderRadius: 24, padding: 20, marginBottom: 25,
      shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  chartTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  chartSubtitle: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', height: 100, alignItems: 'flex-end' },
  barWrapper: { alignItems: 'center', width: 20 },
  barTrack: { width: 8, height: '100%', backgroundColor: '#F0F2F5', borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { borderRadius: 4 },
  dayLabel: { marginTop: 8, fontSize: 10, color: '#999', fontWeight: '600' },

  // LISTA DE RETOS
  sectionHeader: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 15 },
  
  goalCard: {
      backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center',
      shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2,
  },
  cardLeft: { marginRight: 15 },
  iconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardCenter: { flex: 1 },
  goalTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 6 },
  progressBarBg: { height: 6, backgroundColor: '#F0F2F5', borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  goalProgressText: { fontSize: 11, color: '#999', fontWeight: '600' },
  
  cardRight: { paddingLeft: 10 },
  btnAdd: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  btnAuto: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },

  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 }
});