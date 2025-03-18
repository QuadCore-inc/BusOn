import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Bus } from '../utils/interfaces';
import { BusListStyle } from '../utils/styles';
import { persistor } from '../state/store';

const BusList: React.FC = () => {
    // Usando `useSelector` para acessar as linhas de ônibus no estado global
    const busesLines = useSelector((state: any) => state.busesLines);  // Acessa o estado diretamente

    const dispatch = useDispatch();

    // console.log('BusesLines no estado:', busesLines);

    // Alterna o estado isActive de um ônibus
    const handleToggleBus = (busId: string, lineKey: string) => {
        dispatch({ type: 'toggleBus', payload: { busId, lineKey } });
    };

    // Alterna o isLineActive da linha
    const handleToggleLine = (lineKey: string) => {
        dispatch({ type: 'toggleLineActive', payload: lineKey });
    };

    // Função para limpar o estado global
    const clearAppState = () => {
        persistor.purge();
        console.log("🗑️ Persistência limpa!");
    };

    // Renderiza as linhas de ônibus e seus respectivos ônibus
    const renderBusesByLine = () => {
        return busesLines.map((line: any) => {
            const { _id: lineKey, lineName, lineBuses, isLineActive } = line;  // Desestruturando a linha
            return (
                <View key={lineKey} style={BusListStyle.lineContainer}>
                    {/* Título da linha e botão para ativar/desativar */}
                    <View>
                        <Text style={BusListStyle.lineTitle}>{lineName}</Text>
                        <TouchableOpacity
                            style={[BusListStyle.button, isLineActive ? BusListStyle.activeButton : BusListStyle.inactiveButton]}
                            onPress={() => handleToggleLine(lineKey)}
                        >
                            <Text style={BusListStyle.buttonText}>
                                {isLineActive ? 'Desativar Linha' : 'Ativar Linha'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Lista de ônibus da linha */}
                    {lineBuses.map((bus: Bus) => (
                        <View key={bus._id} style={BusListStyle.busItem}>
                            <Text style={BusListStyle.busText}>
                                Ônibus {bus.name} {bus.isBusActive ? "Ativado" : "Desativado"}
                            </Text>

                            {/* Botão para ativar/desativar o ônibus */}
                            <TouchableOpacity
                                style={BusListStyle.button}
                                onPress={() => handleToggleBus(bus._id, lineKey)}
                            >
                                <Text style={BusListStyle.buttonText}>
                                    {bus.isBusActive ? 'Desativar' : 'Ativar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            );
        });
    };

    return (
        <View style={BusListStyle.container}>
            <Text>Total de linhas de ônibus: {busesLines.length}</Text> {/* Exibe o número de linhas de ônibus */}
            <Button title="Limpar estado global" onPress={clearAppState} />

            {busesLines.length > 0 ? (
                renderBusesByLine()
            ) : (
                <Text>Nenhuma linha de ônibus disponível.</Text>
            )}
        </View>
    );
};

export default BusList;
