import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { COLORS } from '../constants/colors';
// Importamos la función para guardar que el tutorial fue visto
import { setOnboardingCompleted } from '../services/storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../../assets/images/img_onboarding1.png'),
    title: 'Pequeños hábitos.\nGrandes cambios.',
    description: 'Te contaremos un poco de AI7',
  },
  {
    id: '2',
    image: require('../../assets/images/img_onboarding2.png'),
    title: 'Un ciclo. Un logro.',
    description: 'AI7 te ayudará a que un hábito no sea una decisión forzada, sino un estilo de vida.',
  },
  {
    id: '3',
    image: require('../../assets/images/img_onboarding3.png'),
    title: 'Autoanálisis',
    description: 'Antes de empezar vamos a ver cómo nos encontramos HOY',
  },
];

export default function OnboardingScreen({ navigation }) {
  // 1. Hooks de Estado y Fuentes
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  
  // 2. Referencias de Animación
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  
  // Animaciones individuales para cada slide
  const scale1 = useRef(new Animated.Value(0)).current;      // Slide 1: Zoom
  const rotate2 = useRef(new Animated.Value(0)).current;     // Slide 2: Rotación
  const translateX3 = useRef(new Animated.Value(100)).current; // Slide 3: Desplazamiento
  const opacity3 = useRef(new Animated.Value(0)).current;    // Slide 3: Opacidad
  
  // 3. Configuración de Vista (Detectar qué slide está visible)
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
      
      // Lógica de Animaciones según el slide actual
      if (index === 0) {
        // Primera pantalla: Zoom in suave
        scale1.setValue(0.5); // Reseteamos un poco para que se note el efecto
        Animated.spring(scale1, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }).start();
      } else if (index === 1) {
        // Segunda pantalla: Giro 360°
        rotate2.setValue(0);
        Animated.timing(rotate2, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } else if (index === 2) {
        // Tercera pantalla: Aparece desde la derecha
        translateX3.setValue(100);
        opacity3.setValue(0);
        Animated.parallel([
          Animated.timing(translateX3, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity3, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }).current;

  // 4. Check de fuentes antes de renderizar
  if (!fontsLoaded) {
    return null;
  }

  // 5. Manejo de Botón "Siguiente" / "Comenzar"
  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      // Si no es el último, deslizamos al siguiente
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Si es el último, guardamos y salimos
      try {
        await setOnboardingCompleted(); 
      } catch (error) {
        console.error("Error guardando onboarding:", error);
      } finally {
        // Navegamos a Main (o Login si prefieres) independientemente del error
        navigation.replace('Main');
      }
    }
  };

  // 6. Renderizado de cada Item (Slide)
  const renderItem = ({ item, index }) => {
    let animationStyle = {};
    
    // Asignar estilo animado según el índice
    if (index === 0) {
      animationStyle = { transform: [{ scale: scale1 }] };
    } else if (index === 1) {
      const rotation = rotate2.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });
      animationStyle = { transform: [{ rotate: rotation }] };
    } else if (index === 2) {
      animationStyle = { 
        opacity: opacity3,
        transform: [{ translateX: translateX3 }] 
      };
    }
    
    return (
      <View style={styles.slide}>
        <Animated.View style={[styles.imageContainer, animationStyle]}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  // 7. Renderizado Principal
  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        {/* Puntos de Paginación */}
        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  { width: dotWidth, opacity },
                ]}
              />
            );
          })}
        </View>

        {/* Botón de Acción (Solo aparece en el último slide para forzar lectura, o cambiar lógica si deseas) */}
        {currentIndex === slides.length - 1 && (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Comenzar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  slide: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  image: {
    width: width * 0.7, // Ajustado ligeramente para mejor proporción
    height: height * 0.4,
    maxWidth: 320,
    maxHeight: 320,
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 26,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 50, // Más espacio abajo para dispositivos modernos
    paddingHorizontal: 20,
    height: 150, // Altura fija para evitar saltos
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    width: '80%', // Botón ancho es más fácil de pulsar
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 }, // Sombra más moderna
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
});