import React, { createContext, useState, useEffect, useContext } from 'react';
import { friendsAPI } from '../services/api';
import * as Notifications from 'expo-notifications';

const UnreadMessagesContext = createContext();

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error('useUnreadMessages debe usarse dentro de UnreadMessagesProvider');
  }
  return context;
};

export const UnreadMessagesProvider = ({ children }) => {
  const [totalUnread, setTotalUnread] = useState(0);
  const [unreadByFriend, setUnreadByFriend] = useState({});

  useEffect(() => {
    loadUnreadCounts();
    
    // Actualizar cada 15 segundos
    const interval = setInterval(loadUnreadCounts, 15000);
    
    // Listener para notificaciones recibidas
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      if (notification.request.content.data?.type === 'friend_message') {
        loadUnreadCounts();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  const loadUnreadCounts = async () => {
    try {
      const response = await friendsAPI.getUnreadCount();
      if (response.success) {
        setTotalUnread(response.total || 0);
        setUnreadByFriend(response.byFriend || {});
      }
    } catch (error) {
      console.error('Error al cargar mensajes no leídos:', error);
    }
  };

  const clearUnreadForFriend = (friendId) => {
    setUnreadByFriend(prev => {
      const updated = { ...prev };
      delete updated[friendId];
      return updated;
    });
    setTotalUnread(prev => Math.max(0, prev - (unreadByFriend[friendId] || 0)));
  };

  const value = {
    totalUnread,
    unreadByFriend,
    loadUnreadCounts,
    clearUnreadForFriend,
  };

  return (
    <UnreadMessagesContext.Provider value={value}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};
