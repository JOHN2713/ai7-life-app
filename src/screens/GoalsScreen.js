import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, Dimensions, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { goalsAPI } from '../services/api';

const { width } = Dimensions.get('window');

// Iconos para las metas
const GOAL_ICONS = {
  water: 'water',
  walk: 'walk',
  fitness: 'fitness',
  book: 'book',
  tooth: 'fitness-outline',
  meditation: 'flower',
  study: 'school',
  sleep: 'moon',
  default: 'flag',
};

export default function GoalsScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar metas al montar el componente y al volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  const loadGoals = async () => {
    try {
      setLoading(true);
      console.log('Cargando metas...');
      const response = await goalsAPI.getUserGoals(true); // Solo activas
      console.log('Metas recibidas:', response);
      console.log('Cantidad de metas:', response.goals?.length || 0);
      setGoals(response.goals || []);
    } catch (error) {
      console.error('Error al cargar metas:', error);
      console.error('Error completo:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.error || 'No se pudieron cargar las metas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  };

  const handleCompleteGoal = async (goalId) => {
    try {
      await goalsAPI.completeGoal(goalId);
      loadGoals(); // Recargar metas
    } catch (error) {
      Alert.alert('Error', 'No se pudo marcar la meta como completada');
    }
  };

  const handleCreateGoal = () => {
    navigation.navigate('CreateGoal');
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Una meta a la vez</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateGoal}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {goals.length === 0 ? (
        // Estado vacío
        <View style={styles.content}>
          <View style={styles.emptyState}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/images/calendario.png')}
                style={styles.emptyImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.emptyTitle}>Tú no tienes aún una meta</Text>
            <Text style={styles.emptyDescription}>
              Puedes programar una meta individual o grupal
            </Text>

            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreateGoal}
            >
              <Text style={styles.createButtonText}>Crear una meta</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Lista de metas
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
        >
          <View style={styles.goalsList}>
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={styles.goalCard}
                onPress={() => navigation.navigate('GoalDetail', { goalId: goal.id })}
                activeOpacity={0.7}
              >
                <View style={styles.goalHeader}>
                  <View style={[styles.goalIconContainer, { backgroundColor: goal.color + '20' }]}>
                    <Ionicons
                      name={GOAL_ICONS[goal.icon] || 'flag'}
                      size={28}
                      color={goal.color}
                    />
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalTitle}>{goal.name}</Text>
                    <Text style={styles.goalDuration}>
                      {goal.duration_days} días • {goal.progress}% completado
                    </Text>
                  </View>
                </View>

                {/* Barra de progreso */}
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { width: `${goal.progress}%`, backgroundColor: goal.color }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {goal.total_completed_days}/{goal.total_days} días
                  </Text>
                </View>

                {/* Botón de completar hoy */}
                <TouchableOpacity
                  style={[styles.completeButton, { backgroundColor: goal.color }]}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleCompleteGoal(goal.id);
                  }}
                >
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                  <Text style={styles.completeButtonText}>Completar hoy</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    color: COLORS.black,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  scrollContent: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    marginBottom: 40,
  },
  emptyImage: {
    width: width * 0.5,
    height: width * 0.5,
    maxWidth: 200,
    maxHeight: 200,
  },
  emptyTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyDescription: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.white,
  },
  goalsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  goalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 4,
  },
  goalDuration: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: COLORS.gray,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'right',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  completeButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
});
