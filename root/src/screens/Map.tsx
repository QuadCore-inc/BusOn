import React from "react";
import {
    Camera,
    MapView,
    UserLocation,
  } from "@maplibre/maplibre-react-native";

import { mapStyleUrl } from "../utils/apiKeys";
import { MapStyle } from "../utils/styles";

export default function Map() {
    return (
        <>
        <MapView style={MapStyle.map} mapStyle={mapStyleUrl}>
            <UserLocation  renderMode="native"/>
            <Camera followUserLocation followZoomLevel={16} />
        </MapView>
        </>
    );
}