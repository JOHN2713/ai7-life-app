import axios from 'axios';
import { API_URL } from './apiConfig';
// Importamos las funciones necesarias de tu storage.js
import { 
  getToken, 
  clearAllData, 
  saveToken, 
  saveUserData, 
  getUserData 
} from './storage';

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
    try {
      // Usamos la función del storage que ya tiene la clave @ai7life:token
      const token = await getToken(); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error en interceptor de petición:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el servidor responde 401 (No autorizado), limpiamos los datos locales
    if (error.response?.status === 401) {
      await clearAllData();
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
      // Si el registro devuelve token, guardamos todo automáticamente
      if (response.data.token) {
        await saveToken(response.data.token);
        await saveUserData(response.data.user);
      }
      return response.data;
    } catch (error) {
      console.error('Error en authAPI.register:', error.message);
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Iniciar sesión
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Al recibir el 200 OK del servidor (que ya vimos en tus logs):
      if (response.data.token) {
        // Guardamos con las claves correctas de storage.js
        await saveToken(response.data.token);
        await saveUserData(response.data.user);
      }
      return response.data;
    } catch (error) {
      console.error('Error en authAPI.login:', error.message);
      // Si llegamos aquí es porque algo falló en la red o el guardado
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Verificar token activo
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
    await clearAllData();
  },

  // Obtener usuario guardado localmente
  getStoredUser: async () => {
    return await getUserData();
  },

  // Obtener token guardado localmente
  getStoredToken: async () => {
    return await getToken();
  },
};

// Funciones de chat
export const chatAPI = {
  // Enviar mensaje
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

  // Obtener bienvenida
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