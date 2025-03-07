import React, { useEffect } from 'react';
import { Button, View, Text, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import VIForegroundService from '@voximplant/react-native-foreground-service';

async function requestNotificationPermission() {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert("Permissão necessária", "Ative as notificações para o serviço funcionar corretamente.");
    }
  }
}

async function startForegroundService() {
  console.log("🔵 Iniciando o serviço em primeiro plano...");

  const channelId = "foreground_service_channel";

  await VIForegroundService.createNotificationChannel({
    id: channelId,
    name: "Foreground Service",
    description: "Notificação para serviço de primeiro plano",
    enableVibration: false,
  });

  await VIForegroundService.startService({
    channelId,
    id: 420,
    title: "Serviço em Primeiro Plano",
    text: "O serviço está ativo em segundo plano.",
    icon: "ic_launcher",  // Verifique se o ícone está na pasta de recursos
  });

  console.log("🟢 Serviço em primeiro plano iniciado!");
}

function App() {
  useEffect(() => {
    requestNotificationPermission();
    startForegroundService();

    return () => {
      // Parar o serviço quando o componente for desmontado
      VIForegroundService.stopService();
      console.log("🛑 Serviço em primeiro plano parado!");
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Serviço em Primeiro Plano</Text>
      <Button title="Iniciar Serviço" onPress={startForegroundService} />
      <Button title="Parar Serviço" onPress={() => VIForegroundService.stopService()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default App;
