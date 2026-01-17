// src/components/screens/HealthResultsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/colors';
//import apiService from '../services/apiService'; // Lo crearás después

const HealthResultsScreen = ({ navigation, route }) => {
  // Datos recibidos de todas las pantallas anteriores
  const healthData = route.params || {};
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [healthScore, setHealthScore] = useState(50);
  const [recommendations, setRecommendations] = useState([]);
  
  // Calcular BMI y categoría
  const bmi = healthData.bmi || calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  
  // Calcular BMI si no viene
  function calculateBMI() {
    const heightM = healthData.height_cm / 100;
    return (healthData.weight_kg / (heightM * heightM)).toFixed(1);
  }
  
  // Determinar categoría del BMI
  function getBMICategory(bmiValue) {
    if (!bmiValue) return 'No disponible';
    if (bmiValue < 18.5) return 'Bajo peso';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Sobrepeso';
    return 'Obesidad';
  }
  
  // Determinar color del BMI
  function getBMIColor(bmiValue) {
    if (bmiValue < 18.5) return '#FFA726'; // Naranja
    if (bmiValue < 25) return '#00AC83';   // Verde
    if (bmiValue < 30) return '#FF9800';   // Naranja oscuro
    return '#F44336';                      // Rojo
  }
  
  // Determinar color de la puntuación
  function getScoreColor(score) {
    if (score >= 80) return '#00AC83'; // Excelente
    if (score >= 60) return '#4CAF50'; // Bueno
    if (score >= 40) return '#FF9800'; // Regular
    return '#F44336';                 // Mejorar
  }
  
  // Determinar nivel de actividad en español
  function getActivityLevelText(level) {
    const levels = {
      'sedentario': 'Sedentario',
      'ligero': 'Ligero',
      'moderado': 'Moderado',
      'activo': 'Activo'
    };
    return levels[level] || level;
  }
  
  // Función para guardar datos en la BD
  const saveHealthData = async () => {
    try {
      setLoading(true);
      
      // Preparar datos para enviar al backend
      const dataToSend = {
        email: 'usuario@ejemplo.com', // Necesitarás obtener el email del usuario
        age: healthData.age,
        height_cm: healthData.height_cm,
        weight_kg: healthData.weight_kg,
        sleep_hours: healthData.sleep_hours,
        water_glasses: healthData.water_glasses,
        activity_level: healthData.activity_level,
      };
      
      // Aquí llamarías a tu API
      // const response = await apiService.submitHealthData(dataToSend);
      
      // Simular respuesta de API
      setTimeout(() => {
        const mockResponse = {
          success: true,
          data: {
            health_score: 65,
            recommendations: [
              'Intenta dormir al menos 7 horas cada noche para mejorar tu descanso.',
              'Aumenta tu consumo de agua a 8 vasos diarios para mantener una hidratación óptima.',
              'Considera agregar 2 días de actividad física moderada a tu rutina semanal.',
              'Mantén un equilibrio en tu dieta para mejorar tu índice de masa corporal.'
            ]
          }
        };
        
        setHealthScore(mockResponse.data.health_score);
        setRecommendations(mockResponse.data.recommendations);
        setLoading(false);
        
        Alert.alert(
          '¡Datos guardados!',
          'Tu información de salud ha sido guardada exitosamente.',
          [{ text: 'OK' }]
        );
      }, 1500);
      
    } catch (error) {
      console.error('Error al guardar datos:', error);
      setLoading(false);
      Alert.alert(
        'Error',
        'No se pudieron guardar los datos. Por favor intenta de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };
  
  // Al cargar la pantalla, guardar datos automáticamente
  useEffect(() => {
    saveHealthData();
  }, []);
  
  const handleFinish = () => {
    // Navegar al dashboard principal
    navigation.navigate('Dashboard');
  };
  
  // Componente de tarjeta de dato
  const DataCard = ({ title, value, color, unit = '' }) => (
    <View style={styles.dataCard}>
      <Text style={styles.dataCardTitle}>{title}</Text>
      <View style={styles.dataCardValueContainer}>
        <Text style={[styles.dataCardValue, { color }]}>{value}</Text>
        {unit ? <Text style={styles.dataCardUnit}>{unit}</Text> : null}
      </View>
    </View>
  );
  
  // Componente de recomendación
  const RecommendationCard = ({ text, index }) => (
    <View style={styles.recommendationCard}>
      <View style={styles.recommendationNumber}>
        <Text style={styles.recommendationNumberText}>{index + 1}</Text>
      </View>
      <Text style={styles.recommendationText}>{text}</Text>
    </View>
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
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Analizando tu salud...</Text>
          <Text style={styles.loadingSubtext}>Guardando tus datos</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Título principal */}
          <View style={styles.titleContainer}>
            <Text style={styles.screenTitle}>TUS RESULTADOS</Text>
            <Text style={styles.screenSubtitle}>Análisis completo de tu salud</Text>
          </View>
          
          {/* Puntuación de salud */}
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreValue, { color: getScoreColor(healthScore) }]}>
                {healthScore}
              </Text>
              <Text style={styles.scoreLabel}>Puntuación de salud</Text>
              <View style={[
                styles.scoreCategory,
                { backgroundColor: getScoreColor(healthScore) + '20' }
              ]}>
                <Text style={[
                  styles.scoreCategoryText,
                  { color: getScoreColor(healthScore) }
                ]}>
                  {healthScore >= 80 ? 'Excelente' : 
                   healthScore >= 60 ? 'Bueno' : 
                   healthScore >= 40 ? 'Normal' : 'Mejorar'}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Resumen de datos */}
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>Resumen de tus datos</Text>
            
            <View style={styles.dataGrid}>
              <DataCard
                title="IMC"
                value={parseFloat(bmi).toFixed(1)}
                color={getBMIColor(bmi)}
                unit={bmiCategory}
              />
              
              <DataCard
                title="Horas de sueño"
                value={healthData.sleep_hours || 'N/A'}
                color={healthData.sleep_hours >= 7 ? '#00AC83' : 
                       healthData.sleep_hours >= 6 ? '#FF9800' : '#F44336'}
                unit="h/ noche"
              />
              
              <DataCard
                title="Hidratación"
                value={healthData.water_glasses || 'N/A'}
                color={healthData.water_glasses >= 8 ? '#00AC83' : 
                       healthData.water_glasses >= 6 ? '#FF9800' : '#F44336'}
                unit="vasos/día"
              />
              
              <DataCard
                title="Actividad"
                value={getActivityLevelText(healthData.activity_level) || 'N/A'}
                color={healthData.activity_level === 'activo' ? '#00AC83' : 
                       healthData.activity_level === 'moderado' ? '#4CAF50' : 
                       healthData.activity_level === 'ligero' ? '#FF9800' : '#F44336'}
                unit=""
              />
            </View>
            
            {/* Datos adicionales */}
            <View style={styles.additionalData}>
              <View style={styles.additionalDataItem}>
                <Text style={styles.additionalDataLabel}>Edad</Text>
                <Text style={styles.additionalDataValue}>{healthData.age} años</Text>
              </View>
              <View style={styles.separatorVertical} />
              <View style={styles.additionalDataItem}>
                <Text style={styles.additionalDataLabel}>Altura</Text>
                <Text style={styles.additionalDataValue}>{healthData.height_cm} cm</Text>
              </View>
              <View style={styles.separatorVertical} />
              <View style={styles.additionalDataItem}>
                <Text style={styles.additionalDataLabel}>Peso</Text>
                <Text style={styles.additionalDataValue}>{healthData.weight_kg} kg</Text>
              </View>
            </View>
          </View>
          
          {/* Recomendaciones */}
          <View style={styles.recommendationsContainer}>
            <Text style={styles.sectionTitle}>Recomendaciones personalizadas</Text>
            
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <RecommendationCard key={index} text={rec} index={index} />
              ))
            ) : (
              <View style={styles.noRecommendations}>
                <Text style={styles.noRecommendationsText}>
                  Cargando recomendaciones...
                </Text>
              </View>
            )}
          </View>
          
          {/* Nota importante */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteIcon}>⚠️</Text>
            <Text style={styles.noteText}>
              Esta información es para fines educativos. Consulta a un profesional de la salud para un diagnóstico preciso.
            </Text>
          </View>
        </ScrollView>
      )}
      
      {/* Footer con botón Finalizar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.finishButton}
          onPress={handleFinish}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.finishButtonText}>
            {loading ? 'Guardando...' : 'Finalizar'}
          </Text>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 20,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: COLORS.textGray,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#F0F0F0',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 14,
    color: COLORS.textGray,
    marginTop: 4,
  },
  scoreCategory: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  scoreCategoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 20,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dataCard: {
    width: '48%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  dataCardTitle: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 8,
  },
  dataCardValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  dataCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 6,
  },
  dataCardUnit: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  additionalData: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  additionalDataItem: {
    flex: 1,
    alignItems: 'center',
  },
  additionalDataLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  additionalDataValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  separatorVertical: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
  },
  recommendationsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F9F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  recommendationNumberText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D5F',
    lineHeight: 20,
  },
  noRecommendations: {
    padding: 20,
    alignItems: 'center',
  },
  noRecommendationsText: {
    fontSize: 14,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  noteIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#E65100',
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  finishButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HealthResultsScreen;