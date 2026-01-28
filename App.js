import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import notificationService from './src/services/notificationService';
import { UnreadMessagesProvider } from './src/contexts/UnreadMessagesContext';

export default function App() {
  useEffect(() => {
    // Inicializar el servicio de notificaciones al arrancar la app
    const initNotifications = async () => {
      try {
        await notificationService.initialize();
        console.log('✅ Sistema de notificaciones inicializado');
      } catch (error) {
        console.error('⚠️ Error al inicializar notificaciones:', error);
      }
    };

    initNotifications();
  }, []);

  return (
    <UnreadMessagesProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </UnreadMessagesProvider>
  );
}
