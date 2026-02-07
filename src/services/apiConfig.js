// 🔧 Configuración de la API según el dispositivo
// Cambia la URL comentando/descomentando según necesites

// ===== OPCIÓN 1: Dispositivo Físico (Teléfono/Tablet con Expo Go) =====
// Asegúrate de que tu PC y dispositivo estén en el MISMO WiFi
export const API_URL = 'http://192.168.0.115:3000/api';

// ===== OPCIÓN 2: Android Emulator =====
// export const API_URL = 'http://10.0.2.2:3000/api';

// ===== OPCIÓN 3: Web o iOS Simulator =====
// export const API_URL = 'http://localhost:3000/api';

// ===== OPCIÓN 4: Producción =====
// export const API_URL = 'https://tudominio.com/api';

console.log('🔗 API URL configurada:', API_URL);
