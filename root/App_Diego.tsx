import React, { useEffect } from "react";
import { View, 
    StyleSheet, 
    Alert, 
    Platform, 
    PermissionsAndroid,
    Linking,

} from "react-native";

import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer'

const App: React.FC = () => {
    console.log("Running App");

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            // Solicita permissão de localização FINE (necessária para o foreground)
            const fineLocation = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );

            if (fineLocation !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("Permissão Negada", "É necessário permitir o acesso à localização.");
                return false;
            }

            // Se Android 10+ (API 29+), solicita permissão para background location
            if (Platform.Version >= 29) {
                const backgroundLocation = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
                );

                if (backgroundLocation !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert(
                        "Permissão de Localização em Segundo Plano",
                        "Por favor, habilite a permissão nas configurações."
                    );
                    Linking.openSettings();
                }
            }
        }

        return true;
    }

    const getCurrentPosition = async () => {
        
        BackgroundTimer.runBackgroundTimer(() => {
            Geolocation.getCurrentPosition(
                (pos) => {
                    console.log("Current Position:", pos);
                },
                (error) => {
                    Alert.alert('GetCurrentPosition Error', JSON.stringify(error));
                },
                { enableHighAccuracy: true }
            )
        }, 2000)
    }

    useEffect(() => {
        (async () => {
            const hasPermission = await requestPermissions();
            if (hasPermission) {
                // Executa a cada 5 segundos em background
                const intervalId = BackgroundTimer.runBackgroundTimer(() => {
                    getCurrentPosition();
                }, 5000);

                // Cleanup do timer ao desmontar o componente
                return () => BackgroundTimer.stopBackgroundTimer();
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: '#FFF'
    },
});

export default App;