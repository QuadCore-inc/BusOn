import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Bus } from '../utils/interfaces';
import { BusListStyle } from '../utils/styles';
import { persistor } from '../state/store';
import BeaconCrowdsourcing from '../contexts/BeaconCrowdsourcing';

const BusList: React.FC = () => {
    const busesLines = useSelector((state: any) => state.busesLines);
    const websocketAPIHost = useSelector((state: any) => state.websocketAPIHost);
    const restAPIHost = useSelector((state: any) => state.restAPIHost);
    const [WEBSOCKET_API_HOST, setWebsocketAPIhost] = useState<string>(websocketAPIHost); 
    const [REST_API_HOST, setRestAPIhost] = useState<string>(restAPIHost); 
    const dispatch = useDispatch();

    useEffect(() => setWebsocketAPIhost(websocketAPIHost), [websocketAPIHost]);
    useEffect(() => setRestAPIhost(restAPIHost), [restAPIHost]);

    const handleToggleBus = (busId: string, lineKey: string) => {
        dispatch({ type: 'toggleBus', payload: { busId, lineKey } });
    };

    const handleToggleLine = (lineKey: string) => {
        dispatch({ type: 'toggleLineActive', payload: lineKey });
    };

    const handleRestAPIHostChange = (newHost: string) => {
        dispatch({ type: 'setRestAPIhost', payload: newHost });
    };

    const handleWebsocketAPIHostChange = (newHost: string) => {
        dispatch({ type: 'setWebsocketAPIhost', payload: newHost });
    };

    const clearAppState = () => {
        persistor.purge();
        console.log("🗑️ Persistência limpa!");
    };

    const renderBusesByLine = () => {
        return busesLines.map((line: any) => {
            const { _id: lineKey, lineName, lineBuses, isLineActive } = line;
            return (
                <View key={lineKey} style={BusListStyle.lineContainer}>
                    <View style={styles.lineHeader}>
                        <Text style={styles.lineTitle}>{lineName}</Text>
                        <Switch
                            value={isLineActive}
                            onValueChange={() => handleToggleLine(lineKey)}
                        />
                    </View>

                    {lineBuses.map((bus: Bus) => (
                        <View key={bus._id} style={BusListStyle.busItem}>
                            <Text style={BusListStyle.busText}>
                                Ônibus {bus.name}
                            </Text>
                            <Switch
                                value={bus.isBusActive}
                                onValueChange={() => handleToggleBus(bus._id, lineKey)}
                            />
                        </View>
                    ))}
                </View>
            );
        });
    };

    return (
        <View style={BusListStyle.container}>
            <Text>Total de linhas de ônibus: {busesLines.length}</Text>
            <Button title="Limpar estado global" onPress={clearAppState} />

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Host do Websocket:</Text>
                <TextInput
                    value={WEBSOCKET_API_HOST}
                    onChangeText={setWebsocketAPIhost}
                    onBlur={() => handleWebsocketAPIHostChange(WEBSOCKET_API_HOST)}
                    placeholder="Defina o IP do Host Websocket"
                    style={styles.input}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Host da API Rest:</Text>
                <TextInput
                    value={REST_API_HOST}
                    onChangeText={setRestAPIhost}
                    onBlur={() => handleRestAPIHostChange(REST_API_HOST)}
                    placeholder="Defina o IP do Host Rest"
                    style={styles.input}
                />
            </View>

            {busesLines.length > 0 ? (
                renderBusesByLine()
            ) : (
                <Text>Nenhuma linha de ônibus disponível.</Text>
            )}
            <BeaconCrowdsourcing />
        </View>
    );
};

const colorAcai = 'rgba(87,41,100,1.0)';
const colorWhite = 'rgba(255,255,255,1.0)';

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    input: {
        fontFamily: 'Ubuntu-Bold',
        flex: 1,
        borderColor: colorAcai,
        borderWidth: 1,
        fontSize: 14,
        color: colorAcai,
        backgroundColor: colorWhite,
        padding: 5,
        borderRadius: 5,
    },
    label: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 14,
        color: colorAcai,
        marginRight: 5,
    },
    lineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    fontFamily: 'Ubuntu-Bold',
    color: colorAcai,
    },
});

export default BusList;
