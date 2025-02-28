// hooks/useUserLocation.ts
import { useState, useEffect } from "react"
import Geolocation from "@react-native-community/geolocation"
import { PermissionsAndroid, Platform } from "react-native"

const intervalOfUserLocationUpdate = 2000 // Atualiza a cada 2 segundos

interface UserLocationCoords {
  longitude: number
  latitude: number
  altitude: number | null
  heading: number | null
  accuracy: number | null
  speed: number | null
}

interface UserLocationData {
  timestamp: number;
  coords: UserLocationCoords
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocationData | null>(null)

  // Função para solicitar permissão de localização no Android
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } catch (err) {
        console.warn(err)
        return false
      }
    }
    return true
  }

  // Função para obter a localização do usuário
  const updateUserLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const locationData: UserLocationData = {
          timestamp: position.timestamp,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || null,
            heading: position.coords.heading || null,
            accuracy: position.coords.accuracy || null,
            speed: position.coords.speed || null,
          },
        }
        setLocation(locationData)
        console.log("Localização atualizada:", locationData)
      },
      (error) => console.error("Erro ao obter localização:", error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    )
  }

  useEffect(() => {
    const updateInterval = setInterval(updateUserLocation, intervalOfUserLocationUpdate)
    return () => clearInterval(updateInterval) // Limpa o intervalo ao desmontar
  }, []) // Só executa uma vez ao montar o hook

  useEffect(() => {
    console.log(location)
  }, [location])

  return [location, updateUserLocation]
};
