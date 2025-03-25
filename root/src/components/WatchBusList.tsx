import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, Button, View, TouchableOpacity, Image, TextInput, ScrollView, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Bus } from '../utils/interfaces';
import { Camera, MapView, ShapeSource, CircleLayer, UserLocation, Images, SymbolLayer, MapViewRef } from "@maplibre/maplibre-react-native";
import { mapStyleUrl, LOCAL_WEBSOCKET, RENDER_WEBSOCKET, WEBSOCKET_API_AWS } from '../utils/apiKeys';
import { GestureHandlerRootView, Switch } from "react-native-gesture-handler";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
import CustomDrawer from "./CustomDrawer";
import BeaconCrowdsourcing from "../contexts/BeaconCrowdsourcing";
import CustomDrawer2 from "./CustomDrawer2";
import BottomSheetBus from "../screens/Bottom";

import { CustomDrawerBottomSheet } from "../screens/Bottom";
import Geolocation from "@react-native-community/geolocation";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

export default function WatchBus() {
  const mapRef = useRef(null);
  const cameraRef = useRef(null); // Ref para a câmera

  const busesLines = useSelector((state: any) => state.busesLines); // Acessa o estado buses
  const userLocation = useSelector((state: any) => state.user_location);
  const dispatch = useDispatch();
  
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [followBuses, setfollowBuses] = useState(false); // Controle do estado de seguir localização
  const [cameraLocation, setCameraLocation] = useState<number[] | null>(null);

  const [selectedBus, setSelectedBus] = useState<Bus | null>(null); // Estado para o ônibus selecionado
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(true);

  const websocketAPIHost = useSelector((state: any) => state.websocketAPIHost); // Acessa o estado buses
  const [followUserLocation, setFollowUserLocation] = useState(false);
  const [cameraKey, setCameraKey] = useState(0);

  const handleGoToUserLocation = () => {
    console.log("Going to user location: ", userLocation);
    if (cameraRef.current && userLocation) {
      setFollowUserLocation(true);
      cameraRef.current?.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        zoomLevel: 14,
        animationDuration: 2000,
      });
      setTimeout(() => {
        setFollowUserLocation(false);
      }, 2000);
      setTimeout(() => {
        setCameraKey((prev) => prev + 1);
      }, 5000);
    }
  };

  useEffect(() => {
    if (selectedBus && selectedBus.location) {  
      // Chama o setCamera para animar para a posição do ônibus
      cameraRef.current?.setCamera({
        centerCoordinate: [selectedBus.location.longitude, selectedBus.location.latitude - 0.002],
        zoomLevel: 16,
        animationDuration: 2000,
      });
  
      // Após 2 segundos (quando a animação termina), libera o tracking
      setTimeout(() => {
        setFollowUserLocation(false);
      }, 2000);
  
      // Após 5 segundos, forçamos um re-render da câmera (se necessário)
      setTimeout(() => {
        setCameraKey((prev) => prev + 1);
      }, 4000);
    }
  }, [selectedBus]);
  

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position: any) => {
          console.log("Tela de localização carregada! User's location: ", position.coords);
          let location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              speed: position.coords.speed,
              heading: position.coords.heading,
              user_timestamp: position.timestamp,
          }
          dispatch({type: "updateUserLocation", payload: location});
      },
      (error: any) => {
          console.log('Erro ao capturar localização:', error);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
  );
  }, []); 

  useEffect(() => {
    console.log("User's location updated in App global state: ", userLocation)
  }, [userLocation])

  // Efeito para controlar o WebSocket
  useEffect(() => {
    let socket = ws;

    if (followBuses) {
      if (!socket) {
        socket = new WebSocket(`ws://${websocketAPIHost}:8765`);
        setWs(socket);

        socket.onopen = () => {
          console.log("WebSocket conectado.");
          const activeLines = busesLines.filter((line: any) => line.isLineActive);
          const activeBusesIds = activeLines
            .map((line: any) => {
              const activeBusesInLine = line.lineBuses
                .filter((bus: any) => bus.isBusActive)
                .map((bus: any) => `${line._id}/${bus._id}`);
              return activeBusesInLine;
            })
            .flat();
          socket?.send(JSON.stringify(activeBusesIds));
          console.log("Enviado para o WebSocket:", activeBusesIds);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Dados recebidos do WebSocket:", data);
            data.forEach((busUpdate: { _id: string, location: any }) => {
              const [lineId, busId] = busUpdate._id.split('/');
              const line = busesLines.find((line: any) => line._id === lineId);
              if (line) {
                const bus = line.lineBuses.find((bus: any) => bus._id === busId);
                if (bus) {
                  const updatedLocation = {
                    latitude: busUpdate.location.latitude,
                    longitude: busUpdate.location.longitude,
                    speed: busUpdate.location.speed,
                    heading: busUpdate.location.heading,
                    user_timestamp: new Date(busUpdate.location.time).getTime(),
                  };
                  dispatch({
                    type: 'updateBusLocation',
                    payload: {
                      busId: bus._id,
                      lineKey: line._id,
                      location: updatedLocation,
                    },
                  });
                }
              }
            });
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
      if (socket) {
        socket.close();
        setWs(null);
      }
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [followBuses]); // Dependência apenas de followBuses

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableOpacity style={styles.floatingButton} onPress={handleGoToUserLocation}>
          <Image source={require("../../assets/bus-icon.png")} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
        <MapView
          ref={mapRef}
          style={styles.map}
          mapStyle={mapStyleUrl}
        >
          <UserLocation renderMode="native" />
          <Camera
            ref={cameraRef}
            key={cameraKey}
            followUserLocation={followUserLocation}
          />
          <Images images={{ busIcon: require("../../assets/bus-icon-2.png") }} />
          <ShapeSource
            id="buses"
            shape={{
              type: "FeatureCollection",
              features: busesLines
                .filter((line) => line.isLineActive) // Apenas linhas ativas
                .flatMap((line) => line.lineBuses) // Junta os ônibus das linhas ativas
                .filter((bus) => bus.isBusActive) // Filtra os ônibus ativos
                .map((bus) => ({
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [bus.location.longitude, bus.location.latitude], // Coordenadas do ônibus
                  },
                  properties: {
                    id: bus._id,
                    name: bus.name,
                    icon: 'busIcon'
                  },
                })),
            }}
          >
            <SymbolLayer
              id="busIcons"
              style={{
                iconImage: ["get", "icon"], // Usa o ícone associado ao Feature
                iconSize: [
                  "interpolate",
                  ["exponential", 1.5], // Crescimento exponencial mais suave
                  ["zoom"],
                  4, 0.1,  
                  6, 0.2,  
                  8, 0.3,  
                  10, 0.4,  
                  14, 0.6,  
                  16, 0.7,
                  18, 1.2,  
                  20, 1.5,  
                  25, 3
                ],
                iconAllowOverlap: true, // Permite sobreposição
                iconIgnorePlacement: true, // Evita que sumam por colisão
              }}
            />
          </ShapeSource>
        </MapView>
        
        <CustomDrawerBottomSheet
            isOpen={isBottomSheetOpen}
            onClose={() => setIsBottomSheetOpen(false)}
            >
            <View style={
              {
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}> 
              <Text style={styles.drawerTitle}>Seus ônibus ativos</Text>
              <View style={{
                flexDirection: 'row',

              }}> 
                <Text style={styles.drawerTitle}> Seguir </Text>
                <Switch 
                  value={followBuses}
                  onValueChange={() => setfollowBuses((prev) => !prev)}
                  />
              </View>
          </View>
          <BottomSheetScrollView 
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >  
            <View style={{ flex: 1 }}>
              {busesLines
                .filter((line: any) => line.isLineActive) // Filtra apenas as linhas ativas
                .map((busLine: any) => {
                  // console.log("BusLine:", busLine); // Log para verificar o objeto da linha
                  
                  // Acessando diretamente a chave lineBuses, pois não há chave dinâmica como 'line_'
                  const busesInLine = busLine.lineBuses;
                  if (!busesInLine) {
                    console.log("Linha sem ônibus", busLine);
                    return null; // Se não houver ônibus na linha, não renderiza nada
                  }
                  
                  // console.log("Ônibus da linha:", busesInLine);
                  
                  return (
                    <View key={busLine._id} style={styles.lineContainer}>
                      <Text style={styles.lineTitle}>Linha: {busLine.lineName}</Text>
    
                      {busesInLine
                        .filter((bus: any) => bus.isBusActive) // Filtra apenas os ônibus ativos
                        .map((bus: Bus) => {
                          // console.log("Bus Ativo:", bus); // Log para verificar cada ônibus ativo
                          return (
                            <TouchableOpacity
                            key={bus._id}
                            style={styles.busItem}
                            onPress={() => setSelectedBus(bus._id === selectedBus?._id ? null : bus)} // Alterna a seleção do ônibus
                            >
                              <Text style={styles.busName}>{bus.name}</Text>
    
                              {selectedBus?._id === bus._id && (
                                <View style={styles.busLocationInfoBox}>
                                  <Text style={styles.locationInfoText}>Lat: {bus.location.latitude.toFixed(6)}</Text>
                                  <Text style={styles.locationInfoText}>Long: {bus.location.longitude.toFixed(6)}</Text>
                                  <Text style={styles.locationInfoText}>Vel: {bus.location.speed} km/h</Text>
                                  <Text style={styles.locationInfoText}>Direção: {bus.location.heading}°</Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          );
                        })}
                    </View>
                  );
                })}
            </View>
          </BottomSheetScrollView>
        </CustomDrawerBottomSheet>
      </GestureHandlerRootView>
    </>
  );
}

const colorAcai = 'rgba(87,41,100,1.0)'
const colorWhite = 'rgba(255,255,255,1.0)'

const styles = StyleSheet.create({
  map2: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoBox2: {
    position: 'absolute',
    bottom: 0,
    width: "100%",
    backgroundColor: colorWhite,
    padding: 20,
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  infoBoxDrawer: {
    flex: 1,
    backgroundColor: colorWhite,
    padding: 20,
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    color: colorAcai,
    marginBottom: 1,
    padding: 2,
    paddingBottom: 5,
    fontFamily: 'Ubuntu-Bold'
  },
  busInfo: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: colorAcai,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 1.0)"
  },
  busName: {
    flex: 1,
    fontSize: 24,
    color: 'rgba(87,41,100,255)',
    fontFamily: 'Ubuntu-Bold',
    marginBottom: 5,
    marginRight: 10
  },
  pinButton: {
    backgroundColor: 'transparent',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colorAcai,
    padding: 5,
    margin: 5,
  },
  pintButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Ubuntu-Bold'
  },
  busLocationInfoBox: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationInfoText: {
    fontSize: 10,
    padding: 2,
    color: colorAcai,
    fontFamily: 'Ubuntu-Bold'
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1000, // Garante que o drawer fique acima de outros componentes
  },
  map: {
    flex: 1,
  },
  infoBox: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 2, // Garante que o drawer fique acima de outros componentes
  },
  lineContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  lineTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: 'Ubuntu-Bold',
    color: colorAcai,
  },
  busItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  input: {
    borderColor: colorAcai,
    borderWidth: 0,
    fontSize: 18, // tamanho da fonte
    color: colorAcai,
    backgroundColor: colorWhite, // cor de fundo da caixa
    fontFamily: 'Ubuntu-Bold'
  },
  label: {
    borderColor: colorAcai,
    borderWidth: 0,
    fontSize: 18, // tamanho da fonte
    color: colorAcai,
    backgroundColor: colorWhite, // cor de fundo da caixa
    fontFamily: 'Ubuntu-Bold',
  },
  drawerContent: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flex: 1, // Faz com que ocupe todo o espaço disponível no drawer
  },
  scrollContent: {
    padding: 10, // Espaçamento interno
  },
  bottomSheetWrapper: {
    zIndex: 10, // Garante que fique sobre o mapa
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorAcai,
    marginBottom: 15,
    marginTop: 2,
    textAlign: 'center',
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#CCC',
    marginBottom: 10,
  },
  floatingButton: {
    position: 'absolute',
    top: 20, // Distância do topo
    left: 20, // Distância da esquerda
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 50,
    elevation: 5, // Para um efeito de sombra
    zIndex: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  contentContainer: {
    padding: 20,
  },
});