import React, { useEffect } from 'react';
import { View } from 'react-native';

export default function ChatTabPlaceholder({ navigation }) {
  useEffect(() => {
    // Navegar a la pantalla de chat completa inmediatamente
    navigation.navigate('Chat');
  }, []);

  return <View />;
}
