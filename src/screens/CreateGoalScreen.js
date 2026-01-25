import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';
import { goalsAPI } from '../services/api';

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

export default function CreateGoalScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const [step, setStep] = useState(1); // 1: Sugerencias, 2: Configurar, 3: Resumen
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCustomDaysModal, setShowCustomDaysModal] = useState(false);
  const [customDays, setCustomDays] = useState('');

  // Datos de la meta
  const [goalData, setGoalData] = useState({
    name: '',
    description: '',
    icon: 'default',
    color: COLORS.primary,
    duration_days: 7,
    time_of_day: [],
    frequency: 'daily',
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await goalsAPI.getTemplates();
      setTemplates(response.templates || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las plantillas');
    } finally {
      setLoading(false);
    }
  };

  const selectTemplate = (template) => {
    setGoalData({
      ...goalData,
      name: template.name,
      description: template.description,
      icon: template.icon,
      color: template.color,
      duration_days: template.duration_days,
      time_of_day: template.time_of_day || [],
      frequency: template.frequency,
    });
    setStep(2);
  };

  const handleCreateCustom = () => {
    setGoalData({
      name: '',
      description: '',
      icon: 'default',
      color: COLORS.primary,
      duration_days: 7,
      time_of_day: [],
      frequency: 'daily',
    });
    setStep(2);
  };

  const handleCreateGoal = async () => {
    if (!goalData.name.trim()) {
      Alert.alert('Error', 'Debes ingresar un nombre para la meta');
      return;
    }

    if (goalData.duration_days < 1 || goalData.duration_days > 365) {
      Alert.alert('Error', 'La duración debe ser entre 1 y 365 días');
      return;
    }

    try {
      setCreating(true);
      await goalsAPI.createGoal(goalData);
      Alert.alert('¡Éxito!', 'Meta creada correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.error || 'No se pudo crear la meta');
    } finally {
      setCreating(false);
    }
  };

  const handleCustomDays = () => {
    setShowCustomDaysModal(true);
  };

  const applyCustomDays = () => {
    const days = parseInt(customDays);
    if (isNaN(days) || days < 1 || days > 365) {
      Alert.alert('Error', 'Ingresa un número válido entre 1 y 365');
      return;
    }
    setGoalData({ ...goalData, duration_days: days });
    setShowCustomDaysModal(false);
    setCustomDays('');
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // PASO 1: Sugerencias
  if (step === 1) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear Meta</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Botón Crear Meta personalizada */}
        <View style={styles.topButtonContainer}>
          <TouchableOpacity style={styles.createCustomButton} onPress={handleCreateCustom}>
            <Text style={styles.createCustomText}>+ Crear Meta</Text>
            <View style={styles.createCustomIcon}>
              <Ionicons name="add" size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Sugerencias */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Sugerencias</Text>

          {templates.map((template, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionCard}
              onPress={() => selectTemplate(template)}
            >
              <View style={[styles.suggestionIcon, { backgroundColor: template.color + '20' }]}>
                <Ionicons
                  name={GOAL_ICONS[template.icon] || 'flag'}
                  size={28}
                  color={template.color}
                />
              </View>
              <View style={styles.suggestionInfo}>
                <Text style={styles.suggestionName}>{template.name}</Text>
                <Text style={styles.suggestionMeta}>{template.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // PASO 2: Configurar Meta
  if (step === 2) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear Meta</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '33%' }]} />
          <View style={[styles.progressBar, { width: '33%' }]} />
          <View style={[styles.progressBarInactive, { width: '34%' }]} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepTitle}>Define tu meta</Text>
          <Text style={styles.stepSubtitle}>Establecer un objetivo alcanzable</Text>

          {/* Tarjeta de meta seleccionada */}
          <View style={[styles.selectedGoalCard, { backgroundColor: goalData.color }]}>
            <View style={styles.selectedGoalIcon}>
              <Ionicons
                name={GOAL_ICONS[goalData.icon] || 'flag'}
                size={32}
                color={COLORS.white}
              />
            </View>
            <View style={styles.selectedGoalInfo}>
              <Text style={styles.selectedGoalName}>
                {goalData.name || 'Nueva Meta'}
              </Text>
              <Text style={styles.selectedGoalDuration}>
                {goalData.duration_days} días
              </Text>
            </View>
          </View>

          {/* Nombre del reto */}
          <Text style={styles.inputLabel}>Nombre del reto</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor={COLORS.gray}
            value={goalData.name}
            onChangeText={(text) => setGoalData({ ...goalData, name: text })}
          />

          {/* Duración del reto */}
          <Text style={styles.inputLabel}>Duración del reto</Text>
          <View style={styles.durationContainer}>
            {[3, 7, 14, 21, 30].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.durationButton,
                  goalData.duration_days === days && styles.durationButtonActive,
                ]}
                onPress={() => setGoalData({ ...goalData, duration_days: days })}
              >
                <Text
                  style={[
                    styles.durationButtonText,
                    goalData.duration_days === days && styles.durationButtonTextActive,
                  ]}
                >
                  {days}d
                </Text>
              </TouchableOpacity>
            ))}
            {/* Botón personalizado */}
            <TouchableOpacity
              style={[
                styles.durationButton,
                ![3, 7, 14, 21, 30].includes(goalData.duration_days) && styles.durationButtonActive,
              ]}
              onPress={handleCustomDays}
            >
              <Text
                style={[
                  styles.durationButtonText,
                  ![3, 7, 14, 21, 30].includes(goalData.duration_days) && styles.durationButtonTextActive,
                ]}
              >
                {![3, 7, 14, 21, 30].includes(goalData.duration_days) && goalData.duration_days > 0
                  ? `${goalData.duration_days}d`
                  : 'Otro'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={() => setStep(3)}>
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal de días personalizados */}
        <Modal
          visible={showCustomDaysModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCustomDaysModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Duración personalizada</Text>
              <Text style={styles.modalSubtitle}>¿Cuántos días durará tu meta?</Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Ej: 45"
                placeholderTextColor={COLORS.gray}
                keyboardType="number-pad"
                value={customDays}
                onChangeText={setCustomDays}
                autoFocus
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => {
                    setShowCustomDaysModal(false);
                    setCustomDays('');
                  }}
                >
                  <Text style={styles.modalButtonCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonConfirm}
                  onPress={applyCustomDays}
                >
                  <Text style={styles.modalButtonConfirmText}>Aplicar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // PASO 3: Resumen
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep(2)}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Meta</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '33%' }]} />
        <View style={[styles.progressBar, { width: '33%' }]} />
        <View style={[styles.progressBar, { width: '34%' }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>Resumen del reto</Text>
        <Text style={styles.stepSubtitle}>Revisa los detalles antes de crear</Text>

        {/* Tarjeta de resumen */}
        <View style={[styles.summaryCard, { backgroundColor: goalData.color }]}>
          <View style={styles.summaryHeader}>
            <Ionicons name="checkmark-circle" size={40} color={COLORS.white} />
            <Text style={styles.summaryTitle}>Reto de {goalData.name}</Text>
            <Text style={styles.summarySubtitle}>
              {goalData.duration_days} {goalData.duration_days === 1 ? 'día' : 'días'}
            </Text>
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatLabel}>Duración</Text>
              <Text style={styles.summaryStatValue}>{goalData.duration_days} días</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatLabel}>Frecuencia</Text>
              <Text style={styles.summaryStatValue}>{goalData.frequency === 'daily' ? 'Diaria' : 'Personalizada'}</Text>
            </View>
          </View>
        </View>

        {/* Ilustración */}
        <View style={styles.illustrationContainer}>
          <Ionicons name="happy-outline" size={80} color={COLORS.gray} />
          <Text style={styles.illustrationTitle}>¡Estás listo!</Text>
          <Text style={styles.illustrationText}>
            Completa este reto y mejora tu salud día a día
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleCreateGoal}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.continueButtonText}>Continuar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: COLORS.white,
  },
  topButtonContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  createCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  createCustomText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: COLORS.black,
  },
  createCustomIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 16,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionName: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 4,
  },
  suggestionMeta: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: COLORS.gray,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressBarInactive: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  stepTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    color: COLORS.black,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 24,
  },
  selectedGoalCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedGoalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedGoalInfo: {
    flex: 1,
  },
  selectedGoalName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 4,
  },
  selectedGoalDuration: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  inputLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 20,
  },
  metaDiariaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaDiariaTag: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  metaDiariaText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
    color: COLORS.white,
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  durationButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  durationButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  durationButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: COLORS.black,
  },
  durationButtonTextActive: {
    color: COLORS.white,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.white,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    color: COLORS.white,
    marginTop: 12,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  summaryStatValue: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.white,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.white,
    opacity: 0.3,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustrationTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  illustrationText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  // Modal estilos
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    color: COLORS.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: COLORS.black,
  },
  modalButtonConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: COLORS.white,
  },
});
