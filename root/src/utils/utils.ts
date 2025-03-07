import Geolocation from 'react-native-geolocation-service';

export const backgroundNotificationOption = {
  taskName: 'BackgroundTracking',
  taskTitle: 'Tracking Location',
  taskDesc: 'App is tracking location in the background',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  parameters: {
    delay: 1000,
  },
  linkingURI: 'myapp://tracking', 
};

export function watchMerchantPosition(successCallback, errorCallback) {
  return Geolocation.watchPosition(
    successCallback,
    errorCallback,
    {
      enableHighAccuracy: true,
      distanceFilter: 10, // Atualiza a cada 10 metros
      interval: 5000, // Atualiza a cada 5 segundos
      fastestInterval: 2000,
    }
  );
}

export function watchMerchantPositionSuccess(position) {
  console.log('Position updated:', position);
  return position;
}

export function watchMerchantPositionError(error) {
  console.error('Geolocation error:', error);
  return error;
}
