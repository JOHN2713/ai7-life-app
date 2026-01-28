import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { friendsAPI } from '../services/api';
import { getUserData } from '../services/storage';
import { useUnreadMessages } from '../contexts/UnreadMessagesContext';
import { COLORS } from '../constants/colors';

const ConversationsScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('Usuario');
  const { unreadByFriend, totalUnread, loadUnreadCounts } = useUnreadMessages();

  useEffect(() => {
    loadUserName();
    loadConversations();
    
    // Actualizar cada 10 segundos
    const interval = setInterval(() => {
      loadConversations();
      loadUnreadCounts();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadUserName = async () => {
    try {
      const userData = await getUserData();
      if (userData?.name) {
        setUserName(userData.name);
      }
    } catch (error) {
      console.error('Error al cargar nombre del usuario:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await friendsAPI.getConversations();
      if (response.success) {
        setConversations(response.conversations || []);
      }
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadConversations(), loadUnreadCounts()]);
  };

  const getAvatarSource = (avatarUrl, name) => {
    if (!avatarUrl) {
      return { uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${name}&size=200` };
    }
    return { uri: avatarUrl };
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('es', { day: '2-digit', month: 'short' });
  };

  const truncateMessage = (message, maxLength = 60) => {
    if (!message) return 'Inicia una conversación';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const renderCoachItem = () => (
    <TouchableOpacity
      style={[styles.conversationCard, styles.pinnedCard]}
      onPress={() => navigation.navigate('Chat')}
    >
      <View style={styles.pinnedBadge}>
        <Ionicons name="pin" size={12} color={COLORS.primary} />
      </View>
      
      <View style={styles.avatarContainer}>
        <View style={styles.coachAvatarWrapper}>
          <Ionicons name="sparkles" size={32} color={COLORS.primary} />
        </View>
      </View>

      <View style={styles.conversationInfo}>
        <View style={styles.headerRow}>
          <Text style={styles.conversationName}>AI7 Coach</Text>
          <View style={styles.coachBadgeSmall}>
            <Ionicons name="flash" size={10} color={COLORS.warning} />
            <Text style={styles.coachBadgeText}>IA</Text>
          </View>
        </View>
        <Text style={styles.conversationMessage}>
          Tu asistente personal de metas y bienestar
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  const renderConversationItem = ({ item }) => {
    const unreadCount = unreadByFriend[item.friend_id] || 0;
    const hasUnread = unreadCount > 0;

    return (
      <TouchableOpacity
        style={[styles.conversationCard, hasUnread && styles.unreadCard]}
        onPress={() => navigation.navigate('FriendChat', { 
          friend: {
            id: item.friend_id,
            name: item.name,
            email: item.email,
            avatar_url: item.avatar_url
          }
        })}
      >
        <View style={styles.avatarContainer}>
          <Image 
            source={getAvatarSource(item.avatar_url, item.name)} 
            style={styles.avatar} 
          />
          {hasUnread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.conversationInfo}>
          <View style={styles.headerRow}>
            <Text style={[styles.conversationName, hasUnread && styles.unreadName]}>
              {item.name}
            </Text>
            {item.last_message_time && (
              <Text style={[styles.timeText, hasUnread && styles.unreadTime]}>
                {formatTime(item.last_message_time)}
              </Text>
            )}
          </View>
          
          <View style={styles.messageRow}>
            {item.last_message && (
              <>
                {item.is_sent && (
                  <Ionicons 
                    name="checkmark-done" 
                    size={16} 
                    color={hasUnread ? COLORS.textSecondary : COLORS.success} 
                    style={styles.sentIcon}
                  />
                )}
                <Text 
                  style={[
                    styles.conversationMessage, 
                    hasUnread && styles.unreadMessage,
                    item.is_sent && styles.sentMessage
                  ]}
                  numberOfLines={2}
                >
                  {item.is_sent ? 'Tú: ' : ''}{truncateMessage(item.last_message)}
                </Text>
              </>
            )}
            {!item.last_message && (
              <Text style={styles.noMessagesText}>
                Inicia una conversación
              </Text>
            )}
          </View>
        </View>

        {hasUnread && (
          <View style={styles.unreadIndicator} />
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={80} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No hay conversaciones</Text>
      <Text style={styles.emptyText}>
        Ve a Amigos para buscar usuarios{'\n'}y empezar a chatear
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Friends')}
      >
        <Ionicons name="people" size={20} color={COLORS.white} />
        <Text style={styles.emptyButtonText}>Buscar Amigos</Text>
      </TouchableOpacity>
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
        <View>
          <Text style={styles.greeting}>Hola, {userName} 👋</Text>
          <Text style={styles.headerTitle}>Mensajes</Text>
        </View>
        {totalUnread > 0 && (
          <View style={styles.totalUnreadBadge}>
            <Text style={styles.totalUnreadText}>{totalUnread}</Text>
          </View>
        )}
      </View>

      {/* Lista de conversaciones */}
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.friend_id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderCoachItem}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  totalUnreadBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  totalUnreadText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pinnedCard: {
    backgroundColor: COLORS.primaryLight,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    position: 'relative',
  },
  pinnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCard: {
    backgroundColor: '#F8F9FF',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  coachAvatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  unreadBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  conversationInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  unreadName: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  coachBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  coachBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.warning,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  unreadTime: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentIcon: {
    marginRight: 4,
  },
  conversationMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  unreadMessage: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  sentMessage: {
    fontStyle: 'italic',
  },
  noMessagesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConversationsScreen;
