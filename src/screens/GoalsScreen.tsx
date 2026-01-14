// src/screens/GoalsScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, GlobalStyles } from '../constants';
import { saveNewGoal } from '../services/goalsService'; // Asegúrate de haber creado este archivo antes

// --- TIPOS DE DATOS ---
type GoalOption = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  min: number;   // Valor mínimo del slider
  max: number;   // Valor máximo del slider
  unit: string;  // Texto de unidad (vasos, pasos)
  step: number;  // Saltos del slider
};

// --- DATOS DE CONFIGURACIÓN ---
// En src/screens/GoalsScreen.tsx

const GOAL_OPTIONS: GoalOption[] = [
  // --- SALUD BÁSICA ---
  { 
    id: '1', title: 'Hidratación', subtitle: 'Meta: 8 vasos/día', description: 'El agua es vida.',
    icon: 'water', color: '#56CCF2', min: 1, max: 15, unit: 'vasos', step: 1 
  },
  { 
    id: '4', title: 'Lavarse los Dientes', subtitle: 'Meta: 3 veces/día', description: 'Higiene bucal diaria.',
    icon: 'happy', color: '#9B51E0', min: 1, max: 5, unit: 'veces', step: 1 
  }, // Nuevo (Icono carita feliz o similar)

  // --- ACTIVIDAD FÍSICA ---
  { 
    id: '2', title: 'Caminar', subtitle: 'Meta: 8000 pasos/día', description: 'Mantente activo caminando.',
    icon: 'walk', color: '#F2994A', min: 2000, max: 20000, unit: 'pasos', step: 500 
  },
  { 
    id: '5', title: 'Trotar', subtitle: 'Meta: 30 minutos/día', description: 'Cardio para tu corazón.',
    icon: 'accessibility', color: '#FF5733', min: 10, max: 120, unit: 'min', step: 5 
  }, // Nuevo
  { 
    id: '6', title: 'Ciclismo', subtitle: 'Meta: 10 km/día', description: 'A rodar se ha dicho.',
    icon: 'bicycle', color: '#2D9CDB', min: 5, max: 100, unit: 'km', step: 5 
  }, // Nuevo
  { 
    id: '7', title: 'Senderismo', subtitle: 'Meta: 1 salida/semana', description: 'Conecta con la naturaleza.',
    icon: 'leaf', color: '#27AE60', min: 1, max: 7, unit: 'veces', step: 1 
  }, // Nuevo

  // --- BIENESTAR ---
  { 
    id: '3', title: 'Estiramientos', subtitle: 'Meta: 15 minutos/día', description: 'Mejora tu flexibilidad.',
    icon: 'body', color: '#6FCF97', min: 5, max: 60, unit: 'min', step: 5 
  },
];

const DURATION_OPTIONS = [3, 7, 14, 21, 30]; // Días disponibles

