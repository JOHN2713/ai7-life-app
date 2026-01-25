import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';
import { getUserData } from '../services/storage';
import { goalsAPI } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);

  // Recargar datos cuando la pantalla obtiene foco (regresa de otra pantalla)
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      loadGoals();
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

  const loadGoals = async () => {
    try {
      console.log('🏠 Cargando metas en HomeScreen...');
      const response = await goalsAPI.getUserGoals(true); // Solo metas activas
      console.log('✅ Respuesta de metas:', response);
      
      if (response.success && response.goals) {
        console.log('📊 Metas activas encontradas:', response.goals.length);
        setGoals(response.goals);
      } else {
        console.log('⚠️ No se encontraron metas');
        setGoals([]);
      }
    } catch (error) {
      console.error('❌ Error al cargar metas en HomeScreen:', error);
      setGoals([]);
    }
  };

  // Amigos conectados (temporal)
  const friends = []; // Si está vacío, no se muestra la sección

  // Iconos de metas
  const GOAL_ICONS = {
    walk: 'walk',
    tooth: 'brush',
    book: 'book',
    water: 'water',
    fitness: 'barbell',
    meditation: 'leaf',
    study: 'school',
    sleep: 'moon',
    custom: 'flag'
  };

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
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notifications')}
            >
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

        {/* Mis Metas Activas */}
        {goals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mis Metas Activas</Text>
              <TouchableOpacity onPress={() => navigation.navigate('GoalsTab')}>
                <Text style={styles.seeAllButton}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.goalsScrollContainer}
            >
              {goals.slice(0, 5).map((goal) => (
                <TouchableOpacity 
                  key={goal.id} 
                  style={styles.goalCardMini}
                  onPress={() => navigation.navigate('GoalDetail', { goalId: goal.id })}
                >
                  <View style={[styles.goalIconMini, { backgroundColor: goal.color + '20' }]}>
                    <Ionicons
                      name={GOAL_ICONS[goal.icon] || 'flag'}
                      size={24}
                      color={goal.color}
                    />
                  </View>
                  <Text style={styles.goalNameMini} numberOfLines={2}>{goal.name}</Text>
                  <View style={styles.progressBarMini}>
                    <View style={[styles.progressFillMini, { width: `${goal.progress}%`, backgroundColor: goal.color }]} />
                  </View>
                  <Text style={styles.goalProgressText}>{goal.progress}%</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Qué estás buscando */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qué estás buscando?</Text>
          <View style={styles.cardsRow}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('Dashboard')}
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

            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('GoalsTab', { screen: 'CreateGoal' })}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#E8FFF5' }]}>
                <Ionicons name="trophy-outline" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.cardText}>Nuevos{'\n'}Retos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('Friends')}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="people-outline" size={28} color="#FF9800" />
              </View>
              <Text style={styles.cardText}>Mis{'\n'}Amigos</Text>
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
  seeAllButton: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: COLORS.primary,
  },
  goalsScrollContainer: {
    paddingRight: 20,
  },
  goalCardMini: {
    width: 120,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalIconMini: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  goalNameMini: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
    color: COLORS.black,
    marginBottom: 8,
    height: 36,
  },
  progressBarMini: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFillMini: {
    height: '100%',
    borderRadius: 3,
  },
  goalProgressText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 11,
    color: COLORS.gray,
    textAlign: 'center',
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
