import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import BackgroundService from 'react-native-background-actions';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

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
  taskName: 'ExampleTask',
  taskTitle: 'ExampleTask title',
  taskDesc: 'Contador: 0', // Descrição inicial da notificação
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourScheme://chat/jane', // Deep Linking (opcional)
  parameters: {
    delay: 1000, // Intervalo de 1 segundo
  },
};

const App = () => {
  const [isRunning, setIsRunning] = useState(false);

  const startBackgroundTask = async () => {
    try {
      await BackgroundService.start(veryIntensiveTask, options);
      console.log('Background task started');
      setIsRunning(true);
    } catch (e) {
      console.log('Error starting background task', e);
    }
  };

  const stopBackgroundTask = async () => {
    try {
      await BackgroundService.stop();
      console.log('Background task stopped');
      setIsRunning(false);
    } catch (e) {
      console.log('Error stopping background task', e);
    }
  };

  useEffect(() => {
    return () => {
      stopBackgroundTask();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>React Native Background Actions Example</Text>
      <Button
        title={isRunning ? 'Background Task Running' : 'Start Background Task'}
        onPress={startBackgroundTask}
        disabled={isRunning}
      />
      <Button
        title="Stop Background Task"
        onPress={stopBackgroundTask}
        disabled={!isRunning}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default App;