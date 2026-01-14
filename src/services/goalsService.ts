// src/services/goalsService.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { database } from '../config/firebase'; // Importamos la conexión que creamos antes

// Definimos qué forma tiene una Meta para TypeScript
export interface GoalData {
  title: string;       // Ej: Hidratación
  targetValue: number; // Ej: 8
  unit: string;        // Ej: vasos
  durationDays: number;// Ej: 21
  goalName: string;    // Ej: Reto Verano
  icon: string;        // Ej: water
  color: string;       // Ej: #56CCF2
  status: 'active' | 'completed' | 'abandoned';
}

// Función para guardar en Firestore
export const saveNewGoal = async (goal: GoalData) => {
  try {
    // Referencia a la colección 'goals' en tu base de datos
    const docRef = await addDoc(collection(database, 'goals'), {
      ...goal,
      createdAt: serverTimestamp(), // Firebase pone la fecha del servidor automáticamente
      progress: 0, // Empezamos en 0
    });
    
    console.log("Meta guardada con ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error guardando meta: ", error);
    return { success: false, error };
  }
};
// --- AÑADIR ESTO AL FINAL DE src/services/goalsService.ts ---

import { getDocs, query, where, updateDoc, doc, increment } from 'firebase/firestore';

// 1. Función para LEER las metas activas
export const getActiveGoals = async () => {
  try {
    // Pedimos solo las que tienen status 'active'
    const q = query(collection(database, 'goals'), where("status", "==", "active"));
    const querySnapshot = await getDocs(q);
    
    // Transformamos los datos de Firebase a nuestro formato
    const goalsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return goalsList as (GoalData & { id: string, progress: number })[];
  } catch (error) {
    console.error("Error trayendo metas:", error);
    return [];
  }
};

// 2. Función para ACTUALIZAR el progreso (ej: beber un vaso)
export const updateGoalProgress = async (goalId: string, incrementValue: number) => {
  try {
    const goalRef = doc(database, 'goals', goalId);
    await updateDoc(goalRef, {
      progress: increment(incrementValue) // Incrementa atómicamente en la base de datos
    });
    return true;
  } catch (error) {
    console.error("Error actualizando progreso:", error);
    return false;
  }
};