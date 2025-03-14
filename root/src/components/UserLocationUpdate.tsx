import React from "react";
import { Text, StyleSheet } from "react-native";
import { MapView, UserLocation, Camera } from "@maplibre/maplibre-react-native";
import { useUserLocation } from "../hooks/useUserLocation";
import { Bubble } from "./Bubble";

const apiKey = "036c4bbc-768c-4abf-b0dc-a8823629ecff";
const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${apiKey}`;

const intervalOfUserLocationUpdate = 2000;

function UpdateUserLocation() {
    const location = useUserLocation(); // Certificando-se de que 'location' seja o primeiro valor retornado pelo hook

    return (
        <>
            <MapView style={styles.map} mapStyle={styleUrl}>
                <UserLocation onUpdate={(newLocation) => setLocation(newLocation)} renderMode='native'/>
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

const styles = StyleSheet.create({ map: { flex: 1, alignSelf: "stretch" } });

export default UpdateUserLocation;
