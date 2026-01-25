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
    const token = await AsyncStorage.getItem('@ai7life:token');
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
      await AsyncStorage.removeItem('@ai7life:token');
      await AsyncStorage.removeItem('@ai7life:user');
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
    await AsyncStorage.removeItem('@ai7life:token');
    await AsyncStorage.removeItem('@ai7life:user');
  },

  // Obtener usuario guardado
  getStoredUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('@ai7life:user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  // Obtener token guardado
  getStoredToken: async () => {
    try {
      return await AsyncStorage.getItem('@ai7life:token');
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

// Funciones de metas (goals)
export const goalsAPI = {
  // Obtener todas las metas del usuario
  getUserGoals: async (activeOnly = false) => {
    try {
      const response = await api.get('/goals', {
        params: { active_only: activeOnly }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener plantillas de metas predefinidas
  getTemplates: async () => {
    try {
      const response = await api.get('/goals/templates');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener una meta por ID
  getGoalById: async (goalId) => {
    try {
      const response = await api.get(`/goals/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Crear una nueva meta
  createGoal: async (goalData) => {
    try {
      const response = await api.post('/goals', goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Actualizar una meta
  updateGoal: async (goalId, goalData) => {
    try {
      const response = await api.put(`/goals/${goalId}`, goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Eliminar una meta
  deleteGoal: async (goalId) => {
    try {
      const response = await api.delete(`/goals/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Marcar meta como completada
  completeGoal: async (goalId, date = null, notes = null) => {
    try {
      const response = await api.post(`/goals/${goalId}/complete`, {
        date,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Desmarcar meta como completada
  uncompleteGoal: async (goalId, date = null) => {
    try {
      const response = await api.post(`/goals/${goalId}/uncomplete`, {
        date
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener historial de cumplimiento
  getGoalHistory: async (goalId) => {
    try {
      const response = await api.get(`/goals/${goalId}/history`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener estadísticas
  getStats: async () => {
    try {
      const response = await api.get('/goals/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },
};

// Funciones de recordatorios
export const remindersAPI = {
  // Generar mensaje motivacional con IA
  generateMotivationalMessage: async (goalName, messageType = 'motivacion', userName = null) => {
    try {
      const response = await api.post('/reminders/generate-message', {
        goalName,
        messageType,
        userName
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Crear recordatorio
  createReminder: async (goalId, reminderTime, isActive = true, message = null, messageType = 'motivacion') => {
    try {
      const response = await api.post('/reminders', {
        goalId,
        reminderTime,
        isActive,
        message,
        messageType
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener recordatorios de una meta
  getGoalReminders: async (goalId) => {
    try {
      const response = await api.get(`/reminders/goal/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener todos los recordatorios del usuario
  getAllUserReminders: async () => {
    try {
      const response = await api.get('/reminders/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Actualizar recordatorio
  updateReminder: async (reminderId, data) => {
    try {
      const response = await api.put(`/reminders/${reminderId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Eliminar recordatorio
  deleteReminder: async (reminderId) => {
    try {
      const response = await api.delete(`/reminders/${reminderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener historial de notificaciones
  getNotificationHistory: async (limit = 50, offset = 0) => {
    try {
      const response = await api.get('/reminders/notifications/history', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Marcar notificación como leída
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/reminders/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },
};

// ========================================
// API DE AMIGOS
// ========================================
export const friendsAPI = {
  // Buscar usuarios
  searchUsers: async (searchTerm) => {
    try {
      const response = await api.get('/friends/search', {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Enviar solicitud de amistad
  sendFriendRequest: async (friendId) => {
    try {
      const response = await api.post('/friends/request', { friendId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Aceptar solicitud
  acceptRequest: async (friendshipId) => {
    try {
      const response = await api.put(`/friends/request/${friendshipId}/accept`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Rechazar solicitud
  rejectRequest: async (friendshipId) => {
    try {
      const response = await api.delete(`/friends/request/${friendshipId}/reject`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener lista de amigos
  getFriends: async () => {
    try {
      const response = await api.get('/friends');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Obtener solicitudes pendientes
  getPendingRequests: async () => {
    try {
      const response = await api.get('/friends/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  // Eliminar amistad
  removeFriend: async (friendId) => {
    try {
      const response = await api.delete(`/friends/${friendId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },
};

export default api;

