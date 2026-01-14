import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';
import { getUserData } from '../services/storage';

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recargar datos cuando la pantalla obtiene foco (regresa de otra pantalla)
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

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

  // Recordatorios (temporal)
  const reminders = [
    { id: 1, title: 'Correr 30 min.', time: '14:30 PM', icon: 'walk' }
  ];

  // Amigos conectados (temporal)
  const friends = []; // Si está vacío, no se muestra la sección

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const getCurrentDate = () => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const date = new Date();
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/png?seed=default&size=200' }}
              style={styles.userPhoto}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date and Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
          <Text style={styles.greetingText}>Hola, {user?.name || 'Usuario'}</Text>
        </View>

        {/* Recordatorios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recordatorio</Text>
            {reminders.length > 0 && (
              <TouchableOpacity>
                <Text style={styles.clearButton}>Limpiar</Text>
              </TouchableOpacity>
            )}
          </View>

          {reminders.length > 0 ? (
            reminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderCard}>
                <View style={styles.reminderLeft}>
                  <View style={styles.reminderIcon}>
                    <Ionicons name={reminder.icon} size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.reminderText}>{reminder.title}</Text>
                </View>
                <Text style={styles.reminderTime}>{reminder.time}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Aún no has establecido retos hoy</Text>
            </View>
          )}
        </View>

        {/* Qué estás buscando */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qué estás buscando?</Text>
          <View style={styles.cardsRow}>
            <TouchableOpacity style={styles.card}>
              <View style={[styles.cardIcon, { backgroundColor: '#E8E8FF' }]}>
                <Ionicons name="clipboard-outline" size={28} color="#5B5BD6" />
              </View>
              <Text style={styles.cardText}>Check{'\n'}General</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <View style={[styles.cardIcon, { backgroundColor: '#FFE8E8' }]}>
                <Ionicons name="chatbubbles-outline" size={28} color="#D65B5B" />
              </View>
              <Text style={styles.cardText}>Chat con{'\n'}Coach</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <View style={[styles.cardIcon, { backgroundColor: '#E8FFF5' }]}>
                <Ionicons name="trophy-outline" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.cardText}>Nuevos{'\n'}Retos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Amigos AI7 - Solo si hay amigos */}
        {friends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Amigos AI7</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {friends.map((friend) => (
                <View key={friend.id} style={styles.friendCard}>
                  <Image source={friend.photo} style={styles.friendPhoto} />
                  <Text style={styles.friendName}>{friend.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: '#F0F0F0',
  },
  userPhotoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
  },
  greetingText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 28,
    color: COLORS.black,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: COLORS.black,
  },
  clearButton: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#FF6B6B',
  },
  reminderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8FFF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reminderText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: COLORS.black,
    flex: 1,
  },
  reminderTime: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: COLORS.primary,
  },
  emptyCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cardIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 16,
  },
  friendCard: {
    alignItems: 'center',
    marginRight: 15,
  },
  friendPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  friendName: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: COLORS.black,
  },
});
