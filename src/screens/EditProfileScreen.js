import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';
import { authAPI } from '../services/api';

// Estilos de avatares disponibles en DiceBear
const AVATAR_STYLES = [
  'avataaars',
  'bottts',
  'fun-emoji',
  'lorelei',
  'micah',
  'miniavs',
  'notionists',
  'personas',
  'pixel-art',
];

export default function EditProfileScreen({ route, navigation }) {
  const { userData, onUpdate } = route.params;
  
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  // Extraer el estilo actual del usuario si existe
  const getCurrentStyle = () => {
    if (userData?.avatar_url) {
      const match = userData.avatar_url.match(/\/7\.x\/([^/]+)\//);
      return match ? match[1] : 'avataaars';
    }
    return 'avataaars';
  };

  const [selectedStyle, setSelectedStyle] = useState(getCurrentStyle());
  const [selectedSeed, setSelectedSeed] = useState(userData?.email || userData?.name || 'default');
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const generateAvatarUrl = (style, seed) => {
    // Usar PNG en lugar de SVG para mejor compatibilidad
    const cleanSeed = encodeURIComponent(seed || 'default');
    const url = `https://api.dicebear.com/7.x/${style}/png?seed=${cleanSeed}&size=200`;
    console.log(`Generando avatar: ${style} con seed: ${seed}`);
    return url;
  };

  const handleSelectStyle = (style) => {
    setSelectedStyle(style);
  };

  const handleSaveAvatar = async () => {
    try {
      setLoading(true);
      const newAvatarUrl = generateAvatarUrl(selectedStyle, selectedSeed);
      
      await authAPI.updateAvatar(newAvatarUrl);
      
      Alert.alert(
        '¡Éxito!',
        'Tu avatar ha sido actualizado',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onUpdate) onUpdate();
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error al actualizar avatar:', error);
      Alert.alert(
        'Error',
        error.error || 'No se pudo actualizar el avatar. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar Preview */}
        <View style={styles.avatarSection}>
          <Text style={styles.sectionTitle}>Avatar Actual</Text>
          <View style={styles.avatarPreviewContainer}>
            <Image
              source={{ uri: generateAvatarUrl(selectedStyle, selectedSeed) }}
              style={styles.avatarPreview}
              resizeMode="contain"
              onError={(e) => console.log('Error cargando avatar preview:', e.nativeEvent.error)}
            />
          </View>
        </View>

        {/* User Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.infoValue}>{userData?.name}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{userData?.email}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Fecha de Nacimiento:</Text>
              <Text style={styles.infoValue}>
                {userData?.birth_date 
                  ? new Date(userData.birth_date).toLocaleDateString('es-ES')
                  : 'No especificada'}
              </Text>
            </View>
          </View>
        </View>

        {/* Avatar Style Selector */}
        <View style={styles.stylesSection}>
          <Text style={styles.sectionTitle}>Selecciona un Estilo</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stylesScroll}
          >
            {AVATAR_STYLES.map((style) => (
              <TouchableOpacity
                key={style}
                onPress={() => handleSelectStyle(style)}
                style={[
                  styles.styleOption,
                  selectedStyle === style && styles.styleOptionSelected
                ]}
              >
                <View style={styles.styleAvatarContainer}>
                  <Image
                    source={{ uri: generateAvatarUrl(style, selectedSeed) }}
                    style={styles.styleAvatar}
                    resizeMode="contain"
                    onError={(e) => {
                      console.log(`Error cargando avatar ${style}:`, e.nativeEvent.error);
                      setImageErrors(prev => ({ ...prev, [style]: true }));
                    }}
                  />
                  {imageErrors[style] && (
                    <View style={styles.errorPlaceholder}>
                      <Ionicons name="image-outline" size={40} color={COLORS.gray} />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.styleName,
                  selectedStyle === style && styles.styleNameSelected
                ]}>
                  {style}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Seed Variations */}
        <View style={styles.variationsSection}>
          <Text style={styles.sectionTitle}>Variaciones</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.variationsScroll}
          >
            {[
              userData?.email || 'variation1',
              userData?.name || 'variation2',
              `${userData?.name || 'user'}-alt`,
              `${userData?.email || 'mail'}-v2`,
              `avatar-${userData?.id || '123'}`,
              `style-${selectedStyle}`,
            ].map((seed, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedSeed(seed)}
                style={[
                  styles.variationOption,
                  selectedSeed === seed && styles.variationOptionSelected
                ]}
              >
                <Image
                  source={{ uri: generateAvatarUrl(selectedStyle, seed) }}
                  style={styles.variationAvatar}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSaveAvatar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.white} />
              <Text style={styles.saveButtonText}>Guardar Avatar</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    color: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 16,
  },
  avatarPreviewContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarPreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  infoSection: {
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 12,
    marginRight: 8,
  },
  infoValue: {
    flex: 1,
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.black,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  stylesSection: {
    marginBottom: 30,
  },
  stylesScroll: {
    paddingVertical: 8,
  },
  styleOption: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  styleOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#E0F8F3',
  },
  styleAvatarContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  styleAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
  },
  errorPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 40,
  },
  styleName: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  styleNameSelected: {
    fontFamily: 'Manrope_600SemiBold',
    color: COLORS.primary,
  },
  variationsSection: {
    marginBottom: 30,
  },
  variationsScroll: {
    paddingVertical: 8,
  },
  variationOption: {
    marginRight: 12,
    borderRadius: 8,
    padding: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  variationOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#E0F8F3',
  },
  variationAvatar: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.white,
    marginLeft: 8,
  },
});
