import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import BackgroundLocationContext from '../contexts/UserLocationContext';

export default function BackgroundLocation() {
  const { value, isRunning, location, startBackgroundTask, stopBackgroundTask } =
    useContext(BackgroundLocationContext);

  useEffect(() => {
    console.log('Tarefa em background rodando:', isRunning);
  }, [isRunning]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Valor do Contexto: {value}</Text>
      <Text style={styles.text}>Tarefa rodando: {isRunning ? 'Sim' : 'Não'}</Text>
      <Text style={styles.text}>Rastreamento: {isRunning ? 'Ativo' : 'Parado'}</Text>

      {location ? (
        <Text style={styles.text}>
          📍 Latitude: {location.latitude}{'\n'}
          📍 Longitude: {location.longitude}
        </Text>
        ) : (
            <Text style={styles.text}>Aguardando localização</Text>
      )}

      <Button
        title={isRunning ? 'Tarefa em execução' : 'Iniciar Rastreamento'}
        onPress={startBackgroundTask}
        // disabled={isRunning}
      />

      <Button
        title="Parar Rastreamento"
        onPress={stopBackgroundTask}
        // disabled={!isRunning}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
  },
});
