import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './apiConfig';
import { saveToken, saveUserData } from './storage';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Funciones de autenticación
export const authAPI = {
  // Registrar usuario
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        await saveToken(response.data.token);
        await saveUserData(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Iniciar sesión
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        await saveToken(response.data.token);
        await saveUserData(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Verificar token
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Actualizar avatar
  updateAvatar: async (avatarUrl) => {
    try {
      const response = await api.put('/auth/avatar', { avatar_url: avatarUrl });
      if (response.data.user) {
        await saveUserData(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Cerrar sesión
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  // Obtener usuario guardado
  getStoredUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  // Obtener token guardado
  getStoredToken: async () => {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      return null;
    }
  },
};

// Funciones de chat
export const chatAPI = {
  // Enviar mensaje al chat
  sendMessage: async (message, conversationHistory = []) => {
    try {
      const response = await api.post('/chat/message', {
        message,
        conversationHistory,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener mensaje de bienvenida
  getWelcomeMessage: async () => {
    try {
      const response = await api.get('/chat/welcome');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },
};

export default api;
