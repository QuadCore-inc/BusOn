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

export const BusListStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
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
  },
  busItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  busText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  activeButton: {
    backgroundColor: '#28a745', // Verde para linha ativa
  },
  inactiveButton: {
    backgroundColor: '#dc3545', // Vermelho para linha inativa
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10, // Espaçamento entre os botões
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});