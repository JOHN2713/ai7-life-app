import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated } from 'react-native';
import { useFonts, Manrope_400Regular, Manrope_700Bold } from '@expo-google-fonts/manrope';
// Importamos el servicio de almacenamiento para verificar la sesión
import { getToken } from '../services/storage';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  // 1. Valores animados
  const logoScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;

  // 2. Carga de fuentes
  let [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // 3. Iniciar Animaciones Visuales
      startAnimations();

      // 4. Temporizador + Lógica de Autenticación
      // Esperamos 3 segundos para que se aprecie el logo y luego verificamos
      const timer = setTimeout(() => {
        checkAuthStatus();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, navigation]);

  const startAnimations = () => {
    // Animación del logo (zoom-in con rebote)
    Animated.spring(logoScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Animación del texto (aparece y sube)
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkAuthStatus = async () => {
    try {
      // Verificamos si existe un token guardado en el celular
      const token = await getToken();
      
      if (token) {
        // Usuario tiene sesión activa -> Ir directo a la App
        navigation.replace('Main');
      } else {
        // No hay sesión -> Ir al Login
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Error al verificar auth:', error);
      // Por seguridad, si falla algo, enviamos al Login
      navigation.replace('Login');
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Logo con animación zoom-in */}
      <Animated.View 
        style={[
          styles.logoContainer,
          { transform: [{ scale: logoScale }] }
        ]}
      >
        <Image
          source={require('../../assets/images/logo_AI7.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Título (AI7 Life) con animación fade-up */}
      <Animated.View 
        style={[
          styles.titleContainer,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          }
        ]}
      >
        <Text style={styles.titleAI7}>AI7</Text>
        <Text style={styles.titleLife}>Life</Text>
      </Animated.View>

      {/* Eslogan con animación fade-up */}
      <Animated.Text 
        style={[
          styles.slogan,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          }
        ]}
      >
        La constancia no se fuerza, se acompaña.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: height * 0.3,
    maxWidth: 250,
    maxHeight: 250,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  titleAI7: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 48,
    color: '#00B89F', // Color turquesa de tu marca
    fontWeight: 'bold',
  },
  titleLife: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 36,
    color: '#000000',
    marginLeft: 5,
  },
  slogan: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
});