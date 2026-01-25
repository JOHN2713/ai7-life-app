/**
 * 🏥 Servicio de Datos de Salud
 * Gestiona el cálculo y almacenamiento de datos de salud del usuario
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  HEALTH_DATA: '@ai7life:health_data',
  HEALTH_HISTORY: '@ai7life:health_history',
};

/**
 * Guardar datos de salud del usuario
 * @param {Object} healthData - {age, weight, height, activityLevel, etc}
 */
export const saveHealthData = async (healthData) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.HEALTH_DATA, 
      JSON.stringify({
        ...healthData,
        lastUpdated: new Date().toISOString(),
      })
    );
    return true;
  } catch (error) {
    console.error('Error al guardar datos de salud:', error);
    return false;
  }
};

/**
 * Obtener datos de salud guardados
 */
export const getHealthData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HEALTH_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error al obtener datos de salud:', error);
    return null;
  }
};

/**
 * Calcular IMC (Índice de Masa Corporal)
 * @param {number} weight - Peso en kg
 * @param {number} height - Altura en cm
 * @returns {Object} - {imc: number, category: string}
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height || height <= 0) return null;
  
  // Convertir altura a metros
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category = 'Normal';
  if (bmi < 18.5) category = 'Bajo peso';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Sobrepeso';
  else category = 'Obesidad';
  
  return {
    imc: parseFloat(bmi.toFixed(1)),
    category,
  };
};

/**
 * Calcular calorías diarias recomendadas
 * @param {Object} data - {age, weight, height, activityLevel, gender}
 * @returns {number} - Calorías recomendadas
 */
export const calculateDailyCalories = (data) => {
  const { age, weight, height, activityLevel, gender } = data;
  
  if (!age || !weight || !height) return null;
  
  // Fórmula de Harris-Benedict
  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // Factores de actividad
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  
  const factor = activityFactors[activityLevel] || 1.5;
  return Math.round(bmr * factor);
};

/**
 * Guardar registro histórico de salud
 * @param {Object} entry - Entrada de datos de salud
 */
export const addHealthHistoryEntry = async (entry) => {
  try {
    const history = await AsyncStorage.getItem(STORAGE_KEYS.HEALTH_HISTORY);
    const historyArray = history ? JSON.parse(history) : [];
    
    historyArray.push({
      ...entry,
      date: new Date().toISOString(),
    });
    
    // Mantener solo los últimos 90 días
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const filteredHistory = historyArray.filter(
      entry => new Date(entry.date) > ninetyDaysAgo
    );
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.HEALTH_HISTORY,
      JSON.stringify(filteredHistory)
    );
    
    return true;
  } catch (error) {
    console.error('Error al agregar entrada de historial:', error);
    return false;
  }
};

/**
 * Obtener historial de salud
 */
export const getHealthHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(STORAGE_KEYS.HEALTH_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return [];
  }
};

/**
 * Limpiar todos los datos de salud
 */
export const clearHealthData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.HEALTH_DATA,
      STORAGE_KEYS.HEALTH_HISTORY,
    ]);
    return true;
  } catch (error) {
    console.error('Error al limpiar datos de salud:', error);
    return false;
  }
};
