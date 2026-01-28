import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { friendsAPI } from '../services/api';
import { getUserData } from '../services/storage';
import { COLORS } from '../constants/colors';

const FriendChatScreen = ({ route, navigation }) => {
  const { friend } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const flatListRef = useRef(null);
  const notifiedMessageIds = useRef(new Set());
  const appState = useRef(AppState.currentState);
  const [isScreenActive, setIsScreenActive] = useState(true);

  useEffect(() => {
    loadCurrentUser();
    loadMessages();
    
    // Marcar la pantalla como activa
    setIsScreenActive(true);
    
    // Actualizar cada 5 segundos
    const interval = setInterval(checkNewMessages, 5000);
    
    // Listener del estado de la app
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });
    
    // Cleanup
    return () => {
      clearInterval(interval);
      subscription.remove();
      setIsScreenActive(false);
    };
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await getUserData();
      setCurrentUserId(userData?.id);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await friendsAPI.getConversation(friend.id);
      if (response.success) {
        const newMessages = response.messages || [];
        setMessages(newMessages);
        setLastMessageCount(newMessages.length);
        
        // Agregar todos los mensajes actuales al Set de notificados
        // para evitar notificar mensajes viejos
        newMessages.forEach(msg => {
          notifiedMessageIds.current.add(msg.id);
        });
        
        // Marcar como leídos
        await friendsAPI.markAsRead(friend.id);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkNewMessages = async () => {
    try {
      const response = await friendsAPI.getConversation(friend.id);
      if (response.success) {
        const newMessages = response.messages || [];
        
        // Si hay mensajes nuevos
        if (newMessages.length > lastMessageCount) {
          const newestMessages = newMessages.slice(lastMessageCount);
          
          // Notificar solo los mensajes del amigo (no los propios)
          const friendMessages = newestMessages.filter(msg => msg.sender_id !== currentUserId);
          
          if (friendMessages.length > 0) {
            for (const msg of friendMessages) {
              // Verificar si este mensaje ya fue notificado
              if (!notifiedMessageIds.current.has(msg.id)) {
                console.log('📬 Enviando notificación para mensaje:', msg.id);
                
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: `💬 ${friend.name}`,
                    body: msg.message,
                    data: { 
                      type: 'friend_message',
                      friendId: friend.id,
                      friendName: friend.name,
                      messageId: msg.id
                    },
                    sound: 'default',
                  },
                  trigger: null, // Inmediato
                });
                
                // Marcar como notificado
                notifiedMessageIds.current.add(msg.id);
              } else {
                console.log('⏭️ Mensaje ya notificado:', msg.id);
              }
            }
          }
        }
        
        setMessages(newMessages);
        setLastMessageCount(newMessages.length);
        
        // Marcar como leídos solo si estamos viendo el chat activamente
        if (isScreenActive && appState.current === 'active') {
          await friendsAPI.markAsRead(friend.id);
        }
      }
    } catch (error) {
      console.error('Error al verificar nuevos mensajes:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || sending) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const response = await friendsAPI.sendMessage(friend.id, messageText);
      if (response.success) {
        // Agregar mensaje localmente
        setMessages(prev => [...prev, response.message]);
        // Scroll al final
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      Alert.alert('Error', error.error || 'No se pudo enviar el mensaje');
      setInputText(messageText); // Restaurar texto
    } finally {
      setSending(false);
    }
  };

  const getAvatarSource = (avatarUrl) => {
    if (!avatarUrl) {
      return { uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${friend.name}&size=200` };
    }
    return { uri: avatarUrl };
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('es', { day: '2-digit', month: 'short' });
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender_id === currentUserId;
    
    return (
      <View style={[
        styles.messageContainer,
        isMe ? styles.myMessageContainer : styles.theirMessageContainer
      ]}>
        {!isMe && (
          <Image 
            source={getAvatarSource(item.sender_avatar)} 
            style={styles.messageAvatar} 
          />
        )}
        <View style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.theirMessage
        ]}>
          <Text style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.theirMessageText
          ]}>
            {item.message}
          </Text>
          <Text style={[
            styles.messageTime,
            isMe ? styles.myMessageTime : styles.theirMessageTime
          ]}>
            {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>
        Inicia una conversación con {friend.name}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Image source={getAvatarSource(friend.avatar_url)} style={styles.headerAvatar} />
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{friend.name}</Text>
          <Text style={styles.headerEmail}>{friend.email}</Text>
        </View>

        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => Alert.alert('Opciones', 'Próximamente...')}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Mensajes */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={renderEmptyState}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
        />

        {/* Input de mensaje */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Ionicons name="send" size={20} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  headerEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  headerButton: {
    padding: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  myMessage: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  myMessageText: {
    color: COLORS.white,
  },
  theirMessageText: {
    color: COLORS.textPrimary,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  theirMessageTime: {
    color: COLORS.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.5,
  },
});

export default FriendChatScreen;
