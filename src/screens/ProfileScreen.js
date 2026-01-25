import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  ActivityIndicator 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';
// Asegúrate de que estas funciones existan en tu archivo storage.js
import { getUserData, clearAllData } from '../services/storage';

export default function ProfileScreen({ navigation }) {
  // 1. Carga de Fuentes
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  // 2. Estados
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Efecto: Recargar datos cada vez que la pantalla se enfoca (aparece)
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  // 4. Lógica de carga de datos
  const loadUserData = async () => {
    try {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  // 5. Lógica de Logout
  const handleLogout = async () => {
    try {
      await clearAllData(); // Borra token y datos guardados
      // Resetea la navegación para que no puedan volver atrás con el botón físico
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // 6. Navegación a Editar (Opcional, si tienes la pantalla creada)
  const handleEditProfile = () => {
    // Si aún no tienes la pantalla 'EditProfile', esto lanzará un warning pero no romperá la app
    // Puedes comentar la siguiente línea si prefieres no usarla todavía
    navigation.navigate('EditProfile', { userData: user, onUpdate: loadUserData });
  };

  // 7. Configuración del Menú
  const menuItems = [
    { id: 1, title: 'Perfil', icon: 'person-outline', color: COLORS.black },
    { id: 2, title: 'Historial', icon: 'time-outline', color: COLORS.black },
    { id: 3, title: 'Dirección', icon: 'location-outline', color: COLORS.black },
    { id: 4, title: 'Gamificación', icon: 'trophy-outline', color: '#FFB800' }, // Color dorado para trofeo
    { id: 5, title: 'Centro de ayuda', icon: 'headset-outline', color: COLORS.black },
    { id: 6, title: 'Sugerencias', icon: 'phone-portrait-outline', color: COLORS.black },
    { id: 7, title: 'Sobre nosotros', icon: 'information-circle-outline', color: COLORS.black },
  ];

  // 8. Pantalla de Carga
  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // 9. Renderizado Principal
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header Azul */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Lista de Opciones (Menú) */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <Ionicons name={item.icon} size={24} color={item.color} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}

          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Tarjeta Flotante de Usuario */}
      <TouchableOpacity 
        style={styles.userCard} 
        onPress={handleEditProfile} 
        activeOpacity={0.9}
      >
        <Image
          // Usamos PNG en lugar de SVG para evitar errores de renderizado en <Image>
          source={{ uri: user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/png?seed=Felix' }}
          style={styles.userPhoto}
        />
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'Usuario Invitado'}</Text>
          <Text style={styles.userPhone}>{user?.email || 'Sin correo registrado'}</Text>
        </View>

        <View style={styles.editButton}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 80, // Espacio extra para que la tarjeta flote encima
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 0,
  },
  headerTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    color: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 70, // Espacio para no chocar con la tarjeta flotante
    paddingBottom: 100,
  },
  // Estilos de la Tarjeta Flotante
  userCard: {
    position: 'absolute',
    top: 110, // Ajustado para quedar mitad en el header, mitad fuera
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6, // Sombra en Android
    zIndex: 10,
  },
  userPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 4,
  },
  userPhone: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: COLORS.gray,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F8F3', // Color menta muy suave
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Estilos del Menú
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9', // Línea separadora sutil
  },
  menuItemText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: COLORS.black,
    marginLeft: 16,
  },
  logoutText: {
    color: '#FF6B6B',
    fontFamily: 'Manrope_700Bold',
  },
});