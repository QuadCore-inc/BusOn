import { useState, useEffect } from "react";
import Geolocation from "@react-native-community/geolocation";
import axios from "axios";
import { PermissionsAndroid, Platform } from "react-native";
import { useSendLocationToAPI } from "../hooks/useSendLocationToAPI";  // Importe o hook aqui

const API_HOST = "200.239.93.249";
const intervalOfUserLocationUpdate = 1000;

export const useUserLocation = () => {
    const [location, setLocation] = useState<any>(null);
    const { sendLocation } = useSendLocationToAPI();  // Utilize o hook para enviar dados

    const requestLocationPermission = async () => {
        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        requestLocationPermission().then((hasPermission) => {
            if (!hasPermission) return;

            const updateUserLocation = () => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        setLocation(position.coords);
                        sendLocation({
                            ssid: "Buson",  // Você pode adicionar o SSID que precisa aqui
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            speed: position.coords.speed || 0,
                            timestamp: position.timestamp,
                        }); // Envia a localização para a API
                    },
                    (error) => console.error("Erro ao obter localização:", error),
                    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                );
            };

            const intervalId = setInterval(updateUserLocation, intervalOfUserLocationUpdate);
            return () => clearInterval(intervalId);
        });
    }, [sendLocation]);

    return location;
};
