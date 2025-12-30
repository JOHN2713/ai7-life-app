import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated } from 'react-native';
import { useFonts, Manrope_400Regular, Manrope_700Bold } from '@expo-google-fonts/manrope';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  // Valores animados
  const logoScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;

  let [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Animación del logo (zoom-in)
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Animación del texto (fade-up) con delay
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

      // Navegar al Login después de 3 segundos
      const timer = setTimeout(() => {
        navigation.replace('Login');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, navigation]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Logo con animación zoom-in */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
          }
        ]}
      >
        <Image
          source={require('../../assets/images/logo_AI7.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Texto con animación fade-up */}
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
    color: '#00B89F', // Color turquesa/verde azulado
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
