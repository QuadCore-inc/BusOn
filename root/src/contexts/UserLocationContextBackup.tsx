// UserLocationContextBackup.tsx
import React, { useEffect, useState, createContext } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import BackgroundJob from 'react-native-background-actions';
import Geolocation from '@react-native-community/geolocation';
import { LocationData } from '../utils/interfaces';

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const BackgroundLocationContext = createContext({
  userLocation: null,
  isRunning: false,
  startBackgroundTask: async () => {},
  stopBackgroundTask: async () => {},
});

export function BackgroundLocationProvider({ children }: any) {
  const [isRunning, setIsRunning] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationData | null >(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);

      return (
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_BACKGROUND_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const trackLocationTask = async (taskDataArguments: { delay: number } = { delay: 2000 }) => {
    if (!taskDataArguments) {
      throw new Error('taskDataArguments is undefined');
    }
    const { delay } = taskDataArguments;

    while (BackgroundJob.isRunning()) {
      console.log('📍 Obtendo localização...');
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('✅ Localização obtida:', position.coords);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speed: position.coords.speed,
            heading: position.coords.heading,
            user_timestamp: position.timestamp,
          });
        },
        (error) => {
          console.log('❌ Erro ao capturar localização:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      await sleep(delay);
    }
  };

  const options = {
    taskName: 'LocationTracking',
    taskTitle: 'Rastreamento de Localização',
    taskDesc: 'Coletando localização em segundo plano.',
    taskIcon: { name: 'ic_launcher', type: 'mipmap' },
    color: '#ff00ff',
    parameters: { delay: 2000 },
    stopWithTask: false,
  };

  const startBackgroundTask = async () => {
    if (isRunning) return;
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setIsRunning(true);
      await BackgroundJob.start(trackLocationTask, options);
      console.log('✅ Tarefa iniciada!');
    } catch (e) {
      console.log('❌ Erro ao iniciar a tarefa:', e);
      setIsRunning(false);
    }
  };

  const stopBackgroundTask = async () => {
    if (!isRunning) return;
    try {
      await BackgroundJob.stop();
      setIsRunning(false);
      console.log('✅ Tarefa parada!');
    } catch (e) {
      console.log('❌ Erro ao parar a tarefa:', e);
    }
  };

  return (
    <BackgroundLocationContext.Provider
      value={{ userLocation, isRunning, startBackgroundTask, stopBackgroundTask }}
    >
      {children}
    </BackgroundLocationContext.Provider>
  );
}

export default BackgroundLocationContext;