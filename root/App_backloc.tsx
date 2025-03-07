import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, PermissionsAndroid, ToastAndroid, Alert } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

import BackgroundLocationScreen from './src/components/UserLocationScreen'

const App = () => {

  return (
    <BackgroundLocationScreen />
  );
};

export default App;