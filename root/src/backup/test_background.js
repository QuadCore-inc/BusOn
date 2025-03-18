import { PermissionsAndroid } from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import RNLocation from 'react-native-location';

ReactNativeForegroundService.register({
    config: {
      alert: true,
      onServiceErrorCallBack: () => {
        console.error("Foreground service error occurred");
      },
    }
  })
  


// // Função para solicitar permissões necessárias
// export const requestPermissions = async () => {
//   const fineLocationGranted = await PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//   );
  
//   if (fineLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
//     console.log('Permissão de localização precisa negada');
//     return false;
//   }

//   const backgroundLocationGranted = await PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
//     {
//       title: 'Permissão de Localização em Segundo Plano',
//       message: 'Precisamos acessar sua localização para fornecer atualizações em tempo real.',
//       buttonNeutral: 'Perguntar depois',
//       buttonNegative: 'Cancelar',
//       buttonPositive: 'OK',
//     }
//   );

//   if (backgroundLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
//     console.log('Permissão de localização em segundo plano negada');
//     return false;
//   }

//   return true;
// };

// // Configuração da biblioteca de localização
// RNLocation.configure({
//   distanceFilter: 1,
//   desiredAccuracy: {
//     ios: 'best',
//     android: 'balancedPowerAccuracy',
//   },
//   androidProvider: 'auto',
//   interval: 5000,
//   fastestInterval: 10000,
//   maxWaitTime: 5000,
//   activityType: 'other',
//   allowsBackgroundLocationUpdates: true,
//   headingFilter: 1,
//   headingOrientation: 'portrait',
//   pausesLocationUpdatesAutomatically: false,
//   showsBackgroundLocationIndicator: false,
// });

// let locationSubscription = null
// let locationTimeout = null

// // Função principal para iniciar o rastreamento de localização
// export const startLocationTracking = async () => {
//     console.log("Tentando nessa poorra")
//     const hasPermission = await requestPermissions();
//     if (!hasPermission) {
//         console.log("Permissões não concedidas. Rastreamento cancelado.")
//         return
//     }
  
//     const granted = await RNLocation.requestPermission({
//         ios: 'whenInUse',
//         android: { detail: 'fine' },
//     })
  
//     console.log("Permissão de localização concedida:", granted)
    
//     if (!granted) {
//         console.log("Permissão de localização negada pelo usuário.")
//         return
//     }
  
//     if (locationSubscription) {
//         locationSubscription() // Cancela qualquer assinatura ativa
//         locationSubscription = null
//     }
  
//     locationSubscription = RNLocation.subscribeToLocationUpdates(
//       ([location]) => {
//         console.log('Localização atual:', location)
        
//         if (locationTimeout) {
//             clearTimeout(locationTimeout)
//             locationTimeout = null
//         }
//       }
//     )
// }
  

// // Iniciar serviço em primeiro plano
// export const startForegroundService = () => {
//     console.log("CU")
//     // Iniciar o serviço em primeiro plano
//     ReactNativeForegroundService.start({
//         id: 144,
//         title: "Localização em Tempo Real",
//         message: "Estamos rastreando sua localização em tempo real.",
//         icon: "ic_launcher", // Certifique-se de que este ícone existe no projeto
//         importance: "low",
//     });

//     ReactNativeForegroundService.add_task(
//         startLocationTracking,
//         {
//             delay: 1000,
//             onLoop: true,
//             taskId: 'location_tracking_task',
//             onError: (e) => console.log('Erro ao rastrear localização:', e),
//         }
//     )
// }

// export const startForegroundService = () => {
//     return console.log("cuzinho")
// }

// ReactNativeForegroundService.start({
//     id: 144,
//     title: "Localização em Tempo Real",
//     message: "Estamos rastreando sua localização em tempo real.",
//     icon: "ic_launcher",
//     importance: "low",
//     number: 10,
//   });
  
// ReactNativeForegroundService.add_task(
// () => {
//     console.log("Tarefa em primeiro plano executada");
// },
// {
//     delay: 1000,
//     onLoop: true,
//     taskId: "location_tracking_task",
//     onError: (e) => console.log('Erro ao rastrear localização:', e),
// }
// );
