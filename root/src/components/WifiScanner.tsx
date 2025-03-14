import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, PermissionsAndroid } from 'react-native'
import WifiReborn, { WifiEntry } from 'react-native-wifi-reborn'

const updateWiFiListInterval = 3000;

const busonKey = 'Lasse'

const WifiDetails: React.FC = () => {
    const [wifiPermission, setWifiPermission] = useState<boolean>(false)
    const [wifiList, setWifiList] = useState<WifiEntry[]>([])
    const [currentSSID, setCurrentSSID] = useState<string>('')
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const fetchWifiDetails = async () => {
            try {
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
                setWifiPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
            } catch (error) {
                console.error("Erro ao solicitar permissão:", error);
                setWifiPermission(false);
            }
        };
        fetchWifiDetails();
    }, []);

    const updateWifiList = async () => {
        if (!wifiPermission) {
            console.log("Permissão negada!");
            return;
        }

        try {
            console.log("Obtendo lista de redes WiFi...");
            const list: WifiEntry[] = await WifiReborn.loadWifiList();
            console.log("Lista de redes WiFi:", list);
            setWifiList(list);
        } catch (error) {
            console.error("Erro ao carregar lista de Wi-Fi:", error);
            setWifiList([]);
        }
    };

    useEffect(() => {
        if (wifiPermission) {
            updateWifiList(); // Chamada inicial

            intervalRef.current = setInterval(updateWifiList, updateWiFiListInterval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [wifiPermission]); // Atualiza apenas se a permissão mudar

    // Filter list before do JSX
    const filteredList = wifiList.filter(net => net.SSID.includes(busonKey));

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Redes Disponíveis</Text>
            <Text style={styles.ssidText}>SSID Atual: {currentSSID}</Text>

            {filteredList.length > 0 ? (
                filteredList.map((wifi, index) => (
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
