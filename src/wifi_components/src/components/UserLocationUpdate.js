import {
    Camera,
    MapView,
    UserLocation,
    MarkerView,
  } from "@maplibre/maplibre-react-native";
  import { useState, useEffect } from "react";
  import { Text ,StyleSheet, Button, View } from "react-native";
  
  import { Bubble } from "./Bubble";
  import { sheet } from "./sheet";

  const apiKey = '036c4bbc-768c-4abf-b0dc-a8823629ecff';
  const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${apiKey}`;


  export function UserLocationUpdate() {
    const [location, setLocation] = useState({ longitude: -48.5024, latitude: -1.45502 });
    
    useEffect(() => {
      const ws = new WebSocket("ws://192.168.100.176:8765");
    
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setLocation({ longitude: data.longitude, latitude: data.latitude });
      };
      ws.onerror = (error) => console.error("WebSocket Error:", error);
      ws.onclose = () => console.log("WebSocket Fechado");
  
      return () => ws.close(); 
    }, []);
  
    return (
      <>
        <MapView style={styles.map} mapStyle={styleUrl}>
          {/* <UserLocation onUpdate={(newLocation) => setLocation(newLocation)} /> */}
          <MarkerView coordinate={[location.longitude, location.latitude]}>
            <View style={{ backgroundColor: "red", padding: 5, borderRadius: 5 }}>
              <Text style={{ color: "black" }}>📍 Aqui!</Text>
            </View>
          </MarkerView>
          {/* <Camera followUserLocation followZoomLevel={16} /> */}
          <Camera centerCoordinate={[location.longitude, location.latitude]} zoomLevel={16} />

        </MapView>
        <View style={{ position: "absolute", top: 10, left: 10, backgroundColor: "white", padding: 10, borderRadius: 5 }}>
        <Text>📡 Localização Atual:</Text>
        <Text>Longitude: {location.longitude}</Text>
        <Text>Latitude: {location.latitude}</Text>
      </View>
      </>
    );
  }



  const styles = StyleSheet.create({
    map: {
      flex: 1,
      alignSelf: 'stretch',
    },
    annotationContainer: {
      backgroundColor: 'white',
      padding: 5,
      borderRadius: 5,
    },
    annotationText: {
      color: 'black',
      fontWeight: 'bold',
    },
  });