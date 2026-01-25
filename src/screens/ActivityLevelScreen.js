// src/screens/ActivityLevelScreen.js - VERSIÓN CORREGIDA
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { COLORS } from '../constants/colors';

const ActivityLevelScreen = ({ navigation, route }) => {
  // Datos recibidos de pantallas anteriores
  const { age, height, weight, bmi, sleepHours, waterGlasses } = route.params || {};
  
  const [selectedActivity, setSelectedActivity] = useState(null);

  const activityLevels = [
    {
      id: 'sedentario',
      title: 'Sedentario',
      description: 'Poco o nada de ejercicio',
      icon: '🛋️'
    },
    {
      id: 'ligero',
      title: 'Ligeros',
      description: '1-2 días/semana',
      icon: '🚶'
    },
    {
      id: 'moderado',
      title: 'Moderado',
      description: '3-5 días/semana',
      icon: '🏃'
    },
    {
      id: 'activo',
      title: 'Activo',
      description: '6-7 días/semana',
      icon: '💪'
    }
  ];

  const handleContinue = () => {
    if (!selectedActivity) {
      alert('Por favor selecciona tu nivel de actividad');
      return;
    }

    // Preparar TODOS los datos para resultados
    const healthData = {
      age,
      height_cm: height,
      weight_kg: weight,
      bmi: parseFloat(bmi),
      sleep_hours: sleepHours,
      water_glasses: waterGlasses,
      activity_level: selectedActivity,
    };

    // Navegar a resultados finales
    navigation.navigate('HealthResults', healthData);
  };

  const ActivityCard = ({ level, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.activityCard,
        isSelected && styles.activityCardSelected
      ]}
      onPress={() => onPress(level.id)}
      activeOpacity={0.7}
    >
      <View style={styles.activityIconContainer}>
        <Text style={styles.activityIcon}>{level.icon}</Text>
      </View>
      <View style={styles.activityTextContainer}>
        <Text style={[
          styles.activityTitle,
          isSelected && styles.activityTitleSelected
        ]}>
          {level.title}
        </Text>
        <Text style={[
          styles.activityDescription,
          isSelected && styles.activityDescriptionSelected
        ]}>
          {level.description}
        </Text>
      </View>
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedCheck}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check General</Text>
        <Text style={styles.headerTime}>9:41</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Título principal */}
        <View style={styles.titleContainer}>
          <Text style={styles.screenTitle}>Metas #1</Text>
        </View>

        {/* Contenido principal */}
        <View style={styles.contentContainer}>
          <Text style={styles.question}>Nivel de actividad física</Text>
          <Text style={styles.subtitle}>
            ¿Cuánto ejercicios haces por semana?
          </Text>

          {/* Opciones de actividad */}
          <View style={styles.activityContainer}>
            {activityLevels.map((level) => (
              <ActivityCard
                key={level.id}
                level={level}
                isSelected={selectedActivity === level.id}
                onPress={setSelectedActivity}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer con botones */}
      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <TouchableOpacity 
            style={styles.backButtonFooter}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Atrás</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.continueButton,
              !selectedActivity && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!selectedActivity}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    fontSize: 24,
    color: COLORS.black,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  headerTime: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textGray,
    textAlign: 'center',
    marginBottom: 40,
  },
  activityContainer: {
    marginBottom: 30,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activityCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#E8F7F2',
  },
  activityIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityIcon: {
    fontSize: 24,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  activityTitleSelected: {
    color: COLORS.primary,
  },
  activityDescription: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  activityDescriptionSelected: {
    color: '#00AC83',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheck: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButtonFooter: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 18,
    color: COLORS.textGray,
    fontWeight: '600',
  },
  continueButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ActivityLevelScreen;