import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Linking, Alert } from 'react-native';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import Geolocation, { GeoPosition, GeoError } from 'react-native-geolocation-service';

function App() {
  const watchId = useRef<number | null>(null);
  const [serviceStarted, setServiceStarted] = useState(false); // Controlar o estado do serviço

  useEffect(() => {
    getPermissions();

    return () => {
      stopLocationUpdates();
    };
  }, []);

  // Função para solicitar permissões
  async function getPermissions() {
    try {
      // Permissão para notificações no Android 13+
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const notificationPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        if (notificationPermission !== 'granted') {
          Linking.openSettings();
          console.log("Notification permission denied");
          return;
        } else {
          console.log("Notification permission granted");
        }
      }

      // Permissão para localização no Android 10 ou superior
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        const backgroundLocationPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
        if (backgroundLocationPermission !== 'granted') {
          Linking.openSettings();
          console.log("Background location permission denied");
          return;
        } else {
          console.log("Background location permission granted");
        }
      }

      // Permissão para localização
      const locationPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (locationPermission !== 'granted') {
        Linking.openSettings();
        console.log("Location permission denied");
        return;
      } else {
        console.log("Location permission granted");
      }

      // Iniciar o serviço de primeiro plano
      await startForegroundService();
      watchMyPositions();
    } catch (error) {
      console.error("Error requesting permissions: ", error);
      Alert.alert("Error", "Failed to request permissions");
    }
  }

  // Função para monitorar a localização
  const watchMyPositions = () => {
    try {
      watchId.current = Geolocation.watchPosition(
        (position: GeoPosition) => {
          console.log(position);
        },
        (error: GeoError) => {
          console.log(error);
        },
        {
          accuracy: {
            android: "high",
          },
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 300,
          fastestInterval: 300,
          forceLocationManager: false,
          showLocationDialog: true,
          useSignificantChanges: false,
          showsBackgroundLocationIndicator: true,
        }
      );
    } catch (error) {
      console.error("Error watching position: ", error);
    }
  };

  // Função para iniciar o serviço de primeiro plano
  const startForegroundService = async () => {
    if (serviceStarted) {
      console.log("Foreground service already started.");
      return; // Impede a reinicialização do serviço
    }

    try {
      // Criar canal de notificação para Android 8 (API 26) ou superior
      if (Platform.Version >= 26) {
        await VIForegroundService.getInstance().createNotificationChannel({
          id: "locationChannel",
          name: "Location Tracking Channel",
          description: "Tracks location of user",
          enableVibration: false,
        });
      }

      // Iniciar o serviço
      await VIForegroundService.getInstance().startService({
        channelId: "locationChannel",
        id: 420,
        title: "Teste Taxi",
        text: "Tracking location updates",
        icon: "ic_launcher", // Certifique-se de que o ícone esteja na pasta correta
      });

      console.log("Foreground service started successfully");
      setServiceStarted(true); // Marcar o serviço como iniciado
    } catch (error) {
      console.error("Error starting foreground service: ", error);
      Alert.alert("Error", "Failed to start foreground service.");
    }
  };

  // Função para parar as atualizações de localização e o serviço de primeiro plano
  const stopLocationUpdates = () => {
    try {
      if (Platform.OS === 'android') {
        VIForegroundService.getInstance().stopService().catch((err: any) => console.error("Failed to stop service", err));
      }

      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }

      setServiceStarted(false); // Resetar o estado do serviço
      console.log("Stopped location updates and foreground service");
    } catch (error) {
      console.error("Error stopping location updates: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Tracking location in the background...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFF',
  },
});

export default App;
