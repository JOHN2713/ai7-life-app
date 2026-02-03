import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { remindersAPI } from '../services/api';
import notificationService from '../services/notificationService';
import { getUserData } from '../services/storage';

export default function GoalRemindersScreen({ route, navigation }) {
  const { goalId, goalName } = route.params;

  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminderTime, setNewReminderTime] = useState('');
  const [messageType, setMessageType] = useState('motivacion');
  const [generating, setGenerating] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserData();
    loadReminders();
    initializeNotifications();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getUserData();
      if (userData?.name) {
        setUserName(userData.name);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  const initializeNotifications = async () => {
    try {
      await notificationService.initialize();
    } catch (error) {
      console.error('Error al inicializar notificaciones:', error);
    }
  };

  const loadReminders = async () => {
    try {
      setLoading(true);
      const response = await remindersAPI.getGoalReminders(goalId);
      if (response.success) {
        setReminders(response.reminders);
      }
    } catch (error) {
      console.error('Error al cargar recordatorios:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePreviewMessage = async () => {
    try {
      setGenerating(true);
      const response = await remindersAPI.generateMotivationalMessage(
        goalName,
        messageType,
        userName
      );
      
      if (response.success) {
        setPreviewMessage(response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el mensaje');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddReminder = async () => {
    // Validar formato de hora
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newReminderTime)) {
      Alert.alert('Error', 'Formato de hora inválido. Use HH:MM (ej: 14:30)');
      return;
    }

    try {
      setLoading(true);

      // Generar mensaje motivacional (esperar a que termine)
      let generatedMessage = '';
      try {
        const messageResponse = await remindersAPI.generateMotivationalMessage(
          goalName,
          messageType,
          userName
        );
        generatedMessage = messageResponse.message;
        console.log('Mensaje generado completo:', generatedMessage);
      } catch (error) {
        console.warn('Error al generar mensaje, se usará predefinido en el backend');
      }

      // Crear recordatorio en backend con el mensaje generado
      const response = await remindersAPI.createReminder(
        goalId, 
        newReminderTime, 
        true,
        generatedMessage,
        messageType
      );

      if (response.success) {
        const finalMessage = response.reminder.message || generatedMessage || '¡Es hora de cumplir tu meta! 💪';
        
        console.log('Programando notificación con mensaje:', finalMessage);

        // Programar notificación local con el mensaje completo
        await notificationService.scheduleDailyNotification(
          newReminderTime,
          `${goalName}`, // Título corto
          finalMessage,  // Mensaje completo en el body
          { goalId, reminderId: response.reminder.id, type: 'goal-reminder' }
        );

        Alert.alert(
          '¡Éxito!', 
          `Recordatorio creado correctamente.\n\nMensaje: ${finalMessage.substring(0, 100)}${finalMessage.length > 100 ? '...' : ''}`
        );
        setShowAddModal(false);
        setNewReminderTime('');
        setPreviewMessage('');
        loadReminders();
      }
    } catch (error) {
      console.error('Error completo:', error);
      Alert.alert('Error', error.error || 'No se pudo crear el recordatorio');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReminder = async (reminder) => {
    try {
      const newStatus = !reminder.is_active;
      const response = await remindersAPI.updateReminder(reminder.id, {
        isActive: newStatus,
      });

      if (response.success) {
        loadReminders();
        Alert.alert(
          'Actualizado',
          `Recordatorio ${newStatus ? 'activado' : 'desactivado'}`
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el recordatorio');
    }
  };

  const handleDeleteReminder = (reminder) => {
    Alert.alert(
      'Eliminar Recordatorio',
      '¿Estás seguro de eliminar este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await remindersAPI.deleteReminder(reminder.id);
              // Cancelar notificación programada
              // Nota: necesitarías guardar el notificationId para cancelarlo
              Alert.alert('Éxito', 'Recordatorio eliminado');
              loadReminders();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el recordatorio');
            }
          },
        },
      ]
    );
  };

  const MESSAGE_TYPES = [
    { value: 'motivacion', label: '💪 Motivación', icon: 'flash' },
    { value: 'recordatorio', label: '⏰ Recordatorio', icon: 'notifications' },
    { value: 'alerta', label: '⚡ Alerta', icon: 'warning' },
    { value: 'animo', label: '🌟 Ánimo', icon: 'heart' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Ionicons name="notifications" size={32} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Recordatorios</Text>
          <Text style={styles.headerSubtitle}>{goalName}</Text>
        </View>

        {/* Botón para agregar recordatorio */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle" size={24} color={COLORS.white} />
          <Text style={styles.addButtonText}>Agregar Recordatorio</Text>
        </TouchableOpacity>

        {/* Lista de recordatorios */}
        {loading && reminders.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : reminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={64} color={COLORS.gray} />
            <Text style={styles.emptyText}>No hay recordatorios configurados</Text>
            <Text style={styles.emptySubtext}>
              Agrega recordatorios para recibir notificaciones
            </Text>
          </View>
        ) : (
          <View style={styles.remindersList}>
            {reminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderCard}>
                <View style={styles.reminderLeft}>
                  <View style={styles.reminderIcon}>
                    <Ionicons name="time" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.reminderInfo}>
                    <Text style={styles.reminderTime}>{reminder.reminder_time}</Text>
                    <Text style={styles.reminderLabel}>
                      {reminder.is_active ? 'Activo' : 'Pausado'}
                    </Text>
                  </View>
                </View>

                <View style={styles.reminderActions}>
                  <Switch
                    value={reminder.is_active}
                    onValueChange={() => handleToggleReminder(reminder)}
                    trackColor={{ false: COLORS.lightGray, true: COLORS.primary + '50' }}
                    thumbColor={reminder.is_active ? COLORS.primary : COLORS.gray}
                  />
                  <TouchableOpacity
                    onPress={() => handleDeleteReminder(reminder)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Información sobre las notificaciones */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Los mensajes de las notificaciones son generados con IA para motivarte de forma personalizada 🤖✨
          </Text>
        </View>
      </ScrollView>

      {/* Modal para agregar recordatorio */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Recordatorio</Text>

            {/* Input de hora */}
            <Text style={styles.inputLabel}>Hora del recordatorio</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="HH:MM (ej: 14:30)"
              value={newReminderTime}
              onChangeText={setNewReminderTime}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />

            {/* Tipo de mensaje */}
            <Text style={styles.inputLabel}>Tipo de mensaje</Text>
            <View style={styles.messageTypeContainer}>
              {MESSAGE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.messageTypeButton,
                    messageType === type.value && styles.messageTypeButtonActive,
                  ]}
                  onPress={() => {
                    setMessageType(type.value);
                    setPreviewMessage('');
                  }}
                >
                  <Text
                    style={[
                      styles.messageTypeText,
                      messageType === type.value && styles.messageTypeTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Vista previa del mensaje */}
            <TouchableOpacity
              style={styles.previewButton}
              onPress={generatePreviewMessage}
              disabled={generating}
            >
              <Ionicons name="eye" size={20} color={COLORS.white} />
              <Text style={styles.previewButtonText}>
                {generating ? 'Generando...' : 'Vista Previa del Mensaje'}
              </Text>
            </TouchableOpacity>

            {previewMessage ? (
              <View style={styles.previewCard}>
                <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
                <Text style={styles.previewMessage}>{previewMessage}</Text>
              </View>
            ) : null}

            {/* Botones */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => {
                  setShowAddModal(false);
                  setNewReminderTime('');
                  setPreviewMessage('');
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleAddReminder}
                disabled={!newReminderTime || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.modalButtonTextConfirm}>Crear</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  headerInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary + '10',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    textAlign: 'center',
  },
  remindersList: {
    paddingHorizontal: 20,
  },
  reminderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTime: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  reminderLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 100,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
    marginLeft: 12,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
    marginTop: 12,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.black,
  },
  messageTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  messageTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  messageTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  messageTypeText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  messageTypeTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary + '30',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  previewButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  previewCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  previewMessage: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
    marginLeft: 12,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButtonCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
  },
  modalButtonConfirm: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});
