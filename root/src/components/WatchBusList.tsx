import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, Button, View, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Bus } from '../utils/interfaces';
import { Camera, MapView, ShapeSource, CircleLayer, UserLocation } from "@maplibre/maplibre-react-native";
import { mapStyleUrl, LOCAL_WEBSOCKET, RENDER_WEBSOCKET } from '../utils/apiKeys';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
import CustomDrawer from "./CustomDrawer";
import BeaconCrowdsourcing from "../contexts/BeaconCrowdsourcing";

export default function WatchBus() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const busesLines = useSelector((state: any) => state.busesLines); // Acessa o estado buses
  const dispatch = useDispatch();

  const [selectedBus, setSelectedBus] = useState<Bus | null>(null); // Estado para o ônibus selecionado
  const [followLocation, setFollowLocation] = useState(false); // Controle do estado de seguir localização
  const mapRef = useRef(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [renderWebsocket, setRenderWebsocket] = useState(false);
  const [localHost, setLocalHost] = useState<string>("192.168.100.102")

  useEffect(() => {
    let socket = ws;

    if (followLocation) {
      // Se não houver conexão ativa, cria uma nova
      if (!socket) {
        if (renderWebsocket){
          console.log("🚨 Using Render Webscocket route!")
          socket = new WebSocket(`${RENDER_WEBSOCKET}`);
        } else {
          socket = new WebSocket(`ws://${localHost}:8765`)
        }
        setWs(socket);

        socket.onopen = () => {
          console.log("WebSocket conectado.");

          // Filtra as linhas ativas
          const activeLines = busesLines.filter((line: any) => line.isLineActive);

          // Para cada linha ativa, filtra os ônibus ativos e coleta os _id dos ônibus ativos e suas linhas
          const activeBusesIds = activeLines
            .map((line: any) => {
              // Para cada linha ativa, pega os ônibus ativos e combina _id da linha e do ônibus
              const activeBusesInLine = line.lineBuses
                .filter((bus: any) => bus.isBusActive)
                .map((bus: any) => `${line._id}/${bus._id}`); // Retorna o formato "lineId/busId"
              return activeBusesInLine; // Retorna o array de combinações de _id
            })
            .flat(); // Flatten para que o resultado final seja um array de "lineId/busId"

          // Envia a lista de "lineId/busId" dos ônibus ativos
          socket?.send(JSON.stringify(activeBusesIds));

          console.log("Enviado para o WebSocket:", activeBusesIds);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Dados recebidos do WebSocket:", data);  // Log para ver o que foi recebido
        
            // Iterar sobre a array de atualizações de ônibus recebidas do WebSocket
            data.forEach((busUpdate: { _id: string, location: any }) => {
              // console.log("Processando atualização de ônibus:", busUpdate);
        
              const [lineId, busId] = busUpdate._id.split('/'); // Extrai lineId e busId do _id
              // console.log("lineId:", lineId, "busId:", busId); // Log para verificar os IDs extraídos
        
              // Encontra a linha correspondente no estado busesLines
              const line = busesLines.find((line: any) => line._id === lineId);
              if (!line) {
                console.error("Linha não encontrada:", lineId); // Log de erro se a linha não for encontrada
              }
        
              if (line) {
                console.log("Linha encontrada:", line);  // Log para verificar a linha encontrada
        
                // Se a linha for encontrada, então vamos procurar o ônibus correspondente dentro de lineBuses
                const bus = line.lineBuses.find((bus: any) => bus._id === busId);
                if (!bus) {
                  console.error("Ônibus não encontrado:", busId); // Log de erro se o ônibus não for encontrado
                }
        
                if (bus) {
                  // console.log("Ônibus encontrado:", bus);  // Log para verificar o ônibus encontrado
        
                  // Caso o ônibus seja encontrado, vamos atualizar sua localização
                  const updatedLocation = {
                    latitude: busUpdate.location.latitude,
                    longitude: busUpdate.location.longitude,
                    speed: busUpdate.location.speed,
                    heading: busUpdate.location.heading,
                    user_timestamp: new Date(busUpdate.location.time).getTime(), // Converte o tempo para timestamp
                  };
        
                  console.log(`Atualizando localização do ônibus ${busId} em ${lineId}`, updatedLocation);  // Log para verificar os dados de localização
        
                  // Atualiza a localização do ônibus no estado global usando o dispatch
                  dispatch({
                    type: 'updateBusLocation',
                    payload: {
                      busId: bus._id,
                      lineKey: line._id, // Agora passando o lineKey
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
  }, [followLocation]);
  

  const handleSelectBus = (bus: Bus) => {
    // Se o ônibus já estiver sendo seguido, desfaz a seleção
    if (selectedBus && selectedBus._id === bus._id) {
      setSelectedBus(null); // Para de seguir o ônibus
    } else {
      setSelectedBus(bus); // Seleciona o novo ônibus
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const handleToggleBus = (bus: Bus) => {
    dispatch({ type: 'toggleBus', payload: bus._id });
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Drawer */}
        <MapView
          ref={mapRef}
          style={styles.map}
          mapStyle={mapStyleUrl}
        >
          <UserLocation visible={true} renderMode="native" />

          {/* Filtra e mapeia ônibus ativos de linhas ativas */}
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
                  },
                })),
            }}
          >
            <CircleLayer
              id="busCircles"
              style={{
                circleRadius: 6,
                circleColor: "#FF0000",
                circleOpacity: 0.8,
              }}
            />
          </ShapeSource>

          {/* Centraliza no ônibus selecionado */}
          {selectedBus && (
            <Camera
              centerCoordinate={[
                selectedBus.location.longitude,
                selectedBus.location.latitude,
              ]}
              zoomLevel={16}
            />
          )}
        </MapView>
        <CustomDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          drawerWidth={300}
        >
          <View style={{alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Text style={[styles.title]}> Linhas de Ônibus Ativas </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setIsDrawerOpen((prev) => !prev)}
                style={[styles.pinButton, { alignSelf: 'center', marginHorizontal: 10 }]}
                >
                <Text style={styles.pintButtonText}> {isDrawerOpen ? "Fechar Drawer" : "Abrir Drawer"} </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFollowLocation((prev) => !prev)}
                style={styles.pinButton}
                >
                <Text style={styles.pintButtonText}>{followLocation ? "Parar de seguir" : "Seguir Localização"} </Text>
              </TouchableOpacity>
            </View>
          </View>
  
          {/* Renderizando as linhas de ônibus ativas */}
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
  
                    {/* Renderiza os ônibus da linha */}
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
  
                            {/* Exibe informações detalhadas do ônibus quando selecionado */}
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
        </CustomDrawer>
  
        {/* InfoBox */}
        <ScrollView style={styles.infoBox}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}>
          <View style={{borderBottomColor: '#ccc', borderBottomWidth: 1}}>
            <Text style={styles.title}>Configurações</Text>
          </View>
          <View>
            <BeaconCrowdsourcing />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
    
            <TouchableOpacity
              onPress={() => setFollowLocation((prev) => !prev)}
              style={styles.pinButton}
              >
              <Text style={styles.pintButtonText}>{followLocation ? "Parar de seguir" : "Seguir Localização"} </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsDrawerOpen((prev) => !prev)}
              style={styles.pinButton}
              >
              <Text style={styles.pintButtonText}>{isDrawerOpen ? "Fechar Drawer" : "Abrir Drawer"} </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRenderWebsocket((prev) => !prev)}
              style={styles.pinButton}
              >
              <Text style={styles.pintButtonText}>{renderWebsocket ? "Parar Render" : "Seguir com Render"} </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.pinButton, {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}> 
            <Text style={styles.label}> IP do Host local: </Text>
            <TextInput
                value={`${localHost}`}
                onChangeText={(text: string) => setLocalHost(text)}
                placeholder="Defina o IP do Host local"
                style={styles.input}
                > 
              </TextInput>
          </View>
        </ScrollView>
        
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
    zIndex: 1, // Mapa fica abaixo do drawer
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
    zIndex: 9, // Garante que o drawer fique acima de outros componentes
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
});