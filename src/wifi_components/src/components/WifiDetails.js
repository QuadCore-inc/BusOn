import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid } from 'react-native';
import WifiReborn from 'react-native-wifi-reborn';

const WifiDetails = () => {
    const [wifiList, setWifiList] = useState([]);
    const [currentSSID, setCurrentSSID] = useState('');

    useEffect(() => {
        const fetchWifiDetails = async () => {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permissão de Localização Necessária',
                    message:
                        'Precisamos da permissão de localização para buscar redes WiFi disponíveis.',
                    buttonNegative: 'Negar',
                    buttonPositive: 'Permitir',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Permissão concedida!");

                try {
                    const ssid = await WifiReborn.getCurrentWifiSSID();
                    console.log("SSID atual:", ssid);
                    setCurrentSSID(ssid);
                } catch (error) {
                    console.log("Erro ao obter SSID:", error);
                    setCurrentSSID('Erro ao obter SSID');
                }

                try {
                    const list = await WifiReborn.loadWifiList();
                    console.log("Lista de redes WiFi:", list);
                    setWifiList(list);
                } catch (error) {
                    console.log("Erro ao carregar lista de redes WiFi:", error);
                    setWifiList([]);
                }
            } else {
                console.log("Permissão negada!");
            }
        };

        fetchWifiDetails();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Redes Disponíveis</Text>
            <Text style={styles.ssidText}>SSID Atual: {currentSSID}</Text>

            {wifiList.length > 0 ? (
                wifiList.map((wifi, index) => (
                    <Text key={index} style={styles.wifiItem}>
                        {wifi.SSID}
                    </Text>
                ))
            ) : (
                <Text style={styles.noWifiText}>Nenhuma rede encontrada</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    ssidText: {
        marginTop: 20,
        color: 'blue',
    },
    wifiItem: {
        color: 'black',
        marginTop: 5,
    },
    noWifiText: {
        color: 'gray',
        marginTop: 10,
    },
});

export default WifiDetails;
