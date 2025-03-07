import React, {useEffect} from 'react';
import {Button, View} from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

export default function App() {

    const requestNotificationPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          )
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permissão de notificação negada!")
          }
        }
      }

    useEffect(() => {
        requestNotificationPermission()

        ReactNativeForegroundService.add_task(() => log(), {
        delay: 1000,
        onLoop: true,
        taskId: 'taskid',
        onError: e => console.log(`Error logging:`, e),
        })

    }, [])

  const startTask = () => {
    console.log("Tentando iniciar o serviço de foreground...");
    ReactNativeForegroundService.start({
      id: 1244,
      title: 'Foreground Service',
      message: 'We are live World',
      icon: 'ic_launcher',
      button: true,
      button2: true,
      buttonText: 'Button',
      button2Text: 'Anther Button',
      buttonOnPress: 'cray',
      setOnlyAlertOnce: true,
      color: '#000000',
      progress: {
        max: 100,
        curr: 50,
      },
    })
  }

  const stopTask = () => {
    console.log("Stop Service triggered")
    ReactNativeForegroundService.stopAll();
  };

  return (
    <View>
      <Button onPress={startTask} title="Start The foreground Service" />
      <Button onPress={stopTask} title="Stop The foreground Service" />
    </View>
  );
}

const log = () => console.log('Hellow World');