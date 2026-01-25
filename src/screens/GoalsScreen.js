import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

export default function GoalsScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  // Metas del usuario (temporal)
  const goals = []; // Si está vacío, muestra el estado vacío

  if (!fontsLoaded) {
    return null;
  }

  const handleCreateGoal = () => {
    // Navegar a la pantalla de crear meta
    console.log('Crear meta');
    // TODO: Implementar navegación a CrearGoalScreen cuando exista
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Una meta a la vez</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleCreateGoal}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {goals.length === 0 ? (
          // Estado vacío
          <View style={styles.emptyState}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/images/calendario.png')}
                style={styles.emptyImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.emptyTitle}>Tu no tienes aún una meta</Text>
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
        ) : (
          // Lista de metas (cuando haya)
          <View style={styles.goalsList}>
            {goals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: '100%',
    paddingHorizontal: 20,
  },
  goalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: COLORS.black,
  },
});
