import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  ActivityIndicator,
  Alert,
  StatusBar,
  Share // <--- Importamos Share para la funcionalidad de invitar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';
import axios from 'axios';
import { API_URL } from '../services/apiConfig';

export default function FriendsListScreen({ navigation }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // 1. Cargar fuentes
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  // 2. Cargar usuarios desde el servidor
  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/users`);
      if (response.data && Array.isArray(response.data)) {
        setFriends(response.data);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error("Error al obtener amigos:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  // 3. LÓGICA DE LA OPCIÓN 2: Compartir Invitación
  const handleAddFriend = async () => {
    try {
      const result = await Share.share({
        message: `¡Hola! 👋 Te invito a unirte a AI7 Life. Es una app genial para gestionar nuestra salud y retos diarios con IA. 🚀 Descárgala aquí: https://ai7life.com/download`,
        title: 'Invitación a AI7 Life',
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // compartido con éxito
        } else {
          // compartido
        }
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir el menú para compartir.");
    }
  };

  if (!fontsLoaded) return null;

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchText.toLowerCase()) ||
    f.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header con botón para volver al Home */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lista de Usuarios</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchFriends}>
          <Ionicons name="refresh-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Barra de Búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuarios registrados..."
          placeholderTextColor={COLORS.gray}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Sección de Conteo y Botón Invitar */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {filteredFriends.length} Usuarios encontrados
        </Text>
        <TouchableOpacity onPress={handleAddFriend}>
          <Text style={styles.sectionLink}>+ Invitar amigo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Usuarios */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Conectando con el servidor...</Text>
        </View>
      ) : filteredFriends.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color={COLORS.primary} opacity={0.3} />
          <Text style={styles.emptyTitle}>No hay nadie aquí</Text>
          <Text style={styles.emptyText}>Parece que no hay usuarios con ese nombre.</Text>
        </View>
      ) : (
        <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
          {filteredFriends.map((friend) => (
            <TouchableOpacity 
              key={friend.id} 
              style={styles.friendCard}
              onPress={() => navigation.navigate('ChatDetail', { recipient: friend })}
            >
              {friend.avatar_url ? (
                <Image source={{ uri: friend.avatar_url }} style={styles.friendAvatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {friend.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendEmail}>{friend.email}</Text>
              </View>
              <View style={styles.chatIconBadge}>
                 <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    justifyContent: 'space-between'
  },
  backButton: { padding: 5 },
  headerTitle: { 
    fontFamily: 'Manrope_700Bold', 
    fontSize: 20, 
    color: COLORS.black,
    flex: 1,
    marginLeft: 10
  },
  refreshButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    backgroundColor: '#F5F5F5', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontFamily: 'Manrope_400Regular', fontSize: 14, color: COLORS.black },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    marginBottom: 15 
  },
  sectionTitle: { fontFamily: 'Manrope_700Bold', fontSize: 16, color: COLORS.black },
  sectionLink: { fontFamily: 'Manrope_600SemiBold', fontSize: 14, color: COLORS.primary },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: COLORS.gray, marginTop: 10 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  emptyTitle: { fontFamily: 'Manrope_700Bold', fontSize: 18, color: COLORS.black, marginTop: 20 },
  emptyText: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: COLORS.gray, textAlign: 'center' },
  friendsList: { flex: 1, paddingHorizontal: 20 },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
  },
  friendAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 15 },
  avatarPlaceholder: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#E8F5E9', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15 
  },
  avatarText: { fontFamily: 'Manrope_600SemiBold', fontSize: 18, color: COLORS.primary },
  friendName: { fontFamily: 'Manrope_600SemiBold', fontSize: 15, color: COLORS.black },
  friendEmail: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: COLORS.gray, marginTop: 4 },
  chatIconBadge: { padding: 5, backgroundColor: '#E8FFF5', borderRadius: 10 }
});