// BackgroundLocation.tsx
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import UserLocationContext from '../contexts/UserLocationContext';

export default function BackgroundLocation() {
  const { location, getCurrentLocation } = useContext(UserLocationContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sua Localização Atual:</Text>
      {location ? (
        <Text style={styles.text}>
          📍 Latitude: {location.latitude}{'\n'}
          📍 Longitude: {location.longitude}
        </Text>
      ) : (
        <Text style={styles.text}>Obtendo localização...</Text>
      )}
      <Button title="Atualizar Localização" onPress={getCurrentLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
});