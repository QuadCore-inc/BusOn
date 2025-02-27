import React, { useEffect, useState, useRef } from 'react'
import { PermissionsAndroid } from 'react-native'
import WifiReborn, { WifiEntry } from 'react-native-wifi-reborn'

const busonKey = 'Lasse'
const updateWiFiListInterval = 3000  // Intervalo para atualização da lista de Wi-Fi

export const useWifiScanner = () => {
    const [wifiList, setWifiList] = useState<WifiEntry[]>([])  // Estado para a lista de redes Wi-Fi
    const [wifiPermission, setWifiPermission] = useState<boolean>(false)  // Estado para verificar a permissão
    const intervalRef = useRef<NodeJS.Timeout | null>(null)  // Referência para o intervalo de atualização

    // Solicitar permissão para acessar redes Wi-Fi
    useEffect(() => {
        const requestWifiPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                )
                setWifiPermission(granted === PermissionsAndroid.RESULTS.GRANTED)  // Define a permissão
            } catch (error) {
                console.error("Failed to get location permission", error)
                setWifiPermission(false)  // Caso não consiga obter a permissão
            }
        }
        requestWifiPermission()  // Solicita a permissão ao montar o hook
    }, [])

    // Atualiza a lista de redes Wi-Fi
    const updateWifiList = async () => {
        if (!wifiPermission) return  // Se não tiver permissão, não faz nada

        try {
            const list = await WifiReborn.loadWifiList()  // Carrega a lista de Wi-Fi
            setWifiList(list)  // Atualiza o estado com a lista de redes Wi-Fi
        } catch (error) {
            console.error("Erro ao carregar Wi-Fi: ", error)
            setWifiList([])  // Se houver erro, limpa a lista
        }
    }

    // Atualiza a lista de Wi-Fi periodicamente se a permissão for concedida
    useEffect(() => {
        if (wifiPermission) {
            updateWifiList()  // Atualiza a lista de Wi-Fi imediatamente após obter permissão
            intervalRef.current = setInterval(updateWifiList, updateWiFiListInterval)  // Atualiza periodicamente a lista
        }

        // Cleanup: limpa o intervalo quando o componente for desmontado ou a permissão mudar
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [wifiPermission])

    // Filtra a lista de redes Wi-Fi para incluir apenas aquelas que contêm o SSID busonKey
    return wifiList.filter(net => net.SSID.includes(busonKey))
}
