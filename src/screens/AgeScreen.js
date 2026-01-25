// src/components/screens/AgeScreen.js
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
import { COLORS } from '../constants/colors'; // Asegúrate de tener este archivo

const AgeScreen = ({ navigation }) => {
  const [age, setAge] = useState(25);
  const minAge = 15;
  const maxAge = 80;

  const handleAgeChange = (value) => {
    setAge(value);
  };

  const handleContinue = () => {
    // Navegar a la siguiente pantalla pasando la edad
    navigation.navigate('BodyMetricsScreen', { age });
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        

        {/* Contenido principal */}
        <View style={styles.contentContainer}>
          <Text style={styles.question}>¿Cuál es tu edad?</Text>
          <Text style={styles.subtitle}>
            Esto nos ayuda a personalizar tus recomendaciones
          </Text>

          {/* Display de edad */}
          <View style={styles.ageDisplay}>
            <Text style={styles.ageText}>{age}</Text>
            <Text style={styles.ageLabel}>años</Text>
          </View>

          {/* Slider personalizado */}
          <View style={styles.sliderContainer}>
            {/* Marcas del slider */}
            <View style={styles.sliderMarks}>
              <Text style={styles.markLabel}>{minAge}</Text>
              <Text style={styles.markLabel}>{maxAge}</Text>
            </View>

            {/* Pista del slider */}
            <View style={styles.sliderTrack}>
              <View 
                style={[
                  styles.sliderProgress,
                  { width: `${((age - minAge) / (maxAge - minAge)) * 100}%` }
                ]} 
              />
              
              {/* Control deslizante */}
              <View 
                style={[
                  styles.sliderThumb,
                  { left: `${((age - minAge) / (maxAge - minAge)) * 100}%` }
                ]}
              >
                <TouchableOpacity 
                  style={styles.thumbTouch}
                  activeOpacity={0.7}
                  // Aquí agregarías el gesto para arrastrar
                />
              </View>
            </View>

            {/* Botones de incremento/decremento */}
            <View style={styles.ageButtonsContainer}>
              <TouchableOpacity 
                style={styles.ageButton}
                onPress={() => age > minAge && setAge(age - 1)}
                disabled={age <= minAge}
              >
                <Text style={[
                  styles.ageButtonText,
                  age <= minAge && styles.ageButtonDisabled
                ]}>−</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.ageButton}
                onPress={() => age < maxAge && setAge(age + 1)}
                disabled={age >= maxAge}
              >
                <Text style={[
                  styles.ageButtonText,
                  age >= maxAge && styles.ageButtonDisabled
                ]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón Continuar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
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
    paddingTop: 40,
    alignItems: 'center',
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
    marginBottom: 50,
  },
  ageDisplay: {
    alignItems: 'center',
    marginBottom: 50,
  },
  ageText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  ageLabel: {
    fontSize: 18,
    color: COLORS.textGray,
    marginTop: -10,
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
  },
  sliderMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  markLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  sliderTrack: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    marginBottom: 40,
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -18,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbTouch: {
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
  ageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  ageButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageButtonText: {
    fontSize: 32,
    color: COLORS.primary,
    fontWeight: '300',
    lineHeight: 32,
  },
  ageButtonDisabled: {
    color: COLORS.border,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AgeScreen;