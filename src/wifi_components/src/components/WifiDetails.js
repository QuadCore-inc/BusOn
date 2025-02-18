import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Importando StyleSheet

import WifiReborn from 'react-native-wifi-reborn';
import { PermissionsAndroid } from 'react-native';

const WifiDetails = () => {
    const [wifilist, setWifiList] = useState([]);
    console.log(wifilist + 'list')
    const [currentSSID, setCurrentSSID] = useState('');

    useEffect(() => {
        permission();
        WifiReborn.getCurrentWifiSSID().then(
            ssid => {
                console.log("Your current connected wifi SSID is " + ssid);
                setCurrentSSID(ssid);
            },
            () => {
                console.log("Cannot get current SSID!");
            }
        );
        WifiReborn.loadWifiList().then(List => {
            setWifiList(List);
        });
    }, []);

    const permission = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location permission is required for WiFi connections',
                message:
                    'This app needs location permission as this is required ' +
                    'to scan for wifi networks.',
                buttonNegative: 'DENY',
                buttonPositive: 'ALLOW',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("granted");
        } else {
            console.log("not granted");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Redes hackeadas
            </Text>
            <Text style={styles.ssidText}>
                Rede de bosta: {currentSSID}
            </Text>
            {wifilist.map(List => {
                return <Text style={{color:'black'}}>Redes dos merdas:{List.SSID}</Text>
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // Definindo cor de fundo branca
        justifyContent: 'center', // Centralizando os itens verticalmente
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black', // Definindo a cor do texto para preto
    },
    ssidText: {
        marginTop: 20,
        color: 'red', // Cor do texto em vermelho
    }
});

export default WifiDetails;
