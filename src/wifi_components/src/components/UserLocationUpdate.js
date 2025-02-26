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
    const [followLocation, setFollowLocation] = useState(true); // Estado para seguir ou parar de seguir
    // const [ws, setWs] = useState(null);    

    useEffect(() => {
      const ws = new WebSocket("ws://192.168.100.176:8765");
      const data = JSON.parse(event.data);
      const [location, setLocation] = useState({ longitude: event.longitude, latitude: event.latitude});
      // setWs(websocket);
      
      ws.onmessage = (event) => {
        if (followLocation){
          const data = JSON.parse(event.data);
          setLocation({ longitude: data.longitude, latitude: data.latitude});
        }
        // const data = JSON.parse(event.data);
        // setLocation({ longitude: data.longitude, latitude: data.latitude });
      };
      ws.onerror = (error) => console.error("WebSocket Error:", error);
      ws.onclose = () => console.log("WebSocket Fechado");
  
      return () => ws.close(); 
    }, [followLocation]);
  
    return (
      <>
        <MapView style={styles.map} mapStyle={styleUrl}>
          {/* <UserLocation onUpdate={(newLocation) => setLocation(newLocation)} /> */}
          <MarkerView coordinate={[location.longitude, location.latitude]} anchor={{x:0, y:1}}>

             <View style={{ backgroundColor: "red", padding: 5, borderRadius: 5 }}>
              <Text style={{ color: "black" }}>📍</Text>
            </View>
          </MarkerView>
          {/* <Camera followUserLocation followZoomLevel={16} /> */}
          <Camera centerCoordinate={[location.longitude, location.latitude]} zoomLevel={16} />

        </MapView>
        <View style={{ position: "absolute", top: 10, left: 10, backgroundColor: "white", padding: 10, borderRadius: 5 }}>
          <Text>📡 Localização Atual:</Text>
          <Text>Longitude: {location.longitude}</Text>
          <Text>Latitude: {location.latitude}</Text>
          <Button
            title={followLocation?"Parar de seguir" : "Seguir Localização"}
            onPress={()=>setFollowLocation(!followLocation)}
          />
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