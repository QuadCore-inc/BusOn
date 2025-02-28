import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWifiScanner } from '../hooks/useWifiScanner';

const WifiDetails: React.FC = () => {
    const wifiList = useWifiScanner();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Redes Disponíveis</Text>
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
        padding: 20 },
    header: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: 'black' 
    },
    wifiItem: { 
        color: 'black', 
        marginTop: 5 
    },
    noWifiText: { 
        color: 'gray', 
        marginTop: 10 
    },
});

export default WifiDetails;
