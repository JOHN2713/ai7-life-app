import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import axios from 'axios';
import { API_URL } from '../services/apiConfig';
import { getUserData } from '../services/storage';

export default function ChatScreenList({ route, navigation }) {
  // 1. Recibimos los datos del amigo seleccionado
  const { recipient } = route.params; 
  
  // 2. Estados para la lógica de red y usuario
  const [myUserId, setMyUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Efecto inicial: Cargar mi ID y luego el historial
  useEffect(() => {
    const initChat = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setMyUserId(userData.id);
          await fetchHistory(userData.id, recipient.id);
        }
      } catch (error) {
        console.error("Error al inicializar chat:", error);
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, []);

  // 4. Función para traer mensajes reales de PostgreSQL
  const fetchHistory = async (myId, friendId) => {
    try {
      const response = await axios.get(`${API_URL}/user-chat/historial/${myId}/${friendId}`);
      setChatMessages(response.data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  // 5. Función para enviar mensaje y guardarlo en la DB
  const sendMessage = async () => {
    if (message.trim().length === 0) return;
    
    const messageData = {
      emisor_id: myUserId,
      receptor_id: recipient.id,
      contenido: message
    };

    try {
      // Enviamos al nuevo endpoint de chat entre usuarios
      const response = await axios.post(`${API_URL}/user-chat/enviar`, messageData);
      
      // Añadimos el mensaje retornado por la DB a la lista local
      setChatMessages([...chatMessages, response.data]);
      setMessage('');
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("No se pudo enviar el mensaje a la base de datos.");
    }
  };

  // 6. Renderizado de cada burbuja de mensaje
  const renderItem = ({ item }) => {
    // Verificamos si el emisor soy yo usando el UUID
    const isMine = item.emisor_id === myUserId;

    return (
      <View style={[
        styles.messageWrapper, 
        isMine ? styles.myWrapper : styles.otherWrapper
      ]}>
        <View style={[
          styles.messageBubble, 
          isMine ? styles.myBubble : styles.otherBubble
        ]}>
          <Text style={[
            styles.messageText, 
            isMine ? styles.myText : styles.otherText
          ]}>
            {item.contenido}
          </Text>
        </View>
      </View>
    );
  };

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

      {/* Lista de Mensajes o Indicador de Carga */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={chatMessages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Iniciar la lista desde abajo si es necesario (opcional)
          // inverted={false} 
        />
      )}

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