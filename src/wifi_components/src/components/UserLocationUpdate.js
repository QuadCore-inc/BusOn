import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Button, View } from "react-native";
import {
  Camera,
  MapView,
  MarkerView,
  ShapeSource,
  LineLayer
} from "@maplibre/maplibre-react-native";

const apiKey = '036c4bbc-768c-4abf-b0dc-a8823629ecff';
const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${apiKey}`;

export function UserLocationUpdate() {
  const [followLocation, setFollowLocation] = useState(false);
  const [location, setLocation] = useState({ longitude: 0, latitude: 0 });
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    let socket = ws;

    if (followLocation) {
      // Se não houver conexão ativa, cria uma nova
      if (!socket) {
        socket = new WebSocket("ws://192.168.100.176:8765");
        setWs(socket);

        socket.onopen = () => {
          console.log("WebSocket conectado.");
          // Envia mensagem inicial ao servidor
          socket.send("131");
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            // Atualiza a localização e acumula as coordenadas para a rota
            setLocation({ longitude: data.longitude, latitude: data.latitude });
            setRouteCoordinates(prev => [
              ...prev,
              { longitude: data.longitude, latitude: data.latitude }
            ]);
          } catch (error) {
            console.error("Erro ao processar a mensagem WebSocket:", error);
          }
        };

        socket.onerror = (error) => {
          console.error("WebSocket Error:", error);
        };

        socket.onclose = () => {
          console.log("WebSocket fechado.");
          setWs(null);
        };
      }
    } else {
      // Se followLocation for desativado e houver uma conexão ativa, fecha-a
      if (socket) {
        socket.close();
        setWs(null);
      }
    }

    // Cleanup: ao desmontar o componente, fecha o WebSocket se existir
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [followLocation, ws]);

  return (
    <>
      <MapView style={styles.map} mapStyle={styleUrl}>
        {routeCoordinates.length > 1 && (
          <ShapeSource
            id="route"
            shape={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: routeCoordinates.map(coord => [coord.longitude, coord.latitude]),
              }
            }}
          >
            <LineLayer
              id="routeLine"
              style={{
                lineColor: "blue",
                lineWidth: 5,
                lineOpacity: 0.5,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </ShapeSource>
        )}

        <MarkerView coordinate={[location.longitude, location.latitude]} anchor={{ x: 0, y: 0.8 }}>
          <View style={styles.marker}>
            <Text style={{ fontSize: 40 }}>🚌</Text>
          </View>
        </MarkerView>

        <Camera centerCoordinate={[location.longitude, location.latitude]} zoomLevel={16} />
      </MapView>

      <View style={styles.infoBox}>
        <Text>📡 Localização Atual do Circular:</Text>
        <Text>Longitude: {location.longitude.toFixed(6)}</Text>
        <Text>Latitude: {location.latitude.toFixed(6)}</Text>
        <Button
          title={followLocation ? "Parar de seguir" : "Seguir Localização"}
          onPress={() => setFollowLocation(prev => !prev)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    alignSelf: "stretch",
  },
  marker: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  infoBox: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
});
