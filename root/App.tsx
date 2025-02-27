import React from 'react';
import { StyleSheet, View } from 'react-native';
import { UserLocationUpdate } from './src/components/UpdateLocation';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  } as const, // Define as propriedades como constantes para evitar mutabilidade

  map: {
    flex: 1,
    alignSelf: 'stretch',
  } as const,
});

const App: React.FC = () => {
  return (
    <View style={styles.page}>
      {/* <MapComponent /> */}
      <UserLocationUpdate />
    </View>
  );
};

export default App;
