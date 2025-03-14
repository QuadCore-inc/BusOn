import { 
  StyleSheet, Text, View, PermissionsAndroid, Platform, Button, Alert 
} from 'react-native';
import React, { useEffect } from 'react';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

const App = () => {

  // Solicitar permissão no Android 13+ para exibir notificações
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
    if (Platform.OS === 'android') {
      await ReactNativeForegroundService.start({
        id: 1,
        title: 'Meu Serviço',
        message: 'Rodando em segundo plano',
        icon: 'ic_launcher',
        importance: 'high',
      });

      ReactNativeForegroundService.update({
        id: 1,
        title: 'Meu Serviço Atualizado',
        message: 'Ainda rodando...',
      });
    }
  }

  useEffect(() => {
    requestNotificationPermission();
    startForegroundService();

    return () => {
      // Parar o serviço quando o componente for desmontado
      ReactNativeForegroundService.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Oi</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});
