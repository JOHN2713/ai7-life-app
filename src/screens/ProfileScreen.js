import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';

export default function ProfileScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  // Datos del usuario (temporal)
  const user = {
    name: 'User',
    phone: '1234 456 7899',
    photo: null, // Aquí iría la foto del usuario
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleLogout = () => {
    // Navegar de vuelta al login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const menuItems = [
    { id: 1, title: 'Perfil', icon: 'person-outline', color: COLORS.black },
    { id: 2, title: 'Historial', icon: 'time-outline', color: COLORS.black },
    { id: 3, title: 'Dirección', icon: 'location-outline', color: COLORS.black },
    { id: 4, title: 'Gamificación', icon: 'trophy-outline', color: '#FFB800' },
    { id: 5, title: 'Centro de ayuda', icon: 'headset-outline', color: COLORS.black },
    { id: 6, title: 'Sugerencias', icon: 'phone-portrait-outline', color: COLORS.black },
    { id: 7, title: 'Sobre nosotros', icon: 'information-circle-outline', color: COLORS.black },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <Ionicons name={item.icon} size={24} color={item.color} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* User Card - Positioned absolutely on top */}
      <View style={styles.userCard}>
        {user.photo ? (
          <Image source={user.photo} style={styles.userPhoto} />
        ) : (
          <View style={styles.userPhotoPlaceholder}>
            <Image
              source={{ uri: 'https://via.placeholder.com/60' }}
              style={styles.userPhoto}
            />
          </View>
        )}
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userPhone}>{user.phone}</Text>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 80,
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
    paddingTop: 70,
    paddingBottom: 100,
  },
  userCard: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  userPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userPhotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 4,
  },
  userPhone: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F8F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: COLORS.black,
    marginLeft: 16,
  },
  logoutText: {
    color: '#FF6B6B',
  },
});
