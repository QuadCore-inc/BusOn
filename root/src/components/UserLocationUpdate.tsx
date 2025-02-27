import React from "react";
import { Text, StyleSheet } from "react-native";
import { MapView, UserLocation, Camera } from "@maplibre/maplibre-react-native";
import { useUserLocation } from "../hooks/useUserLocation";
import { Bubble } from "./Bubble";

const apiKey = "036c4bbc-768c-4abf-b0dc-a8823629ecff";
const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${apiKey}`;

export function UserLocationUpdate() {
    const location = useUserLocation();

    return (
        <>
            <MapView style={styles.map} mapStyle={styleUrl}>
                <UserLocation />
                <Camera followUserLocation followZoomLevel={16} />
            </MapView>

            <Bubble>
                {location && (
                    <>
                        <Text>Longitude: {location.longitude}</Text>
                        <Text>Latitude: {location.latitude}</Text>
                        <Text>Speed: {location.speed}</Text>
                    </>
                )}
            </Bubble>
        </>
    );
}

const styles = StyleSheet.create({ map: { flex: 1, alignSelf: "stretch" } });
