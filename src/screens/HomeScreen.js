import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { 
  useFonts, 
  Manrope_400Regular, 
  Manrope_600SemiBold, 
  Manrope_700Bold 
} from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';
import { getUserData } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para detectar los resultados

export default function HomeScreen({ navigation }) {
  // 1. Carga de Fuentes
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  // 2. Estados Locales
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkResults, setCheckResults] = useState(null); // Nuevo estado para el botón

  // 3. Datos Temporales
  const reminders = [
    { id: 1, title: 'Correr 30 min.', time: '14:30 PM', icon: 'walk' }
  ];
  
  const quickFriends = [];

  // 4. Lógica de Carga de Datos
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
      }
      
      // Verificar si hay resultados del check guardados
      const savedResults = await AsyncStorage.getItem('last_check_results');
      if (savedResults) {
        setCheckResults(JSON.parse(savedResults));
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setTimeout(() => setLoading(false), 500); 
    }
  };

  const getCurrentDate = () => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const date = new Date();
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

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
              source={{ uri: user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/png?seed=Felix' }} 
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
          <Text style={styles.greetingText}>Hola, {user?.name || 'Campeón'}</Text>
        </View>

        {/* --- BOTÓN DE RESULTADOS DEL CHECK (Solo si existen datos) --- */}
        {checkResults && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.resultsButton}
              onPress={() => navigation.navigate('HealthResults', { results: checkResults })}
            >
              <View style={styles.resultsLeft}>
                <View style={styles.resultsIconCircle}>
                  <Ionicons name="stats-chart" size={22} color={COLORS.white} />
                </View>
                <View style={styles.resultsTexts}>
                  <Text style={styles.resultsTitle}>Resultados del Check</Text>
                  <Text style={styles.resultsSub}>Pulsa para ver tu reporte de salud</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}

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
          <Text style={styles.sectionTitle}>¿Qué estás buscando?</Text>
          <View style={styles.cardsRow}>
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('HealthFlow')}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#E8E8FF' }]}>
                <Ionicons name="clipboard-outline" size={28} color="#5B5BD6" />
              </View>
              <Text style={styles.cardText}>Check{'\n'}General</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('Chat')}
            >
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

        {/* Top Amigos AI7 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Amigos AI7</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.friendsScrollContent}
          >
            <TouchableOpacity 
              style={styles.amigosButtonCard} 
              onPress={() => navigation.navigate('FriendsList')}
            >
              <View style={styles.amigosIconContainer}>
                <Ionicons name="list" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.amigosButtonText}>Amigos</Text>
            </TouchableOpacity>

            {quickFriends.map((friend) => (
              <TouchableOpacity 
                key={friend.id} 
                style={styles.friendCard}
                onPress={() => navigation.navigate('ChatDetail', { recipient: friend })}
              >
                <Image source={{ uri: friend.photo }} style={styles.friendPhoto} />
                <Text style={styles.friendName}>{friend.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  userPhoto: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.primary, backgroundColor: '#F0F0F0' },
  headerRight: { flexDirection: 'row', gap: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  greetingSection: { paddingHorizontal: 20, marginBottom: 20 },
  dateText: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: COLORS.gray, marginBottom: 5 },
  greetingText: { fontFamily: 'Manrope_700Bold', fontSize: 28, color: COLORS.black },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontFamily: 'Manrope_700Bold', fontSize: 18, color: COLORS.black, marginBottom: 15 },
  clearButton: { fontFamily: 'Manrope_600SemiBold', fontSize: 14, color: '#FF6B6B' },
  reminderCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F0F0F0', elevation: 2 },
  reminderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  reminderIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E8FFF5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  reminderText: { fontFamily: 'Manrope_600SemiBold', fontSize: 15, color: COLORS.black, flex: 1 },
  reminderTime: { fontFamily: 'Manrope_600SemiBold', fontSize: 14, color: COLORS.primary },
  emptyCard: { backgroundColor: '#F9F9F9', borderRadius: 16, padding: 20, alignItems: 'center' },
  emptyText: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: COLORS.gray, textAlign: 'center' },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  card: { flex: 1, alignItems: 'center', marginHorizontal: 5 },
  cardIcon: { width: 65, height: 65, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardText: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, color: COLORS.black, textAlign: 'center', lineHeight: 16 },
  friendsScrollContent: { alignItems: 'center', paddingRight: 20 },
  amigosButtonCard: { width: 85, height: 100, backgroundColor: '#E1F5E8', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 15, borderWidth: 1, borderColor: '#B9F6CA' },
  amigosIconContainer: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  amigosButtonText: { fontFamily: 'Manrope_700Bold', fontSize: 12, color: '#065F46' },
  friendCard: { alignItems: 'center', marginRight: 15 },
  friendPhoto: { width: 55, height: 55, borderRadius: 27.5, marginBottom: 8, backgroundColor: '#F0F0F0' },
  friendName: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, color: COLORS.black },

  // ESTILOS DEL BOTÓN DE RESULTADOS
  resultsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  resultsLeft: { flexDirection: 'row', alignItems: 'center' },
  resultsIconCircle: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  resultsTexts: { marginLeft: 12 },
  resultsTitle: { fontFamily: 'Manrope_700Bold', fontSize: 16, color: COLORS.white },
  resultsSub: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.8)' },
});