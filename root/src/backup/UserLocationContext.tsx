// UserLocationContext.tsx
import React, { useState, createContext, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from "@react-native-community/geolocation"

const UserLocationContext = createContext({
  location: null,
  getCurrentLocation: async () => {},
});

export function UserLocationProvider({ children }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permissão Negada', 'É necessário permitir o acesso à localização.');
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      (position) => {
        console.log('📍 Localização capturada:', position.coords);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.log('❌ Erro ao capturar localização:', error);
        Alert.alert('Erro ao capturar localização', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <UserLocationContext.Provider value={{ location, getCurrentLocation }}>
      {children}
    </UserLocationContext.Provider>
  );
}

export default UserLocationContext;