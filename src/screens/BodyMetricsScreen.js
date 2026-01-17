// src/screens/BodyMetricsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../constants/colors';

const BodyMetricsScreen = ({ navigation, route }) => {
  const { age } = route?.params || {};
    const [height, setHeight] = useState(170); // cm
  const [weight, setWeight] = useState(70); // kg
  const [bmi, setBmi] = useState(null);
  
  const minHeight = 140;
  const maxHeight = 210;
  const minWeight = 40;
  const maxWeight = 150;

  // Calcular BMI cuando cambian altura o peso
  useEffect(() => {
    const heightInMeters = height / 100;
    const calculatedBmi = weight / (heightInMeters * heightInMeters);
    setBmi(calculatedBmi.toFixed(1));
  }, [height, weight]);

  const handleContinue = () => {
    // Guardar datos y navegar
    const data = {
      age: route.params?.age,
      height,
      weight,
      bmi: parseFloat(bmi),
    };
    navigation.navigate('SleepWater', data);
  };

  const calculateBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) return 'Bajo peso';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  const getBMIColor = (bmiValue) => {
    if (bmiValue < 18.5) return '#FFA726'; // Naranja
    if (bmiValue < 25) return '#00AC83';   // Verde (primary)
    if (bmiValue < 30) return '#FF9800';   // Naranja oscuro
    return '#F44336';                      // Rojo
  };

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

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Contenido principal */}
          <View style={styles.contentContainer}>
            <Text style={styles.question}>Medidas corporales</Text>
            <Text style={styles.subtitle}>
              Ingresa tu altura y peso actual
            </Text>

            {/* Contenedor de medidas */}
            <View style={styles.metricsContainer}>
              
              {/* Altura */}
              <View style={styles.metricSection}>
                <Text style={styles.metricLabel}>Altura</Text>
                
                <View style={styles.valueContainer}>
                  <TextInput
                    style={styles.valueInput}
                    value={height.toString()}
                    onChangeText={(text) => {
                      const num = parseInt(text) || minHeight;
                      if (num >= minHeight && num <= maxHeight) {
                        setHeight(num);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                    selectTextOnFocus
                  />
                  <Text style={styles.unit}>cm</Text>
                </View>

                {/* Slider de altura */}
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderTrack}>
                    <View 
                      style={[
                        styles.sliderProgress,
                        { 
                          width: `${((height - minHeight) / (maxHeight - minHeight)) * 100}%`,
                          backgroundColor: COLORS.primary,
                        }
                      ]} 
                    />
                    <View 
                      style={[
                        styles.sliderThumb,
                        { left: `${((height - minHeight) / (maxHeight - minHeight)) * 100}%` }
                      ]}
                    />
                  </View>
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabel}>{minHeight}cm</Text>
                    <Text style={styles.sliderLabel}>{maxHeight}cm</Text>
                  </View>
                </View>

                {/* Botones altura */}
                <View style={styles.buttonsRow}>
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={() => height > minHeight && setHeight(height - 1)}
                    disabled={height <= minHeight}
                  >
                    <Text style={[
                      styles.controlButtonText,
                      height <= minHeight && styles.buttonDisabled
                    ]}>−</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={() => height < maxHeight && setHeight(height + 1)}
                    disabled={height >= maxHeight}
                  >
                    <Text style={[
                      styles.controlButtonText,
                      height >= maxHeight && styles.buttonDisabled
                    ]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Separador */}
              <View style={styles.separator} />

              {/* Peso */}
              <View style={styles.metricSection}>
                <Text style={styles.metricLabel}>Peso</Text>
                
                <View style={styles.valueContainer}>
                  <TextInput
                    style={styles.valueInput}
                    value={weight.toString()}
                    onChangeText={(text) => {
                      const num = parseInt(text) || minWeight;
                      if (num >= minWeight && num <= maxWeight) {
                        setWeight(num);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                    selectTextOnFocus
                  />
                  <Text style={styles.unit}>kg</Text>
                </View>

                {/* Slider de peso */}
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderTrack}>
                    <View 
                      style={[
                        styles.sliderProgress,
                        { 
                          width: `${((weight - minWeight) / (maxWeight - minWeight)) * 100}%`,
                          backgroundColor: COLORS.primary,
                        }
                      ]} 
                    />
                    <View 
                      style={[
                        styles.sliderThumb,
                        { left: `${((weight - minWeight) / (maxWeight - minWeight)) * 100}%` }
                      ]}
                    />
                  </View>
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabel}>{minWeight}kg</Text>
                    <Text style={styles.sliderLabel}>{maxWeight}kg</Text>
                  </View>
                </View>

                {/* Botones peso */}
                <View style={styles.buttonsRow}>
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={() => weight > minWeight && setWeight(weight - 1)}
                    disabled={weight <= minWeight}
                  >
                    <Text style={[
                      styles.controlButtonText,
                      weight <= minWeight && styles.buttonDisabled
                    ]}>−</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={() => weight < maxWeight && setWeight(weight + 1)}
                    disabled={weight >= maxWeight}
                  >
                    <Text style={[
                      styles.controlButtonText,
                      weight >= maxWeight && styles.buttonDisabled
                    ]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Display de BMI */}
            {bmi && (
              <View style={styles.bmiContainer}>
                <Text style={styles.bmiLabel}>Tu IMC estimado</Text>
                <View style={styles.bmiValueContainer}>
                  <Text style={[
                    styles.bmiValue,
                    { color: getBMIColor(parseFloat(bmi)) }
                  ]}>
                    {bmi}
                  </Text>
                  <View style={styles.bmiCategoryContainer}>
                    <Text style={[
                      styles.bmiCategory,
                      { color: getBMIColor(parseFloat(bmi)) }
                    ]}>
                      {calculateBMICategory(parseFloat(bmi))}
                    </Text>
                  </View>
                </View>
              </View>
            )}
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
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: 20,
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
    padding: 20,
    marginBottom: 30,
  },
  metricSection: {
    marginVertical: 10,
  },
  metricLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 15,
    textAlign: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 20,
  },
  valueInput: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    minWidth: 80,
    padding: 0,
  },
  unit: {
    fontSize: 20,
    color: COLORS.textGray,
    marginLeft: 8,
    marginTop: 10,
  },
  sliderContainer: {
    marginBottom: 15,
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
    position: 'absolute',
  },
  sliderThumb: {
    position: 'absolute',
    top: -10,
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  controlButtonText: {
    fontSize: 28,
    color: COLORS.primary,
    fontWeight: '300',
    lineHeight: 28,
  },
  buttonDisabled: {
    color: COLORS.border,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 25,
    marginHorizontal: 10,
  },
  bmiContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
  },
  bmiLabel: {
    fontSize: 16,
    color: COLORS.textGray,
    marginBottom: 10,
  },
  bmiValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  bmiCategoryContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
    borderWidth: 1,
  },
  bmiCategory: {
    fontSize: 14,
    fontWeight: '600',
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

export default BodyMetricsScreen;