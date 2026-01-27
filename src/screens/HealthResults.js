import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

export default function HealthResults({ navigation, route }) {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  // 1. RECIBIMOS LOS DATOS REALES
  const { results } = route.params || {};
  const data = results || {};

  // 2. PROCESAMIENTO DE DATOS
  const healthScore = parseInt(data.health_score) || 0;
  
  // Formateo de números
  const bmiValue = parseFloat(data.bmi || 0).toFixed(1);
  const bmiCategory = data.bmi_category || 'Calculado';
  const sleepHours = parseFloat(data.sleep_hours || 0);
  const waterGlasses = parseInt(data.water_glasses || 0);
  const activityLevel = data.activity_level || 'N/A';
  
  // Datos básicos
  const ageStr = (data.age || 0).toString();
  const heightStr = parseInt(data.height_cm || 0).toString();
  const weightStr = parseFloat(data.weight_kg || 0).toFixed(1);

  // 3. LÓGICA DE COLORES DINÁMICA
  const getScoreStatus = (score) => {
    if (score >= 80) return { label: 'Excelente', color: '#10B981', bgColor: '#D1FAE5' }; // Verde
    if (score >= 60) return { label: 'Bueno', color: '#F59E0B', bgColor: '#FEF3C7' };    // Amarillo
    return { label: 'Regular', color: '#EF4444', bgColor: '#FEE2E2' };                  // Rojo
  };

  const status = getScoreStatus(healthScore);

  if (!fontsLoaded) return <View style={styles.loadingContainer} />;

  // --- COMPONENTES VISUALES ---
  const MetricCard = ({ icon, title, value, unit, subLabel, subLabelColor }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        {icon}
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <View style={styles.metricValueContainer}>
        <Text style={styles.metricValue}>{value}</Text>
        {unit && <Text style={styles.metricUnit}> {unit}</Text>}
      </View>
      {subLabel && (
        <Text style={[styles.metricSubLabel, { color: subLabelColor || COLORS.textGray }]}>
          {subLabel}
        </Text>
      )}
    </View>
  );

  const BasicDataCard = ({ title, value }) => (
    <View style={styles.basicDataCard}>
      <Text style={styles.basicDataTitle}>{title}</Text>
      <Text style={styles.basicDataValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* --- HEADER MEJORADO CON LOGO --- */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <View style={{ width: 24 }} /> 
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo_AI7.png')} // Asegúrate de que la ruta sea correcta
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Tu Reporte de Salud</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- CÍRCULO DE PUNTUACIÓN --- */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreCircleOuter}>
            <View style={[styles.scoreCircleInner, { borderColor: status.color }]}>
              <Text style={[styles.scoreValue, { color: status.color }]}>{healthScore}</Text>
              <Text style={styles.scoreLabel}>Puntos</Text>
              <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.scoreDescription}>
            Análisis general basado en tus hábitos y medidas corporales.
          </Text>
        </View>

        {/* --- MÉTRICAS DETALLADAS --- */}
        <Text style={styles.sectionTitle}>Métricas Clave</Text>

        <View style={styles.metricsGrid}>
          {/* IMC */}
          <MetricCard
            icon={<MaterialCommunityIcons name="scale-bathroom" size={24} color={COLORS.primary} />}
            title="IMC"
            value={bmiValue}
            subLabel={bmiCategory}
            subLabelColor={bmiCategory === 'Normal' ? '#10B981' : '#F59E0B'}
          />
          {/* Sueño */}
          <MetricCard
            icon={<Ionicons name="bed" size={24} color="#8B5CF6" />}
            title="Descanso"
            value={sleepHours}
            unit="h"
            subLabel={sleepHours >= 7 ? "Buen descanso" : "Mejorar"}
            subLabelColor={sleepHours >= 7 ? '#10B981' : '#F59E0B'}
          />
          {/* Hidratación */}
          <MetricCard
            icon={<Ionicons name="water" size={24} color="#3B82F6" />}
            title="Hidratación"
            value={waterGlasses}
            unit="vasos"
            subLabel={waterGlasses >= 8 ? "Óptimo" : "Bebe más"}
            subLabelColor={waterGlasses >= 8 ? '#10B981' : '#F59E0B'}
          />
           {/* Actividad */}
           <MetricCard
            icon={<FontAwesome5 name="running" size={22} color="#F97316" />}
            title="Actividad"
            value={activityLevel}
            subLabel="Nivel actual"
          />
        </View>

        {/* --- DATOS BÁSICOS --- */}
        <View style={styles.basicDataRow}>
          <BasicDataCard title="Edad" value={`${ageStr} años`} />
          <View style={styles.separator} />
          <BasicDataCard title="Altura" value={`${heightStr} cm`} />
          <View style={styles.separator} />
          <BasicDataCard title="Peso" value={`${weightStr} kg`} />
        </View>

      </ScrollView>

      {/* --- BOTONES INFERIORES --- */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => {
            // Reiniciar flujo para editar datos
            navigation.reset({
                index: 0,
                routes: [{ name: 'HealthFlow' }], 
            });
          }}
        >
          <Text style={styles.secondaryButtonText}>Actualizar Datos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => {
            // Volver al inicio
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          }}
        >
          <Text style={styles.primaryButtonText}>Ir al Inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { flex: 1, backgroundColor: COLORS.white },
  
  // --- ESTILOS DEL HEADER MEJORADO ---
  headerContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 5 }
    }),
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  backButton: { padding: 5 },
  logoContainer: {
    alignItems: 'center',
    marginTop: -20, // Para subir el logo y que se superponga un poco
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  headerTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 22,
    color: COLORS.primary, // Usamos el color principal para el título
  },
  
  scrollContent: { paddingBottom: 30, paddingTop: 20 },
  
  // Score
  scoreSection: { alignItems: 'center', paddingVertical: 20, marginBottom: 20 },
  scoreCircleOuter: { width: width * 0.5, height: width * 0.5, borderRadius: width * 0.25, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1 },
  scoreCircleInner: { width: '90%', height: '90%', borderRadius: 1000, borderWidth: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  scoreValue: { fontFamily: 'Manrope_800ExtraBold', fontSize: 42, lineHeight: 46 },
  scoreLabel: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, color: COLORS.textGray },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  statusText: { fontFamily: 'Manrope_700Bold', fontSize: 12 },
  scoreDescription: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: COLORS.textGray, textAlign: 'center', paddingHorizontal: 40, marginTop: 10 },
  
  // Métricas
  sectionTitle: { fontFamily: 'Manrope_700Bold', fontSize: 18, color: COLORS.black, marginLeft: 20, marginBottom: 15 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  metricCard: { width: (width - 45) / 2, backgroundColor: COLORS.white, borderRadius: 20, padding: 15, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: {width:0, height:2} },
  metricHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  metricTitle: { fontFamily: 'Manrope_600SemiBold', fontSize: 13, color: COLORS.textGray, marginLeft: 8 },
  metricValueContainer: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' },
  metricValue: { fontFamily: 'Manrope_800ExtraBold', fontSize: 22, color: COLORS.black },
  metricUnit: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, color: COLORS.textGray, marginLeft: 4 },
  metricSubLabel: { fontFamily: 'Manrope_700Bold', fontSize: 12, marginTop: 5 },

  // Datos Básicos
  basicDataRow: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 20, borderRadius: 16, paddingVertical: 15, marginTop: 5, justifyContent: 'space-around', alignItems: 'center', elevation: 2 },
  basicDataCard: { alignItems: 'center' },
  basicDataTitle: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: COLORS.textGray, marginBottom: 2 },
  basicDataValue: { fontFamily: 'Manrope_700Bold', fontSize: 16, color: COLORS.black },
  separator: { height: '50%', width: 1, backgroundColor: '#E0E0E0' },

  // Footer
  footer: { padding: 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  primaryButtonText: { fontFamily: 'Manrope_700Bold', fontSize: 16, color: COLORS.white },
  secondaryButton: { backgroundColor: COLORS.white, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 },
  secondaryButtonText: { fontFamily: 'Manrope_700Bold', fontSize: 16, color: COLORS.textGray },
});