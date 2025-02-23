import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapLibreGL, { MapView } from '@maplibre/maplibre-react-native';
import Geolocation from '@react-native-community/geolocation';

MapLibreGL.setAccessToken(null);

const apiKey = '036c4bbc-768c-4abf-b0dc-a8823629ecff';
const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${apiKey}`;

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    // Obtendo a localização do usuário
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([longitude, latitude]); // Definindo as coordenadas no estado
      },
      error => {
        console.error('Erro ao obter a posição atual', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  return (
    <MapView
      style={styles.map}
      mapStyle={styleUrl}
      onStyleLoaded={() => console.log('Estilo carregado com sucesso!')}
      onError={(error) => console.error('Erro ao carregar o mapa:', error)}
    >
      {currentPosition && (
        <>
          {/* Ajustando a câmera para a posição do usuário */}
          <MapLibreGL.Camera
            zoomLevel={14}  // Ajuste o nível de zoom conforme necessário
            centerCoordinate={currentPosition}
            animationMode="flyTo"  // Faz a animação de voo para a posição
            animationDuration={1000} // Duração da animação
          />
          
          {/* Adicionando o ponto de anotação para a posição do usuário */}
          <MapLibreGL.PointAnnotation
            id="userLocation"
            coordinate={currentPosition}
          >
            <View style={styles.annotationContainer}>
              <Text style={styles.annotationText}>Você está aqui!</Text>
            </View>
          </MapLibreGL.PointAnnotation>
        </>
      )}
    </MapView>
  );
};

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

export default MapComponent;
