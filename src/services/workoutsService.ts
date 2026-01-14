// src/services/workoutsService.ts
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { database } from '../config/firebase';

export const saveWorkout = async (
  distanceKm: number, 
  durationSeconds: number, 
  routeCoords: any[], 
  steps: number, // PASOS REALES
  linkedGoalId?: string 
) => {
  try {
    // 1. Guardar Log en 'workouts'
    const workoutData = {
      type: 'activity',
      distanceKm,
      durationSeconds,
      steps: steps || 0, // Asegurar que no sea undefined
      route: routeCoords,
      date: serverTimestamp(),
      linkedGoalId: linkedGoalId || null
    };

    await addDoc(collection(database, 'workouts'), workoutData);

    // 2. ACTUALIZAR META VINCULADA
    if (linkedGoalId) {
      await updateLinkedGoal(linkedGoalId, distanceKm, steps, durationSeconds);
    }

    return { success: true };
  } catch (error) {
    console.error("Error guardando workout:", error);
    return { success: false, error };
  }
};

const updateLinkedGoal = async (goalId: string, km: number, steps: number, seconds: number) => {
  try {
    const goalRef = doc(database, 'goals', goalId);
    const goalSnap = await getDoc(goalRef);

    if (goalSnap.exists()) {
      const goalData = goalSnap.data();
      let incrementValue = 0;

      // LÓGICA DE ACTUALIZACIÓN
      if (goalData.unit === 'pasos') {
        incrementValue = steps; // Usa los pasos directos del sensor
        // FALLBACK: Si no hay sensor (simulador), usa estimación
        if (steps === 0 && km > 0) incrementValue = Math.round(km * 1300);
      } 
      else if (goalData.unit === 'km') {
        incrementValue = km;
      }
      else if (goalData.unit === 'min') {
        incrementValue = Math.round(seconds / 60);
      }
      else if (goalData.unit === 'veces') {
        incrementValue = 1; 
      }

      if (incrementValue > 0) {
        await updateDoc(goalRef, {
          progress: increment(incrementValue)
        });
      }
    }
  } catch (error) {
    console.error("Error actualizando meta:", error);
  }
};