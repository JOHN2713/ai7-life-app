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
    title: 'Autoanalisis',
    description: 'Antes de empezar vamos a ver cómo nos encontramos HOY',
  },
];

export default function OnboardingScreen({ navigation }) {
  // Todos los hooks al inicio, antes de cualquier return
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  
  // Animaciones para cada slide
  const scale1 = useRef(new Animated.Value(0)).current;
  const rotate2 = useRef(new Animated.Value(0)).current;
  const translateX3 = useRef(new Animated.Value(100)).current;
  const opacity3 = useRef(new Animated.Value(0)).current;
  
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
      
      // Animaciones específicas según el slide
      if (index === 0) {
        // Primera pantalla: Zoom in
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
        // Tercera pantalla: Fade from right
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

  // Return condicional después de todos los hooks
  if (!fontsLoaded) {
    return null;
  }

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Última pantalla - marcar onboarding como completado y navegar a Main
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await setOnboardingCompleted();
    navigation.replace('Main');
  };

  const renderItem = ({ item, index }) => {
    let animationStyle = {};
    
    // Aplicar animación específica según el índice
    if (index === 0) {
      // Primera pantalla: Zoom in
      animationStyle = {
        transform: [{ scale: scale1 }],
      };
    } else if (index === 1) {
      // Segunda pantalla: Giro 360°
      const rotation = rotate2.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });
      animationStyle = {
        transform: [{ rotate: rotation }],
      };
    } else if (index === 2) {
      // Tercera pantalla: Fade from right
      animationStyle = {
        opacity: opacity3,
        transform: [{ translateX: translateX3 }],
      };
    }
    
    return (
      <View style={styles.slide}>
        <Animated.View
          style={[
            styles.imageContainer,
            animationStyle,
          ]}
        >
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

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
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        {/* Pagination Dots */}
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
                  {
                    width: dotWidth,
                    opacity,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Button */}
        {currentIndex === slides.length - 1 && (
          <TouchableOpacity style={styles.button} onPress={scrollTo}>
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
    width: width * 0.6,
    height: height * 0.4,
    maxWidth: 300,
    maxHeight: 300,
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  description: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
  button: {
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
  buttonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.white,
  },
});
