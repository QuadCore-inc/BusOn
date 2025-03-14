import React from "react";
import { StyleSheet } from "react-native"; 

export const MapStyle = StyleSheet.create({
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