// BackgroundLocationBackup.tsx
import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import BackgroundLocationContext from '../contexts/UserLocationContextBackup';

export default function BackgroundLocation() {
  const { location, isRunning, startBackgroundTask, stopBackgroundTask } =
    useContext(BackgroundLocationContext);

  useEffect(() => {
    console.log('Tarefa em background rodando:', isRunning);
  }, [isRunning]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tarefa rodando: {isRunning ? 'Sim' : 'Não'}</Text>
      <Text style={styles.text}>Rastreamento: {isRunning ? 'Ativo' : 'Parado'}</Text>

      {location ? (
        <Text style={styles.text}>
          📍 Latitude: {location.latitude}{'\n'}
          📍 Longitude: {location.longitude}
        </Text>
      ) : (
        <Text style={styles.text}>Aguardando localização...</Text>
      )}

      <Button
        title={isRunning ? 'Tarefa em execução' : 'Iniciar Rastreamento'}
        onPress={startBackgroundTask}
      />

      <Button
        title="Parar Rastreamento"
        onPress={stopBackgroundTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
  },
});