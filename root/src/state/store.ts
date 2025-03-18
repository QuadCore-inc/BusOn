import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bus, BusLine } from '../utils/interfaces'
// Estado inicial
const initialState = {
    user_location: null,
    busesLines: [ 
        {
            _id: 'line_circular_ufpa',
            lineName: 'Circular UFPA',
            lineBuses: [
                {
                    _id: "bus_circular",
                    name: "Circular UFPA",
                    isBusActive: false,
                    location: {
                        latitude: -1.4623,
                        longitude: -48.4442,
                        speed: 0.0,
                        heading: 0.0,
                        user_timestamp: 0.0
                    },
                },
                {
                    _id: "bus_sima",
                    name: "Circular SIMA",
                    isBusActive: false,
                    location: {
                        latitude: -1.4643,
                        longitude: -48.4442,
                        speed: 0.0,
                        heading: 0.0,
                        user_timestamp: 0.0
                    },
                },
                {
                    _id: "bus_circulinho",
                    name: "Circulinho",
                    isBusActive: false,
                    location: {
                        latitude: -1.4633,
                        longitude: -48.4442,
                        speed: 0.0,
                        heading: 0.0,
                        user_timestamp: 0.0
                    },
                },
            ],
            isLineActive: false,
        },
    ]
};

// Funções de ações
// Funções de ações
const actions = {
    // Atualiza a localização do usuário
    updateUserLocation(state, action) {
        const newLocation = action.payload;
        return {
            ...state,
            user_location: newLocation,
        };
    },

    // Adiciona um novo ônibus em uma linha específica
    addBus(state, action) {
        const { lineKey, newBus } = action.payload;

        // Adiciona o novo ônibus na linha específica
        return {
            ...state,
            busesLines: state.busesLines.map((line) =>
                line._id === lineKey
                    ? { 
                        ...line,
                        lineBuses: [...line.lineBuses, newBus],  // Adiciona o novo ônibus à linha
                    }
                    : line
            ),
        };
    },

    // Alterna o status de "ativo" de um ônibus
    toggleBus(state, action) {
        const { busId, lineKey } = action.payload;

        return {
            ...state,
            busesLines: state.busesLines.map((line) =>
                line._id === lineKey
                    ? {
                        ...line,
                        lineBuses: line.lineBuses.map((bus) =>
                            bus._id === busId
                                ? { ...bus, isBusActive: !bus.isBusActive }  // Alterna o status de "ativo" do ônibus
                                : bus
                        ),
                    }
                    : line
            ),
        };
    },

    // Remove um ônibus de uma linha específica
    removeBus(state, action) {
        const { busId, lineKey } = action.payload;

        return {
            ...state,
            busesLines: state.busesLines.map((line) =>
                line._id === lineKey
                    ? {
                        ...line,
                        lineBuses: line.lineBuses.filter((bus) => bus._id !== busId),  // Remove o ônibus da linha
                    }
                    : line
            ),
        };
    },

    // Atualiza a localização de um ônibus
    updateBusLocation(state, action) {
        const { busId, lineKey, location } = action.payload;

        return {
            ...state,
            busesLines: state.busesLines.map((line) =>
                line._id === lineKey
                    ? {
                        ...line,
                        lineBuses: line.lineBuses.map((bus) =>
                            bus._id === busId
                                ? { ...bus, location }  // Atualiza a localização do ônibus
                                : bus
                        ),
                    }
                    : line
            ),
        };
    },

    // Alterna o status de "ativo" de uma linha
    toggleLineActive(state, action) {
        const lineKey = action.payload;

        return {
            ...state,
            busesLines: state.busesLines.map((line) =>
                line._id === lineKey
                    ? {
                        ...line,
                        isLineActive: !line.isLineActive,  // Alterna o status de "ativo" da linha
                    }
                    : line
            ),
        };
    },
};


// Root Reducer
const rootReducer = (state = initialState, action: any) => {
    const fn = actions[action.type];
    return fn ? fn(state, action) : state;
};

// Configuração do redux-persist
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

// Persistindo o reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Criando a store
const store = createStore(persistedReducer);

// Criando o persistor
const persistor = persistStore(store);

export { store, persistor };
