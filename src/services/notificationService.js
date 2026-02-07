import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configuración de cómo se muestran las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


class NotificationService {
  constructor() {
    this.expoPushToken = null;
  }


  async requestPermissions() {
    try {
      if (!Device.isDevice) {
        console.warn('Las notificaciones solo funcionan en dispositivos físicos');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permisos de notificaciones denegados');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al solicitar permisos de notificaciones:', error);
      return false;
    }
  }


  async getExpoPushToken() {
    try {
      if (!Device.isDevice) {
        console.warn('Expo Push Token solo funciona en dispositivos físicos');
        return null;
      }

      // Obtener token sin projectId (solo para desarrollo local)
      const token = await Notifications.getExpoPushTokenAsync();

      this.expoPushToken = token.data;
      console.log('📱 Expo Push Token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Error al obtener Expo Push Token:', error);
      return null;
    }
  }


  async setupNotificationChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('goal-reminders', {
        name: 'Recordatorios de Metas',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2ECC71',
        sound: 'default',
      });
    }
  }


  async scheduleImmediateNotification(title, body, data = {}) {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          channelId: 'goal-reminders',
          seconds: 1, // Inmediato (1 segundo)
        },
      });

      console.log('✅ Notificación programada:', id);
      return id;
    } catch (error) {
      console.error('Error al programar notificación:', error);
      throw error;
    }
  }

  /**
   * Programar notificación diaria a una hora específica
   * @param {string} hour - Hora en formato "HH:MM" (ej: "14:30")
   * @param {string} title - Título de la notificación
   * @param {string} body - Cuerpo de la notificación
   * @param {object} data - Datos adicionales
   * @returns {string} ID de la notificación
   */
  async scheduleDailyNotification(hour, title, body, data = {}) {
    try {
      const [hours, minutes] = hour.split(':').map(Number);

      console.log('Programando notificación diaria:');
      console.log(`   Hora: ${hour}`);
      console.log(`   Título: ${title}`);
      console.log(`   Cuerpo (${body.length} caracteres): ${body}`);
      console.log(`   Data:`, data);

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          channelId: 'goal-reminders',
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });

      console.log(`Notificación diaria programada para ${hour} - ID:`, id);
      return id;
    } catch (error) {
      console.error('Error al programar notificación diaria:', error);
      throw error;
    }
  }

  /**
   * Programar notificación para días específicos de la semana
   * @param {number} weekday - Día de la semana (1=Lunes, 7=Domingo)
   * @param {string} hour - Hora en formato "HH:MM"
   * @param {string} title - Título
   * @param {string} body - Cuerpo
   * @param {object} data - Datos adicionales
   */
  async scheduleWeeklyNotification(weekday, hour, title, body, data = {}) {
    try {
      const [hours, minutes] = hour.split(':').map(Number);

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          channelId: 'goal-reminders',
          weekday,
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });

      console.log(`Notificación semanal programada:`, id);
      return id;
    } catch (error) {
      console.error('Error al programar notificación semanal:', error);
      throw error;
    }
  }


  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notificación cancelada:', notificationId);
    } catch (error) {
      console.error('Error al cancelar notificación:', error);
    }
  }


  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Todas las notificaciones canceladas');
    } catch (error) {
      console.error('Error al cancelar notificaciones:', error);
    }
  }


  async getScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('📋 Notificaciones programadas:', notifications.length);
      return notifications;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return [];
    }
  }

  /**
   * Programar recordatorios para una meta
   * @param {object} goal - Objeto de meta con sus propiedades
   * @param {array} reminderTimes - Array de horas ["14:30", "18:00"]
   * @param {string} motivationalMessage - Mensaje generado por IA
   */
  async scheduleGoalReminders(goal, reminderTimes, motivationalMessage) {
    try {
      const notificationIds = [];

      for (const time of reminderTimes) {
        const title = `Recordatorio: ${goal.name}`;
        const body = motivationalMessage || `Es hora de completar tu meta del día 💪`;

        let notificationId;

        // Si la meta tiene días específicos, programar para esos días
        if (goal.days && goal.days.length > 0) {
          for (const day of goal.days) {
            // day_of_week: 0=Domingo, 1=Lunes... convertir a formato de expo-notifications
            const weekday = day.day === 0 ? 1 : day.day + 1; // Expo usa 1=Domingo, 2=Lunes
            
            notificationId = await this.scheduleWeeklyNotification(
              weekday,
              time,
              title,
              body,
              { goalId: goal.id, type: 'goal-reminder' }
            );
            notificationIds.push(notificationId);
          }
        } else {
          // Programar diariamente
          notificationId = await this.scheduleDailyNotification(
            time,
            title,
            body,
            { goalId: goal.id, type: 'goal-reminder' }
          );
          notificationIds.push(notificationId);
        }
      }

      console.log(`${notificationIds.length} recordatorios programados para "${goal.name}"`);
      return notificationIds;
    } catch (error) {
      console.error('Error al programar recordatorios de meta:', error);
      throw error;
    }
  }


  async initialize() {
    try {
      console.log('Inicializando servicio de notificaciones...');
      
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        console.warn('No se otorgaron permisos de notificaciones');
        return false;
      }

      await this.setupNotificationChannel();
      await this.getExpoPushToken();

      console.log('Servicio de notificaciones inicializado');
      return true;
    } catch (error) {
      console.error('Error al inicializar notificaciones:', error);
      return false;
    }
  }
}

// Exportar instancia única
const notificationService = new NotificationService();
export default notificationService;

// Exportar también las constantes y funciones de Notifications
export { Notifications };
