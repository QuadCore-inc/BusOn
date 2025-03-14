import {
    Camera,
    MapView,
    UserLocation,
  } from "@maplibre/maplibre-react-native";
  import { useState } from "react";
  import { Text ,StyleSheet } from "react-native";
  
  import { Bubble } from "./Bubble";
  import { sheet } from "./sheet";

  const apiKey = '036c4bbc-768c-4abf-b0dc-a8823629ecff';
  const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${apiKey}`;
  
  export function UserLocationUpdate() {
    const [location, setLocation] = useState(null);
  
    return (
      <>
        <MapView style={styles.map} mapStyle={styleUrl}>
          <UserLocation onUpdate={(newLocation) => setLocation(newLocation)} />
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