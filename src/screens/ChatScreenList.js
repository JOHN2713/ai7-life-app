import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function ChatScreenList({ route, navigation }) {
  // Recibimos los datos del amigo seleccionado desde la lista
  const { recipient } = route.params; 
  const [message, setMessage] = useState('');
  
  // Mensajes iniciales de ejemplo
  const [chatMessages, setChatMessages] = useState([
    { id: '1', text: `¡Hola! Soy ${recipient.name}, un gusto saludarte.`, sender: 'other' },
    { id: '2', text: '¡Igualmente! ¿Cómo va todo?', sender: 'me' },
  ]);

  const sendMessage = () => {
    if (message.trim().length === 0) return;
    
    const newMessage = { 
      id: Date.now().toString(), 
      text: message, 
      sender: 'me' 
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageWrapper, 
      item.sender === 'me' ? styles.myWrapper : styles.otherWrapper
    ]}>
      <View style={[
        styles.messageBubble, 
        item.sender === 'me' ? styles.myBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText, 
          item.sender === 'me' ? styles.myText : styles.otherText
        ]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Personalizado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={COLORS.black} />
        </TouchableOpacity>
        
        <View style={styles.avatarMini}>
          <Text style={styles.avatarText}>{recipient.name.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{recipient.name}</Text>
          <Text style={styles.headerStatus}>En línea</Text>
        </View>

        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="videocam-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Lista de Mensajes */}
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input de Mensaje */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={24} color={COLORS.gray} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Escribe un mensaje..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendBtn, !message.trim() && { opacity: 0.5 }]} 
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0' 
  },
  backBtn: { marginRight: 10 },
  avatarMini: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#E8F5E9', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  avatarText: { color: COLORS.primary, fontWeight: 'bold' },
  headerInfo: { flex: 1, marginLeft: 12 },
  headerName: { fontFamily: 'Manrope_700Bold', fontSize: 16, color: COLORS.black },
  headerStatus: { fontSize: 12, color: '#10B981' },
  listContent: { padding: 20, paddingBottom: 10 },
  messageWrapper: { marginBottom: 15, width: '100%' },
  myWrapper: { alignItems: 'flex-end' },
  otherWrapper: { alignItems: 'flex-start' },
  messageBubble: { 
    maxWidth: '80%', 
    padding: 12, 
    borderRadius: 20,
  },
  myBubble: { 
    backgroundColor: COLORS.primary, 
    borderBottomRightRadius: 4 
  },
  otherBubble: { 
    backgroundColor: '#F0F0F0', 
    borderBottomLeftRadius: 4 
  },
  myText: { color: '#FFF', fontFamily: 'Manrope_400Regular' },
  otherText: { color: COLORS.black, fontFamily: 'Manrope_400Regular' },
  inputArea: { 
    flexDirection: 'row', 
    padding: 12, 
    alignItems: 'center', 
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  textInput: { 
    flex: 1, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    marginHorizontal: 10,
    maxHeight: 100 
  },
  sendBtn: { 
    backgroundColor: COLORS.primary, 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  }
});