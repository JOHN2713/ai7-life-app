import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@ai7life:onboarding_completed',
  USER_TOKEN: '@ai7life:token',
  USER_DATA: '@ai7life:user',
  FIRST_TIME: '@ai7life:first_time',
};

// Onboarding
export const setOnboardingCompleted = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    return true;
  } catch (error) {
    console.error('Error al guardar onboarding completado:', error);
    return false;
  }
};

export const hasCompletedOnboarding = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  } catch (error) {
    console.error('Error al verificar onboarding:', error);
    return false;
  }
};

export const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return true;
  } catch (error) {
    console.error('Error al resetear onboarding:', error);
    return false;
  }
};

// Usuario
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error al guardar datos del usuario:', error);
    return false;
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
};

// Token
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error al guardar token:', error);
    return false;
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

// Logout completo
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_TOKEN,
      STORAGE_KEYS.USER_DATA,
      // NO borramos ONBOARDING_COMPLETED para que no se muestre de nuevo
    ]);
    return true;
  } catch (error) {
    console.error('Error al limpiar datos:', error);
    return false;
  }
};

// Reset completo (incluye onboarding) - solo para desarrollo/testing
export const resetAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error al resetear todos los datos:', error);
    return false;
  }
};

export default {
  setOnboardingCompleted,
  hasCompletedOnboarding,
  resetOnboarding,
  saveUserData,
  getUserData,
  saveToken,
  getToken,
  clearAllData,
  resetAllData,
};
