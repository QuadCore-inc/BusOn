import React, {useEffect, useRef} from 'react';
import {AppState, Button, StyleSheet, Text, View} from 'react-native';
import BackgroundJob from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import notifee from '@notifee/react-native';
import {
  backgroundNotificationOption,
  watchMerchantPosition,
  watchMerchantPositionError,
  watchMerchantPositionSuccess,
} from './utils';

export default function BackgroundNotificationWithActions() {
  const watchId = useRef<number | null>(null);

  BackgroundJob.on('expiration', () => {
    console.log('iOS: Background job expired!');
  });

  async function displayNotification(message: string) {
    console.log(`Notification: ${message}`);
    await notifee.displayNotification({
      title: 'Background Location',
      body: message,
      android: {
        channelId: 'background-location',
        smallIcon: 'ic_launcher',
      },
    });
  }

  const stopBackgroundTracking = async () => {
    if (BackgroundJob.isRunning()) {
      console.log('Stopping background tracking...');
      await BackgroundJob.stop();
      Geolocation.clearWatch(watchId.current as never);
      await displayNotification('Background tracking stopped');
    }
    console.log('Background tracking stopped');
  };

  async function startBackgroundJob() {
    try {
      console.log('Attempting to start background job...');
      await BackgroundJob.start(async () => {
        console.log('Background job started');
        await displayNotification('Background tracking started');

        await new Promise<void>(async resolve => {
          watchId.current = watchMerchantPosition(
            position => {
              console.log(`New position: Lat ${position.coords.latitude}, Lng ${position.coords.longitude}`);
              displayNotification(`Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`);
              return watchMerchantPositionSuccess(position);
            },
            error => {
              console.error(`Location error: ${error.message}`);
              displayNotification(`Error: ${error.message}`);
              return watchMerchantPositionError(error);
            },
          );
        });
      }, backgroundNotificationOption);
    } catch (error) {
      console.error('Background job error:', error);
      await displayNotification(`Error: ${error.message}`);
    }
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>
        Background Location Notification with react-native-background-actions
        and react-native-geolocation-service
      </Text>
      <Button title="Start task" onPress={startBackgroundJob} />
      <Button title="Stop task" onPress={stopBackgroundTracking} />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 20,
  },
  highlight: {
    fontWeight: '700',
  },
});
