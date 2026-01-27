// src/services/walkApiService.js
import { goalsAPI } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const walkAPI = {
  /**
   * Guardar actividad de caminata
   */
  saveWalkActivity: async (activityData) => {
    try {
      console.log('Guardando caminata:', activityData);
      
      // Si tenemos goal_id, marcamos como completada con datos extra
      if (activityData.goal_id) {
        const notes = `🏃 Caminata completada:\n` +
                      `📏 Distancia: ${activityData.distance_km} km\n` +
                      `👣 Pasos: ${activityData.steps}\n` +
                      `⏱️ Duración: ${activityData.duration_minutes} min\n` +
                      `🔥 Calorías: ${activityData.calories_burned}`;
        
        const result = await goalsAPI.completeGoal(
          activityData.goal_id,
          new Date().toISOString(),
          notes
        );
        
        // También podemos guardar los datos detallados en custom_data
        await goalsAPI.updateGoal(activityData.goal_id, {
          custom_data: {
            ...activityData,
            activity_type: 'walking',
            completed_with_tracking: true
          }
        });
        
        return result;
      } else {
        // Si no hay goal_id, creamos una nueva meta de caminata
        const goalData = {
          name: `Caminata ${new Date().toLocaleDateString()}`,
          description: `Caminata de ${activityData.distance_km} km`,
          type: 'walking',
          category: 'health',
          target_value: activityData.distance_km,
          target_unit: 'km',
          start_date: activityData.startTime,
          end_date: activityData.endTime,
          color: '#4CAF50',
          icon: 'walk',
          custom_data: activityData
        };
        
        return await goalsAPI.createGoal(goalData);
      }
    } catch (error) {
      console.error('Error al guardar caminata en backend:', error);
      throw error;
    }
  },

  /**
   * Guardar localmente (offline)
   */
  saveWalkLocally: async (walkData) => {
    try {
      const pendingWalks = await AsyncStorage.getItem('@ai7life:pending_walks');
      const walks = pendingWalks ? JSON.parse(pendingWalks) : [];
      
      walks.push({
        ...walkData,
        saved_at: new Date().toISOString(),
        synced: false
      });
      
      await AsyncStorage.setItem('@ai7life:pending_walks', JSON.stringify(walks));
      console.log('Caminata guardada localmente:', walks.length);
      return true;
    } catch (error) {
      console.error('Error al guardar localmente:', error);
      return false;
    }
  },

  /**
   * Sincronizar caminatas pendientes
   */
  syncPendingWalks: async () => {
    try {
      const pendingWalks = await AsyncStorage.getItem('@ai7life:pending_walks');
      if (!pendingWalks) return { success: 0, failed: 0 };
      
      const walks = JSON.parse(pendingWalks);
      const synced = [];
      const failed = [];
      
      for (const walk of walks) {
        if (!walk.synced) {
          try {
            await walkAPI.saveWalkActivity(walk);
            walk.synced = true;
            synced.push(walk);
          } catch (error) {
            failed.push(walk);
          }
        }
      }
      
      // Guardar solo las falladas
      await AsyncStorage.setItem('@ai7life:pending_walks', JSON.stringify(failed));
      
      return {
        success: synced.length,
        failed: failed.length
      };
    } catch (error) {
      console.error('Error sincronizando:', error);
      return { success: 0, failed: 0 };
    }
  },

  /**
   * Verificar si es una meta de caminar
   */
  isWalkingGoal: (goal) => {
    return (
      goal.type === 'walking' ||
      goal.category === 'exercise' ||
      goal.icon === 'walk' ||
      goal.name.toLowerCase().includes('caminar') ||
      goal.name.toLowerCase().includes('pasos') ||
      (goal.custom_data && goal.custom_data.activity_type === 'walking')
    );
  }
};