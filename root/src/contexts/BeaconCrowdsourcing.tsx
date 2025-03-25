import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    View, 
    Text,
    StyleSheet,
    Platform, 
    PermissionsAndroid,
    Button, 
    TouchableOpacity,
    Switch} from 'react-native';

import BackgroundJob from 'react-native-background-actions';
import WifiReborn, { WifiEntry } from 'react-native-wifi-reborn';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'; // Importando hooks do Redux

import { CrowdsourcingData, LocationData } from '../utils/interfaces';
import { REST_API_AWS } from '../utils/apiKeys';
import { beaconKey } from '../utils/constants';

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));


const BeaconCrowdsourcing: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);

    const [isRunning, setIsRunning] = useState(false);
    const [wifiPermission, setWifiPermission] = useState<boolean>(false);
    const [wifiList, setWifiList] = useState<WifiEntry[]>([]);
    const [beaconList, setBeaconList] = useState<WifiEntry[]>([]);
    
    // Usando o useSelector para acessar o estado do Redux
    const userLocation = useSelector((state: any) => state.user_location);
    const dispatch = useDispatch(); // Usando o useDispatch para disparar ações
    const restAPIHost = useSelector((state: any) => state.restAPIHost);


    useEffect(() => {
        if (beaconList.length > 0 && userLocation) {
            setTimeout(() => {
                for (const beacon of beaconList) {
                    let crowdsourcingData: CrowdsourcingData = {
                        bus_ssid: beacon.SSID.replace(beaconKey, ""),
                        rssi: beacon.level,
                        location: userLocation, // Garante que está preenchido
                    };
                    console.log("📡 Crowdsourcing:", crowdsourcingData);
                    fetchCrowdsourcingData(crowdsourcingData);
                }
            }, 1000); // Pequeno delay para evitar condições de corrida
        }
    }, [userLocation]);

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                ]);
    
                const isGranted = (
                    granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.ACCESS_BACKGROUND_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                );
                return isGranted;
            } catch (error) {
                console.error("Erro ao solicitar permissão:", error);
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        // Este código será executado de forma síncrona após a montagem do componente
        console.log('Componente montado');
        setIsMounted(true);
        // Função de limpeza (opcional)
        return () => {
            console.log('Componente desmontado');
            setIsMounted(false);
        };
    }, []); // O array vazio garante que o efeito só será executado na montagem e desmontagem

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
                console.log("Permissão FINE_LOCATION: ", granted);
            } catch (error) {
                console.error("Erro ao solicitar permissão:", error);
                setWifiPermission(false);
            }
        };

        if (isMounted) {
            console.log("Verificando permissão FINE_LOCATION! ")
            fetchWifiDetails();
        }

    }, [isMounted])

    useEffect(() => {
        console.log("Estado da permissão WiFi atualizado: ", wifiPermission);
    }, [wifiPermission]);

    const updateWifiList = async () => {
        if (!wifiPermission) {
            console.log("Permissão negada!");
            return;
        }

        try {
            console.log("Obtendo lista de redes WiFi...");
            const list: WifiEntry[] = await WifiReborn.reScanAndLoadWifiList();
            console.log("🚨🔎 Lista de redes WiFi Escaneada:", list);
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
            const list: WifiEntry[] = wifiList.filter(net => net.SSID.includes(beaconKey));
            console.log("Lista de beacons:", list);
            setBeaconList(list);

            // Se a lista de beacons não estiver vazia, captura a localização
            if (list.length > 0) {
                // console.log('Beacons identificados! Capturando localização...');
                Geolocation.getCurrentPosition(
                    (position: any) => {
                        console.log('Localização obtida:', position.coords);
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
            } else {
                dispatch({type: "updateUserLocation", payload: {}});
            }
                
        } catch (error) {
            console.error("Erro ao filtrar beacons:", error);
            setBeaconList([]);
        } 
    };

    // Função que roda em segundo plano
    const scanBeaconTask = async (taskDataArguments?: { delay: number }) => {
        if (!taskDataArguments) {
            console.log("Task data arguments are undefined");
            return;
        }

        const { delay } = taskDataArguments;

        // Intervalo de 30 segundos para escanear as redes Wi-Fi
        const wifiScanInterval = 30500; // 30 segundos
        let lastWifiScanTime = 0;

        while (BackgroundJob.isRunning()) {
            const currentTime = Date.now();

            // Se passaram 30 segundos desde o último escaneamento, realiza o escaneamento de WiFi
            if (currentTime - lastWifiScanTime >= wifiScanInterval) {
                console.log('Escaneando redes Wi-Fi...');
                await updateWifiList(); // Atualiza a lista de WiFi
                lastWifiScanTime = currentTime; // Atualiza o tempo do último escaneamento
            } else {
                const list: WifiEntry[] = await WifiReborn.loadWifiList();
                updateBeaconList(list);
            }

            // Aqui o delay de 2 segundos para continuar a tarefa em segundo plano
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
        parameters: { delay: 3000 },
        stopWithTask: false,
    };

    // Inicia a tarefa em segundo plano
    const startBackgroundTask = async () => {
        if (isRunning) return;
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            console.log("Permissão negada! Teste feito na função startBackgroundTask")
            return;
        }else {
            console.log("Permissão verificada para tarefa: ", hasPermission)
        };

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

    const fetchCrowdsourcingData = async (crowdsourcingData: CrowdsourcingData) => {
        const isApiAvailable = await checkApiAvailability();
        if (!isApiAvailable) {
            console.log("API não está disponível. Abortando requisição.");
            return;
        }
        let data = {
            user_id: "user_kauan",
            bus_ssid: crowdsourcingData.bus_ssid,
            rssi: crowdsourcingData.rssi,
            latitude: crowdsourcingData.location.latitude,
            longitude: crowdsourcingData.location.longitude,
            speed: crowdsourcingData.location.speed,
            heading: crowdsourcingData.location.heading,
        }

        try {
          const response = await axios.post(`${restAPIHost}/api/v1/movements`, data, { timeout: 10000 });
          console.log("Resposta da API:", response.data);
        } catch (err) {
            console.error("Erro na requisição:", err);
        } 
    };

    const checkApiAvailability = async () => {
        try {
            const response = await axios.get(`${restAPIHost}/api/v1/health`); // Endpoint de saúde ou um endpoint simples
            return response.status === 200; // Retorna true se a API estiver disponível
        } catch (error) {
            console.error("API não disponível");
            return false; // Retorna false se a API não estiver disponível
        }
    };

    return (
        <View style={styles.box}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center', 
                borderColor: 'black', 
                borderWidth: 0,
                padding: 0,
                }}>
                <Text style={[styles.header, {borderWidth: 0, borderColor: 'black'}]}>Beacon Task [{isRunning ? 'On' : 'Off'}]</Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: isRunning ? colorGray : colorGreen,
                        padding: 10,
                        borderRadius: 10,
                        alignItems: 'center',
                        margin: 10,
                    }}
                    onPress={isRunning ? stopBackgroundTask : startBackgroundTask} // Alterna entre iniciar e parar
                >
                    <Text style={{ color: isRunning ? colorWhite : colorAcai, fontSize: 16, fontWeight: 'bold' }}>
                        {isRunning ? 'Turn Off' : 'Turn On'}
                    </Text>
                </TouchableOpacity>
                <Switch 
                    value={isRunning}
                    onValueChange={(newValue) => {
                        if (newValue) {
                            startBackgroundTask(); // Se ativado, inicia a tarefa
                        } else {
                            stopBackgroundTask();  // Se desativado, para a tarefa
                        }
                    }}
                />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                    {/* Exibe a lista de beacons */}
                    <Text style={{fontSize: 15, fontFamily: 'Ubuntu-Bold', color: colorAcai}}>Detected Beacons</Text>
                    {beaconList.length > 0 ? (
                        
                        beaconList.map((wifi, index) => (
                            <Text key={index} style={styles.wifiItem}>
                                {wifi.SSID}, RSSI: {wifi.level}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.noWifiText}>No beacon Nearby</Text>
                    )}
                </View>
                <View style={{flex: 1, alignItems: 'flex-start', padding: 10}}>
                    <Text style={styles.text}>{beaconList.length > 0 ? 'Tracking User' : 'Tracking Paused'}</Text>
                    <View style={{alignItems: 'flex-start'}}>
                        {userLocation ? (
                            <Text style={styles.location}>
                                📍 Latitude: {userLocation.latitude}{'\n'}
                                📍 Longitude: {userLocation.longitude}
                            </Text>
                        ) : (
                            <Text style={styles.text}>Aguardando localização...</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const colorAcai = 'rgba(87,41,100,1.0)'
const colorWhite = 'rgba(255,255,255,1.0)'
const colorGreen = 'rgba(185,214,165,1.0)'
const colorGrape = 'rgba(128,0,62,1.0)'
const colorGray = 'rgba(33,36,30,1.0)'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        padding: 10,
    },
    box: {
        borderRadius: 20,
        backgroundColor: '#FFFF',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    header: {
        fontSize: 20,
        color: colorAcai,
        alignSelf: 'center',
        fontFamily: 'Ubuntu-Bold',
    },
    ssidText: {
        marginTop: 20,
        color: 'blue',
    },
    wifiItem: {
        fontFamily: 'Ubuntu-Bold',
        color: colorAcai,
        marginTop: 5,
    },
    noWifiText: {
        color: colorAcai,
        marginTop: 10,
    },
    text: {
        fontSize: 15,
        fontFamily: 'Ubuntu-Bold',
        marginBottom: 2,
        color: colorAcai,
        alignSelf: 'center'
    },
    location: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 15,
        color: colorAcai,
        alignSelf: 'center'
    }
});

export default BeaconCrowdsourcing;