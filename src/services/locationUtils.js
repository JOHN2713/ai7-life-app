// src/services/locationUtils.js

/**
 * Calcula distancia entre dos coordenadas (fórmula de Haversine)
 */
export const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(coord1.latitude)) * Math.cos(toRad(coord2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (degrees) => degrees * (Math.PI / 180);

/**
 * Filtra puntos GPS erróneos
 */
export const filterGPSPoints = (points) => {
  if (points.length < 2) return points;
  
  const filtered = [points[0]];
  const MAX_SPEED = 30; // km/h
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i-1];
    const curr = points[i];
    
    // Calcular tiempo en horas
    const timeDiff = ((curr.timestamp || Date.now()) - (prev.timestamp || Date.now())) / 1000 / 3600;
    if (timeDiff <= 0) continue;
    
    // Calcular distancia y velocidad
    const distance = calculateDistance(prev, curr);
    const speed = distance / timeDiff;
    
    // Filtrar velocidades improbables
    if (speed <= MAX_SPEED) {
      filtered.push(curr);
    }
  }
  
  return filtered;
};

/**
 * Calcula calorías quemadas
 */
export const calculateCalories = (weightKg, durationHours, speedKmh = 5) => {
  let metValue = 3.5; // Caminata normal (5 km/h)
  if (speedKmh < 3) metValue = 2.5;
  else if (speedKmh > 6) metValue = 5.0;
  
  return metValue * weightKg * durationHours;
};

/**
 * Formatea tiempo (segundos) a HH:MM:SS
 */
export const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formatea distancia (km) con 2 decimales
 */
export const formatDistance = (km) => {
  if (km < 1) return `${(km * 1000).toFixed(0)} m`;
  return `${km.toFixed(2)} km`;
};