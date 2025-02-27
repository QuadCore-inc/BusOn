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
  
    // 🔥 Atualiza a localização do usuário
    const updateUserLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, heading, altitude, speed } =
            position.coords;
          const newLocation = {
            timestamp: position.timestamp,
            coords: {
              latitude,
              longitude,
              accuracy,
              heading,
              altitude, // 🔥 Corrigido "altiiude" para "altitude"
              speed,
            },
          };
  
          setLocation(newLocation);
          sendLocationToAPI(newLocation); // 🔥 Chama a API imediatamente
        },
        (error) => {
          console.error("Erro ao obter localização: ", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
        }
      );
    };
  
    // 🔥 Envia a localização para a API
    const sendLocationToAPI = async (newLocation: UserLocationData) => {
      try {
        const response = await axios.post("http://192.168.100.102:5000/localizacao", {
          ssid: "buson-306-01",
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          speed: newLocation.coords.speed || 0,
          timestamp: newLocation.timestamp,
        });
  
        console.log("Resposta da API:", response.data);
      } catch (error) {
        console.error("Erro na requisição:", error);
        if (error.response) {
          console.error("Resposta com erro:", error.response);
        } else if (error.request) {
          console.error("Sem resposta recebida:", error.request);
        } else {
          console.error("Erro desconhecido:", error.message);
        }
      }
    };
  
    useEffect(() => {
      const intervalId = setInterval(updateUserLocation, intervalOfUserLocationUpdate);
  
      return () => clearInterval(intervalId); 
    }, []);
  
    return (
      <>
        <MapView style={styles.map} mapStyle={styleUrl}>
          <UserLocation
            onUpdate={(newLocation) => setLocation(newLocation)}
            renderMode="native"
          />
          <Camera followUserLocation followZoomLevel={16} />
        </MapView>
  
        <Bubble>
          {location && (
            <>
              <Text>Timestamp: {location.timestamp}</Text>
              <Text>Longitude: {location.coords.longitude}</Text>
              <Text>Latitude: {location.coords.latitude}</Text>
              <Text>Altitude: {location.coords.altitude}</Text>
              <Text>Heading: {location.coords.heading}</Text>
              <Text>Accuracy: {location.coords.accuracy}</Text>
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
  