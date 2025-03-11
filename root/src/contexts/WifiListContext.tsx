import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, PermissionsAndroid, Button } from 'react-native';
import BackgroundJob from 'react-native-background-actions';
import WifiReborn, { WifiEntry } from 'react-native-wifi-reborn';
import Geolocation from '@react-native-community/geolocation';

const updateWiFiListInterval = 3000; // Intervalo de atualização da lista de Wi-Fi
const busonKey = 'DIR'; // Chave para filtrar beacons

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const WifiDetailsProvider: React.FC = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [wifiPermission, setWifiPermission] = useState<boolean>(false);
    const [wifiList, setWifiList] = useState<WifiEntry[]>([]);
    const [beaconList, setBeaconList] = useState<WifiEntry[]>([]);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    // Solicita permissões necessárias
    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            ]);

            return (
                granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.ACCESS_BACKGROUND_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
            );
        }
        return true;
    };

    // Verifica e solicita permissões ao montar o componente
    useEffect(() => {
        const fetchWifiDetails = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Permissão de Localização Necessária',
                        message: 'Precisamos da permissão de localização para buscar redes WiFi disponíveis.',
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

    // Função para atualizar a lista de redes Wi-Fi
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
            updateBeaconList(list); // Atualiza a lista de beacons após atualizar a lista de Wi-Fi
        } catch (error) {
            console.error("Erro ao carregar lista de Wi-Fi:", error);
            setWifiList([]);
            setBeaconList([]); // Limpa a lista de beacons em caso de erro
        }
    };

    // Função para atualizar a lista de beacons e capturar a localização
    const updateBeaconList = (wifiList: WifiEntry[]) => {
        if (!wifiList || wifiList.length === 0) {
            console.log("Sem lista de Wi-Fi!");
            setBeaconList([]);
            return;
        }

        try {
            console.log("Atualizando lista de beacons...");
            const list: WifiEntry[] = wifiList.filter(net => net.SSID.includes(busonKey));
            console.log("Lista de beacons:", list);
            setBeaconList(list);

            // Se a lista de beacons não estiver vazia, captura a localização
            if (list.length > 0) {
                console.log('Beacons identificados! Capturando localização...');
                Geolocation.getCurrentPosition(
                    (position) => {
                        console.log('Localização obtida:', position.coords);
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (error) => {
                        console.log('Erro ao capturar localização:', error);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            } else {
                setLocation(null); // Limpa a localização se não houver beacons
            }
        } catch (error) {
            console.error("Erro ao filtrar beacons:", error);
            setBeaconList([]);
            setLocation(null); // Limpa a localização em caso de erro
        }
    };

    // Função que roda em segundo plano
    const scanBeaconTask = async (taskDataArguments?: { delay: number }) => {
        if (!taskDataArguments) {
            console.log("Task data arguments are undefined");
            return;
        }

        const { delay } = taskDataArguments;

        while (BackgroundJob.isRunning()) {
            console.log('Varrendo redes Wi-Fi e beacons...');
            await updateWifiList(); // Atualiza a lista de Wi-Fi e, consequentemente, a lista de beacons
            await sleep(delay);
        }
    };

    // Opções para a tarefa em segundo plano
    const options = {
        taskName: 'LocationTracking',
        taskTitle: 'Escanenando ônibus próximos...',
        taskDesc: 'Rastreando redes Wi-Fi e beacons',
        taskIcon: { name: 'ic_launcher', type: 'mipmap' },
        color: '#ffffff',
        parameters: { delay: 2000 },
        stopWithTask: false,
    };

    // Inicia a tarefa em segundo plano
    const startBackgroundTask = async () => {
        if (isRunning) return;
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            setIsRunning(true);
            await BackgroundJob.start(scanBeaconTask, options);
            console.log('✅ Tarefa iniciada!');
        } catch (e) {
            console.log('❌ Erro ao iniciar a tarefa:', e);
            setIsRunning(false);
        }
    };

    // Para a tarefa em segundo plano
    const stopBackgroundTask = async () => {
        if (!isRunning) return;
        try {
            await BackgroundJob.stop();
            setIsRunning(false);
            console.log('✅ Tarefa parada!');
        } catch (e) {
            console.log('❌ Erro ao parar a tarefa:', e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Beacons Identificados</Text>

            {/* Exibe a lista de beacons */}
            {beaconList.length > 0 ? (
                beaconList.map((wifi, index) => (
                    <Text key={index} style={styles.wifiItem}>
                        {wifi.SSID}
                    </Text>
                ))
            ) : (
                <Text style={styles.noWifiText}>Nenhuma rede encontrada</Text>
            )}

            <Text style={styles.text}>Tarefa rodando: {isRunning ? 'Sim' : 'Não'}</Text>
            <Text style={styles.text}>Rastreamento: {isRunning ? 'Ativo' : 'Parado'}</Text>

            {/* Exibe a localização do usuário */}
            {location ? (
                <Text style={styles.text}>
                    📍 Latitude: {location.latitude}{'\n'}
                    📍 Longitude: {location.longitude}
                </Text>
            ) : (
                <Text style={styles.text}>Aguardando localização...</Text>
            )}

            <Button
                title={isRunning ? 'Tarefa em execução' : 'Iniciar Rastreamento'}
                onPress={startBackgroundTask}
            />

            <Button
                title="Parar Rastreamento"
                onPress={stopBackgroundTask}
            />
        </View>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
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
    text: {
        fontSize: 18,
        marginBottom: 20,
        color: 'black',
    },
});

export default WifiDetailsProvider;