export default function GoalsScreen({ navigation }: any) {
  // --- ESTADOS ---
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [duration, setDuration] = useState(3);
  const [goalName, setGoalName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- LÓGICA ---

  // Al seleccionar una tarjeta inicial
  const handleSelectGoal = (goal: GoalOption) => {
    setSelectedGoal(goal);
    // Valor por defecto sugerido (Ej: 8 vasos o 6000 pasos)
    const defaultValue = goal.min === 2000 ? 6000 : 4; 
    setSliderValue(defaultValue);
    setDuration(3);
    setGoalName('');
  };

  // Botón atrás
  const handleBack = () => {
    if (selectedGoal) {
      setSelectedGoal(null); // Volver a la lista
    } else {
      navigation.goBack(); // Salir de la pantalla si estamos en la lista
    }
  };

  // Guardar en Firebase
  const handleSave = async () => {
    if (!goalName.trim()) {
      Alert.alert("Falta el nombre", "Por favor, escribe un nombre para tu reto.");
      return;
    }
    if (!selectedGoal) return;

    setIsLoading(true);

    const newGoalData = {
      title: selectedGoal.title,
      targetValue: sliderValue,
      unit: selectedGoal.unit,
      durationDays: duration,
      goalName: goalName,
      icon: selectedGoal.icon,
      color: selectedGoal.color,
      status: 'active' as const,
    };

    const result = await saveNewGoal(newGoalData);
    setIsLoading(false);

    if (result.success) {
      Alert.alert("¡Reto Creado!", "Tu meta se ha guardado correctamente.", [
        { text: "OK", onPress: () => {
            setSelectedGoal(null);
            navigation.navigate('Resumen'); // Te lleva al Home
        }}
      ]);
    } else {
      Alert.alert("Error", "Hubo un problema al guardar. Revisa tu conexión.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      
      {/* HEADER VERDE (Fijo) */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitleText}>Crear Meta</Text>
            <View style={{ width: 24 }} /> 
          </View>
          
          {/* Barras de progreso visual */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: 'white' }]} />
            <View style={[styles.progressBar, { backgroundColor: selectedGoal ? 'white' : 'rgba(255,255,255,0.4)' }]} />
            <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.4)' }]} />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* --- MODO LISTA (Selección) --- */}
        {!selectedGoal ? (
          <>
            <Text style={styles.sectionTitle}>Define tu meta</Text>
            <Text style={styles.sectionSubtitle}>Establece un objetivo alcanzable</Text>

            <View style={styles.cardsContainer}>
              {GOAL_OPTIONS.map((goal) => (
                <TouchableOpacity key={goal.id} style={styles.card} onPress={() => handleSelectGoal(goal)}>
                  <View style={[styles.iconBox, { borderColor: '#EEE' }]}>
                    <Ionicons name={goal.icon} size={28} color={goal.color} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{goal.title}</Text>
                    <Text style={styles.cardSubtitle}>{goal.subtitle}</Text>
                  </View>
                  <View style={styles.radioButton} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          
          /* --- MODO DETALLE (Configuración con Sliders) --- */
          <>
            <Text style={styles.sectionTitle}>Configura tu reto</Text>
            <Text style={styles.sectionSubtitle}>Personaliza los detalles</Text>

            {/* Tarjeta Grande Dinámica */}
            <View style={[styles.bigCard, { backgroundColor: selectedGoal.color }]}>
              <View style={styles.bigCardContent}>
                 <Ionicons name={selectedGoal.icon} size={50} color="white" style={{ opacity: 0.9 }} />
                 <View style={{ marginLeft: 15, flex: 1 }}>
                    <Text style={styles.bigCardTitle}>{selectedGoal.title}</Text>
                    <Text style={styles.bigCardText}>
                        Objetivo: {sliderValue} {selectedGoal.unit}
                    </Text>
                 </View>
              </View>
            </View>

            {/* Input Nombre */}
            <Text style={styles.label}>Nombre del reto</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: Reto de Verano 2026" 
              placeholderTextColor="#BDBDBD"
              value={goalName}
              onChangeText={setGoalName}
            />

            {/* SLIDER */}
            <View style={styles.rowBetween}>
                <Text style={styles.label}>Meta diaria</Text>
                <View style={[styles.badge, { backgroundColor: selectedGoal.color }]}>
                    <Text style={styles.badgeText}>{sliderValue} {selectedGoal.unit}</Text>
                </View>
            </View>
            
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={selectedGoal.min}
              maximumValue={selectedGoal.max}
              step={selectedGoal.step}
              value={sliderValue}
              onValueChange={setSliderValue}
              minimumTrackTintColor={selectedGoal.color}
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor={selectedGoal.color}
            />
            <View style={styles.sliderLabels}>
                <Text style={styles.smallText}>{selectedGoal.min}</Text>
                <Text style={styles.smallText}>{selectedGoal.max}</Text>
            </View>

            {/* Selector de Días */}
            <View style={[styles.rowBetween, { marginTop: 25 }]}>
                <Text style={styles.label}>Duración</Text>
                <View style={[styles.badge, { backgroundColor: COLORS.success }]}>
                    <Text style={styles.badgeText}>{duration} días</Text>
                </View>
            </View>

            <View style={styles.durationContainer}>
                {DURATION_OPTIONS.map((d) => (
                    <TouchableOpacity 
                        key={d} 
                        style={[
                            styles.durationButton, 
                            duration === d && { backgroundColor: COLORS.success, borderColor: COLORS.success }
                        ]}
                        onPress={() => setDuration(d)}
                    >
                        <Text style={[styles.durationText, duration === d && { color: 'white' }]}>
                            {d}d
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Botón Acción Principal */}
            <TouchableOpacity 
                style={[styles.mainButton, { backgroundColor: COLORS.primary }]} 
                onPress={handleSave}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.mainButtonText}>Crear Reto</Text>
                )}
            </TouchableOpacity>
            
            {/* Espacio extra abajo */}
            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  
  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    // Sombra del header
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, elevation: 4
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  headerTitleText: { color: 'white', fontSize: 18, fontWeight: '600' },
  progressContainer: { flexDirection: 'row', gap: 8 },
  progressBar: { height: 4, flex: 1, borderRadius: 2 },
  
  // Contenido
  contentContainer: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: '#888', marginBottom: 24 },
  
  // Lista Tarjetas
  cardsContainer: { gap: 16 },
  card: {
    backgroundColor: 'white', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  iconBox: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  cardSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#E0E0E0' },

  // Detalles (Wizard)
  bigCard: {
    borderRadius: 20, padding: 24, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
  bigCardContent: { flexDirection: 'row', alignItems: 'center' },
  bigCardTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  bigCardText: { color: 'rgba(255,255,255,0.9)', fontSize: 16, marginTop: 4 },

  label: { fontSize: 15, fontWeight: '600', color: '#4F4F4F', marginBottom: 8 },
  input: { backgroundColor: 'white', padding: 16, borderRadius: 12, fontSize: 16, color: '#333', marginBottom: 24, borderWidth: 1, borderColor: '#EEE' },
  
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: 4 },
  smallText: { color: '#BDBDBD', fontSize: 12 },

  durationContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 32 },
  durationButton: { 
      width: 50, height: 45, borderRadius: 12, backgroundColor: 'white', 
      justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0',
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 1
  },
  durationText: { color: '#828282', fontWeight: '600', fontSize: 13 },

  mainButton: { 
    padding: 18, borderRadius: 16, alignItems: 'center', 
    shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowOffset: {width: 0, height: 4}, elevation: 8 
  },
  mainButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});