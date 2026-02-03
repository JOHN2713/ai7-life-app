import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { friendsAPI } from '../services/api';
import { COLORS } from '../constants/colors';
import * as Notifications from 'expo-notifications';
import { useUnreadMessages } from '../contexts/UnreadMessagesContext';

const FriendsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('friends'); // friends, requests, search
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { unreadByFriend, loadUnreadCounts } = useUnreadMessages();

  useEffect(() => {
    loadInitialData();
    
    // Listener para cuando se recibe una notificación
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      if (notification.request.content.data?.type === 'friend_message') {
        loadUnreadCounts();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadFriends(), loadRequests()]);
      loadUnreadCounts(); // Cargar también los conteos
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const response = await friendsAPI.getFriends();
      if (response.success) {
        setFriends(response.friends || []);
      }
    } catch (error) {
      console.error('Error al cargar amigos:', error);
      Alert.alert('Error', 'No se pudieron cargar los amigos');
    }
  };

  const loadRequests = async () => {
    try {
      const response = await friendsAPI.getPendingRequests();
      if (response.success) {
        setRequests(response.requests || []);
      }
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    }
  };

  const handleSearch = async (text) => {
    setSearchQuery(text);
    
    if (text.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      console.log('Buscando usuarios con término:', text);
      const response = await friendsAPI.searchUsers(text);
      console.log('Respuesta de búsqueda:', response);
      
      if (response.success) {
        console.log('Usuarios encontrados:', response.users?.length || 0);
        setSearchResults(response.users || []);
      } else {
        console.log('Búsqueda sin éxito:', response);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      console.error('Error detalles:', error.response?.data || error.message);
      setSearchResults([]);
      Alert.alert('Error', 'No se pudo realizar la búsqueda. Verifica tu conexión.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendRequest = async (friendId) => {
    try {
      const response = await friendsAPI.sendFriendRequest(friendId);
      if (response.success) {
        Alert.alert('¡Listo!', 'Solicitud de amistad enviada');
        // Actualizar resultados de búsqueda
        await handleSearch(searchQuery);
      }
    } catch (error) {
      Alert.alert('Error', error.error || 'No se pudo enviar la solicitud');
    }
  };

  const handleAcceptRequest = async (friendshipId) => {
    try {
      const response = await friendsAPI.acceptRequest(friendshipId);
      if (response.success) {
        Alert.alert('¡Genial!', 'Ahora son amigos');
        await Promise.all([loadFriends(), loadRequests()]);
        setActiveTab('friends');
      }
    } catch (error) {
      Alert.alert('Error', error.error || 'No se pudo aceptar la solicitud');
    }
  };

  const handleRejectRequest = async (friendshipId) => {
    try {
      const response = await friendsAPI.rejectRequest(friendshipId);
      if (response.success) {
        await loadRequests();
      }
    } catch (error) {
      Alert.alert('Error', error.error || 'No se pudo rechazar la solicitud');
    }
  };

  const handleRemoveFriend = async (friendId, friendName) => {
    Alert.alert(
      'Eliminar amigo',
      `¿Estás seguro de eliminar a ${friendName} de tus amigos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await friendsAPI.removeFriend(friendId);
              if (response.success) {
                await loadFriends();
              }
            } catch (error) {
              Alert.alert('Error', error.error || 'No se pudo eliminar al amigo');
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const getAvatarSource = (avatarUrl) => {
    if (!avatarUrl) {
      return { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=default&size=200' };
    }
    return { uri: avatarUrl };
  };

  const getActionButton = (user) => {
    switch (user.friendship_status) {
      case 'friend':
        return (
          <Text style={styles.friendBadge}>Amigos</Text>
        );
      case 'request_sent':
        return (
          <Text style={styles.pendingBadge}>Pendiente</Text>
        );
      case 'request_received':
        return (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptRequest(user.friendship_id)}
          >
            <Text style={styles.acceptButtonText}>Aceptar</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleSendRequest(user.id)}
          >
            <Ionicons name="person-add" size={20} color={COLORS.white} />
          </TouchableOpacity>
        );
    }
  };

  const renderFriendItem = ({ item }) => {
    const unreadCount = unreadByFriend[item.id] || 0;
    
    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => {
          // Navegar al chat con el amigo
          navigation.navigate('FriendChat', { friend: item });
        }}
        onLongPress={() => handleRemoveFriend(item.id, item.name)}
      >
        <View style={styles.avatarContainer}>
          <Image source={getAvatarSource(item.avatar_url)} style={styles.avatar} />
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.friendsSince}>
            Amigos desde {new Date(item.friends_since).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.chatIconContainer}>
          <Ionicons name="chatbubble-outline" size={24} color={COLORS.primary} />
          {unreadCount > 0 && (
            <View style={styles.unreadDot} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.userCard}>
      <Image source={getAvatarSource(item.avatar_url)} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.requestDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleRejectRequest(item.friendship_id)}
        >
          <Ionicons name="close" size={24} color={COLORS.error} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptButtonRound}
          onPress={() => handleAcceptRequest(item.friendship_id)}
        >
          <Ionicons name="checkmark" size={24} color={COLORS.success} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchItem = ({ item }) => (
    <View style={styles.userCard}>
      <Image source={getAvatarSource(item.avatar_url)} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      {getActionButton(item)}
    </View>
  );

  const renderEmptyState = () => {
    let message = '';
    let icon = '';

    switch (activeTab) {
      case 'friends':
        message = 'Aún no tienes amigos.\n¡Busca usuarios y envía solicitudes!';
        icon = 'people-outline';
        break;
      case 'requests':
        message = 'No tienes solicitudes pendientes';
        icon = 'notifications-outline';
        break;
      case 'search':
        message = searchQuery.length < 2
          ? 'Escribe al menos 2 caracteres para buscar'
          : 'No se encontraron usuarios';
        icon = 'search-outline';
        break;
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons name={icon} size={64} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>{message}</Text>
      </View>
    );
  };

  const renderTabContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    switch (activeTab) {
      case 'friends':
        return (
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyState}
          />
        );

      case 'requests':
        return (
          <FlatList
            data={requests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item.friendship_id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyState}
          />
        );

      case 'search':
        return (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons
                name="search"
                size={20}
                color={COLORS.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre o email..."
                value={searchQuery}
                onChangeText={handleSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {searchLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : (
              <FlatList
                data={searchResults}
                renderItem={renderSearchItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con tabs */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Amigos</Text>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
            onPress={() => setActiveTab('friends')}
          >
            <Ionicons
              name="people"
              size={20}
              color={activeTab === 'friends' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'friends' && styles.activeTabText,
              ]}
            >
              Mis Amigos
            </Text>
            {friends.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{friends.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
            onPress={() => setActiveTab('requests')}
          >
            <Ionicons
              name="notifications"
              size={20}
              color={activeTab === 'requests' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'requests' && styles.activeTabText,
              ]}
            >
              Solicitudes
            </Text>
            {requests.length > 0 && (
              <View style={[styles.badge, styles.badgeAlert]}>
                <Text style={styles.badgeText}>{requests.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'search' && styles.activeTab]}
            onPress={() => setActiveTab('search')}
          >
            <Ionicons
              name="search"
              size={20}
              color={activeTab === 'search' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'search' && styles.activeTabText,
              ]}
            >
              Buscar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido del tab activo */}
      {renderTabContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeAlert: {
    backgroundColor: COLORS.error,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  friendsSince: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  requestDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButtonRound: {
    backgroundColor: COLORS.successLight,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButton: {
    backgroundColor: COLORS.errorLight,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendBadge: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: COLORS.warningLight,
    color: COLORS.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    position: 'relative',
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
  chatIconContainer: {
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});

export default FriendsScreen;
