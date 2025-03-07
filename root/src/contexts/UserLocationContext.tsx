import React, { useEffect, useState, createContext } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import BackgroundService from 'react-native-background-actions';

import Geolocation from 'react-native-geolocation-service';

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const BackgroundLocationContext = createContext({
  value: 0,
  setValue: (val: number) => {},
  location: null,
  isRunning: false,
  startBackgroundTask: async () => {},
  stopBackgroundTask: async () => {},
});

export function BackgroundLocationProvider(props: any) {
  const [value, setValue] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [location, setLocation] = useState(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);

      return (
        granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' &&
        granted['android.permission.ACCESS_BACKGROUND_LOCATION'] === 'granted'
      );
    }
    return true;
  };

  const trackLocationTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;

    await new Promise(async (resolve) => {
      let counter = 0;
      while (BackgroundService.isRunning()) {
        console.log('Capturando localização...');

        await BackgroundService.updateNotification({
          taskDesc: `Coletando localização: ${counter}`
        });

        Geolocation.getCurrentPosition(
          (position) => {
            console.log('📍 Localização capturada:', position.coords);
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.log('❌ Erro ao capturar localização:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            forceRequestLocation: true,
          }
        );


        await sleep(delay);
      }
    });
  };

  const watchLocationTask = async (taskDataArguments) => {
    console.log("Iniciando rastreamento!");
    const { delay } = taskDataArguments;
    let counter = 0;

    await new Promise(async (resolve) => {
      const watchId = Geolocation.watchPosition(
        (position) => {
          console.log("Localização atualizada!");
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log("Erro ao capturar localização: ", error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: delay,
          fastestInterval: 5000,
        }
      );

      while(BackgroundService.isRunning()) {
        await sleep(delay);
      }

      Geolocation.clearWatch(watchId);
      resolve();
    });
  };
    

  const veryIntensiveTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    let counter = 0;
  
    await new Promise(async (resolve) => {
      while (BackgroundService.isRunning()) {
        console.log('Running background task...', counter);
        counter++;
  
        // Atualiza a notificação com o contador
        await BackgroundService.updateNotification({
          taskDesc: `Contador: ${counter}`, // Atualiza a descrição da notificação
        });
  
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'LocationTracking',
    taskTitle: 'Rastreamento de Localização',
    taskDesc: 'Contador: 0',
    taskIcon: { name: 'ic_launcher', type: 'mipmap' },
    color: '#ff00ff',
    linkingURI: 'yourScheme://chat/jane',
    parameters: { delay: 5000 },
    stopWithTask: false,
  };

  const startBackgroundTask = async () => {
    console.log('Tentando iniciar a tarefa...');
    if (isRunning) {
      console.log('⚠️ Já está rodando!');
      return;
    }
  
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.log('Permissões negadas.');
      return;
    }
  
    try {
      setIsRunning(true); // 🔥 Atualiza estado ANTES de iniciar o serviço
  
      await BackgroundService.start(watchLocationTask, options);
  
      console.log('✅ Tarefa iniciada!');
    } catch (e) {
      console.log('❌ Erro ao iniciar a tarefa:', e);
      setIsRunning(false); // 🔥 Reverte estado caso falhe
    }
  };
  
  const stopBackgroundTask = async () => {
    console.log('Tentando parar a tarefa...');
    if (!isRunning) {
      console.log('⚠️ Nenhuma tarefa rodando!');
      return;
    }
  
    try {
      await BackgroundService.stop();
      console.log('✅ Tarefa parada!');
      setIsRunning(false); // 🔥 Atualiza estado corretamente
    } catch (e) {
      console.log('❌ Erro ao parar a tarefa:', e);
    }
  };
  

  // Adicionando useEffect para verificar se o estado isRunning está mudando corretamente
  useEffect(() => {
    console.log('Estado isRunning mudou:', isRunning);
  }, [isRunning]);

  return (
    <BackgroundLocationContext.Provider
      value={{
        value,
        setValue,
        location,
        isRunning,
        startBackgroundTask,
        stopBackgroundTask,
      }}
    >
      {props.children}
    </BackgroundLocationContext.Provider>
  );
}

export default BackgroundLocationContext;
