import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import WifiDetails from './components/WifiDetails'; // Importe o componente WifiDetails

const App = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="dark-content" />
      <WifiDetails /> {/* Use o componente WifiDetails */}
    </SafeAreaView>
  );
};

export default App;
