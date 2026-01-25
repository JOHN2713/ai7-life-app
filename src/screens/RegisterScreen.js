import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
// Importamos los servicios para que el registro funcione de verdad
import { authAPI } from '../services/api';
import { saveUserData } from '../services/storage';

export default function RegisterScreen({ navigation }) {
  // 1. Estados del Formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState(''); // Campo opcional pero útil en salud
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // 2. Estado de UI
  const [loading, setLoading] = useState(false);

  // 3. Carga de Fuentes
  let [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  // 4. Lógica de Registro
  const handleRegister = async () => {
    // Validaciones Locales
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Campos Incompletos', 'Por favor completa nombre, email y contraseña.');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Términos requeridos', 'Debes aceptar los términos y políticas de privacidad para continuar.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Seguridad', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para el Backend
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        birthDate: birthDate || null, // Enviamos null si está vacío
      };

      // Llamada a la API
      const response = await authAPI.register(userData);
      
      // Si el registro es exitoso, guardamos sesión automáticamente
      await saveUserData(response.user);
      
      // Feedback y Navegación
      Alert.alert(
        '¡Bienvenido a AI7!',
        `Hola ${response.user.name}, tu cuenta ha sido creada con éxito.`,
        [
          {
            text: 'Comenzar',
            onPress: () => navigation.replace('Onboarding'), // Vamos al tutorial inicial
          },
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error en el Registro',
        error.error || 'No se pudo crear la cuenta. Verifica que el correo no esté ya registrado.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Cuenta</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Tarjeta del Formulario */}
          <View style={styles.card}>
            
            {/* Input: Nombre */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="¿Cómo te llamamos?"
                placeholderTextColor={COLORS.gray}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Input: Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor={COLORS.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Input: Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor={COLORS.gray}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={COLORS.gray} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Input: Fecha Nacimiento (Opcional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha de Nacimiento (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD (ej: 1995-05-20)"
                placeholderTextColor={COLORS.gray}
                value={birthDate}
                onChangeText={setBirthDate}
                keyboardType="numbers-and-punctuation"
              />
            </View>

            {/* Checkbox: Términos */}
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && (
                  <Ionicons name="checkmark" size={14} color={COLORS.white} />
                )}
              </View>
              <Text style={styles.termsText}>
                Acepto los términos de servicio y políticas de privacidad de AI7.
              </Text>
            </TouchableOpacity>

            {/* Botón de Registro */}
            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.registerButtonText}>Crear Cuenta</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Enlace al Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{height: 50}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    color: COLORS.white,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: COLORS.textGray || '#666',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: COLORS.black,
    backgroundColor: COLORS.lightGray || '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray || '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: COLORS.black,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Alineado arriba por si el texto es largo
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gray || '#999',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2, // Ajuste visual fino
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  termsText: {
    flex: 1,
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: COLORS.textGray || '#666',
    lineHeight: 20,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.white,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.textGray || '#666',
  },
  loginLink: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: COLORS.primary,
  },
});