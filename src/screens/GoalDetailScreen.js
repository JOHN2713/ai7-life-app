import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';
import { goalsAPI } from '../services/api';

const GOAL_ICONS = {
  water: 'water',
  walk: 'walk',
  fitness: 'fitness',
  book: 'book',
  tooth: 'fitness-outline',
  meditation: 'flower',
  study: 'school',
  sleep: 'moon',
  default: 'flag',
};

export default function GoalDetailScreen({ route, navigation }) {
  const { goalId } = route.params;
  
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [history, setHistory] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadGoalDetails();
    loadHistory();
  }, []);

  const loadGoalDetails = async () => {
    try {
      setLoading(true);
      const response = await goalsAPI.getGoalById(goalId);
      setGoal(response.goal);
      setEditedName(response.goal.name);
      setEditedDescription(response.goal.description || '');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la meta');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await goalsAPI.getGoalHistory(goalId);
      setHistory(response.history || []);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await goalsAPI.updateGoal(goalId, {
        name: editedName,
        description: editedDescription,
      });
      setIsEditing(false);
      loadGoalDetails();
      Alert.alert('¡Éxito!', 'Meta actualizada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la meta');
    }
  };

  const handleDelete = async () => {
    try {
      await goalsAPI.deleteGoal(goalId);
      Alert.alert('¡Éxito!', 'Meta eliminada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la meta');
    }
  };

  const handleToggleActive = async () => {
    try {
      await goalsAPI.updateGoal(goalId, {
        is_active: !goal.is_active,
      });
      loadGoalDetails();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  const handleCompleteToday = async () => {
    try {
      await goalsAPI.completeGoal(goalId);
      loadGoalDetails();
      loadHistory();
      Alert.alert('¡Bien hecho!', 'Meta completada para hoy');
    } catch (error) {
      Alert.alert('Error', error.error || 'No se pudo completar la meta');
    }
  };

  const handleUncompleteDate = async (date) => {
    try {
      await goalsAPI.uncompleteGoal(goalId, date);
      loadHistory();
      loadGoalDetails();
    } catch (error) {
      Alert.alert('Error', 'No se pudo desmarcar');
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!goal) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={goal.color} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: goal.color }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles de Meta</Text>
        <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
          <Ionicons name="trash-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tarjeta Principal */}
        <View style={[styles.mainCard, { backgroundColor: goal.color }]}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={GOAL_ICONS[goal.icon] || 'flag'}
              size={48}
              color={COLORS.white}
            />
          </View>

          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Nombre de la meta"
                placeholderTextColor="rgba(255,255,255,0.7)"
              />
              <TextInput
                style={[styles.editInput, styles.editTextArea]}
                value={editedDescription}
                onChangeText={setEditedDescription}
                placeholder="Descripción"
                placeholderTextColor="rgba(255,255,255,0.7)"
                multiline
                numberOfLines={3}
              />
            </View>
          ) : (
            <>
              <Text style={styles.goalName}>{goal.name}</Text>
              {goal.description && (
                <Text style={styles.goalDescription}>{goal.description}</Text>
              )}
            </>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{goal.duration_days}</Text>
              <Text style={styles.statLabel}>Días totales</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{goal.total_completed_days || 0}</Text>
              <Text style={styles.statLabel}>Completados</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {goal.progress || 0}%
              </Text>
              <Text style={styles.statLabel}>Progreso</Text>
            </View>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionsContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSaveEdit}
              >
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setIsEditing(false);
                  setEditedName(goal.name);
                  setEditedDescription(goal.description || '');
                }}
              >
                <Ionicons name="close-circle" size={20} color={COLORS.gray} />
                <Text style={styles.actionButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleToggleActive}
              >
                <Ionicons 
                  name={goal.is_active ? "pause-circle-outline" : "play-circle-outline"} 
                  size={20} 
                  color={goal.is_active ? COLORS.warning : COLORS.success} 
                />
                <Text style={styles.actionButtonText}>
                  {goal.is_active ? 'Pausar' : 'Activar'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Botón Completar Hoy */}
        {goal.is_active && (
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: goal.color }]}
            onPress={handleCompleteToday}
          >
            <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
            <Text style={styles.completeButtonText}>Completar Hoy</Text>
          </TouchableOpacity>
        )}

        {/* Botón de Recordatorios */}
        <TouchableOpacity
          style={styles.remindersButton}
          onPress={() => navigation.navigate('GoalReminders', { 
            goalId: goal.id, 
            goalName: goal.name 
          })}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
          <Text style={styles.remindersButtonText}>Gestionar Recordatorios</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>

        {/* Historial */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Historial de Cumplimiento</Text>
          
          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.gray} />
              <Text style={styles.emptyHistoryText}>
                Aún no has completado esta meta
              </Text>
            </View>
          ) : (
            history.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyItemLeft}>
                  <Ionicons name="checkmark-circle" size={24} color={goal.color} />
                  <View style={styles.historyItemInfo}>
                    <Text style={styles.historyItemDate}>
                      {new Date(item.completion_date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                    {item.notes && (
                      <Text style={styles.historyItemNotes}>{item.notes}</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleUncompleteDate(item.completion_date)}
                >
                  <Ionicons name="close-circle-outline" size={24} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={48} color={COLORS.warning} />
            <Text style={styles.modalTitle}>¿Eliminar meta?</Text>
            <Text style={styles.modalText}>
              Esta acción no se puede deshacer. Se eliminará la meta y todo su historial.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonDelete}
                onPress={() => {
                  setShowDeleteModal(false);
                  handleDelete();
                }}
              >
                <Text style={styles.modalButtonDeleteText}>Eliminar</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainCard: {
    borderRadius: 20,
    padding: 24,
    marginTop: -20,
    marginBottom: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  goalName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  goalDescription: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 24,
  },
  editContainer: {
    width: '100%',
    marginBottom: 16,
  },
  editInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 12,
  },
  editTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    color: COLORS.white,
  },
  statLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.white,
    opacity: 0.3,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: 8,
  },
  actionButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: COLORS.black,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
  },
  completeButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.white,
  },
  remindersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginBottom: 24,
  },
  remindersButtonText: {
    flex: 1,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 12,
  },
  historySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 16,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  historyItemInfo: {
    flex: 1,
  },
  historyItemDate: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: COLORS.black,
    textTransform: 'capitalize',
  },
  historyItemNotes: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: COLORS.black,
  },
  modalButtonDelete: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    alignItems: 'center',
  },
  modalButtonDeleteText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: COLORS.white,
  },
});
