// src/components/screens/SleepWaterScreen.js
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

const SleepWaterScreen = ({ navigation, route }) => {
  // Datos recibidos de pantallas anteriores
  const { age, height, weight, bmi } = route.params || {};
  
  // Estados
  const [sleepHours, setSleepHours] = useState(7);
  const [waterGlasses, setWaterGlasses] = useState(8);

  // Función para determinar color del número de sueño
  const getSleepColor = (hours) => {
    if (hours < 6) return '#F44336'; // Rojo - Insuficiente
    if (hours >= 6 && hours <= 9) return '#00AC83'; // Verde - Óptimo
    return '#FF9800'; // Naranja - Excesivo
  };

  // Función para determinar color del número de agua
  const getWaterColor = (glasses) => {
    if (glasses < 6) return '#F44336'; // Rojo - Insuficiente
    if (glasses >= 6 && glasses <= 10) return '#00AC83'; // Verde - Óptimo
    return '#00AC83'; // Verde - Está bien aunque sea más
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    // Validar datos mínimos
    if (sleepHours < 1 || waterGlasses < 0) {
      alert('Por favor ingresa valores válidos');
      return;
    }

    // Preparar datos para pasar a siguiente pantalla
    const data = {
      age,
      height,
      weight,
      bmi,
      sleepHours,
      waterGlasses,
    };

    // Navegar a pantalla de actividad física
    navigation.navigate('ActivityLevel', data);
  };

  const MetricControl = ({ title, value, unit, min, max, onDecrease, onIncrease, valueColor }) => (
    <View style={styles.metricControl}>
      <Text style={styles.metricTitle}>{title}</Text>
      
      <View style={styles.valueDisplay}>
        <Text style={[styles.valueNumber, { color: valueColor }]}>{value}</Text>
        <Text style={styles.valueUnit}>{unit}</Text>
      </View>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={onDecrease}
          disabled={value <= min}
        >
          <Text style={[
            styles.controlButtonText,
            value <= min && styles.controlButtonDisabled
          ]}>−</Text>
        </TouchableOpacity>
        
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View 
              style={[
                styles.sliderProgress,
                { 
                  width: `${((value - min) / (max - min)) * 100}%`,
                  backgroundColor: valueColor
                }
              ]} 
            />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>{min}</Text>
            <Text style={styles.sliderLabel}>{max}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={onIncrease}
          disabled={value >= max}
        >
          <Text style={[
            styles.controlButtonText,
            value >= max && styles.controlButtonDisabled
          ]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
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
          <Text style={styles.question}>Hábitos diarios</Text>
          <Text style={styles.subtitle}>
            Ingresa tus horas de sueño y consumo de agua
          </Text>

          {/* Contenedor de métricas */}
          <View style={styles.metricsContainer}>
            
            {/* Sueño */}
            <View style={styles.metricSection}>
              <MetricControl
                title="Horas de sueño por noche"
                value={sleepHours}
                unit="horas"
                min={0}
                max={12}
                onDecrease={() => sleepHours > 0 && setSleepHours(sleepHours - 1)}
                onIncrease={() => sleepHours < 12 && setSleepHours(sleepHours + 1)}
                valueColor={getSleepColor(sleepHours)}
              />
              
              {/* Indicadores de sueño */}
              <View style={styles.sleepIndicators}>
                <View style={styles.indicatorItem}>
                  <View style={[styles.indicatorDot, styles.indicatorPoor]} />
                  <Text style={styles.indicatorText}>Insuficiente {"<"}6h</Text>
                </View>
                <View style={styles.indicatorItem}>
                  <View style={[styles.indicatorDot, styles.indicatorGood]} />
                  <Text style={styles.indicatorText}>Óptimo 6-9h</Text>
                </View>
                <View style={styles.indicatorItem}>
                  <View style={[styles.indicatorDot, styles.indicatorExcess]} />
                  <Text style={styles.indicatorText}>Excesivo {">"}9h</Text>
                </View>
              </View>
            </View>

            {/* Separador */}
            <View style={styles.separator} />

            {/* Agua */}
            <View style={styles.metricSection}>
              <MetricControl
                title="Vasos de agua al día"
                value={waterGlasses}
                unit="vasos"
                min={0}
                max={20}
                onDecrease={() => waterGlasses > 0 && setWaterGlasses(waterGlasses - 1)}
                onIncrease={() => waterGlasses < 20 && setWaterGlasses(waterGlasses + 1)}
                valueColor={getWaterColor(waterGlasses)}
              />
              
              {/* Indicadores de hidratación */}
              <View style={styles.waterInfo}>
                <Text style={styles.waterInfoTitle}>Recomendación general:</Text>
                <Text style={styles.waterInfoText}>
                  8 vasos de agua al día (aproximadamente 2 litros)
                </Text>
              </View>
            </View>
          </View>

          {/* Información adicional */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Un buen descanso e hidratación adecuada son esenciales para tu salud y bienestar general.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer con botones Atrás y Continuar */}
      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <TouchableOpacity 
            style={styles.backButtonFooter}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>Atrás</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
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
    paddingTop: 30,
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
  metricsContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    padding: 25,
    marginBottom: 30,
  },
  metricSection: {
    marginBottom: 15,
  },
  metricControl: {
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  valueDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 25,
  },
  valueNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  valueUnit: {
    fontSize: 20,
    color: COLORS.textGray,
    marginLeft: 8,
    marginTop: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  controlButtonText: {
    fontSize: 32,
    color: COLORS.primary,
    fontWeight: '300',
    lineHeight: 32,
  },
  controlButtonDisabled: {
    color: COLORS.border,
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: 8,
  },
  sliderProgress: {
    height: '100%',
    borderRadius: 2,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  sleepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  indicatorItem: {
    alignItems: 'center',
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  indicatorPoor: {
    backgroundColor: '#F44336',
  },
  indicatorGood: {
    backgroundColor: '#00AC83',
  },
  indicatorExcess: {
    backgroundColor: '#FF9800',
  },
  indicatorText: {
    fontSize: 11,
    color: COLORS.textGray,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 25,
    marginHorizontal: -10,
  },
  waterInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E8F7F2',
    borderRadius: 12,
    alignItems: 'center',
  },
  waterInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D5F',
    marginBottom: 4,
  },
  waterInfoText: {
    fontSize: 13,
    color: '#2E7D5F',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D5F',
    lineHeight: 20,
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
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SleepWaterScreen;