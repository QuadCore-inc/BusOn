import {
      Camera,
      MapView,
      UserLocation,
    } from "@maplibre/maplibre-react-native";
import { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { Bubble } from "./Bubble";
import axios from "axios";
import Geolocation from "@react-native-community/geolocation";

const apiKey = "036c4bbc-768c-4abf-b0dc-a8823629ecff";
const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${apiKey}`;
    
interface UserLocationCoords {
  longitude: number;
  latitude: number;
  altitude: number | null;
  heading: number | null;
  accuracy: number | null;
  speed: number | null;
}

interface UserLocationData {
  timestamp: number;
  coords: UserLocationCoords;
}
    
const intervalOfUserLocationUpdate = 1000; // Atualiza a cada 1s
    
export function UserLocationUpdate() {
  const [location, setLocation] = useState<UserLocationData | null>(null);

  const requestLocationPermission = async () => {
      try {
          const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
          console.warn(err);
          return false;
      }
  };

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
            };
            setLocation(locationData);
        },
        (error) => console.error("Erro ao obter localização:", error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

    
  useEffect(() => {
    const intervalId = setInterval(updateUserLocation, intervalOfUserLocationUpdate);

    return () => clearInterval(intervalId); 
  }, []);

  useEffect(() => {
    console.log(location)
  }, [location])
    
  return (
    <>
        <MapView style={styles.map} mapStyle={styleUrl}>
            <UserLocation />
            <Camera followUserLocation followZoomLevel={16} />
        </MapView>

        <Bubble>
            {location && (
                <>
                    <Text>Longitude: {location.coords.longitude}</Text>
                    <Text>Latitude: {location.coords.latitude}</Text>
                    <Text>Speed: {location.coords.speed}</Text>
                </>
            )}
        </Bubble>
    </>
  );
}
    
const styles = StyleSheet.create({
  map: {
    flex: 1,
    alignSelf: "stretch",
  },
});