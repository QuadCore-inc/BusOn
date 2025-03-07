import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, Platform, PermissionsAndroid, ToastAndroid, Alert } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

import { BackgroundLocationProvider } from '../contexts/UserLocationContext'
import BackgroundLocation from './BackgroundLocation'

export default function BackgroundLocationScreen() {

    return (
        <BackgroundLocationProvider>
            <BackgroundLocation />
        </BackgroundLocationProvider>
      );
};


    