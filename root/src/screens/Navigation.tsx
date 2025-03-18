import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { Provider } from 'react-redux'; // Importando o Provider do react-redux
import { PersistGate } from 'redux-persist/integration/react'; // Importando o PersistGate
import { store, persistor } from '../state/store'; // Importando a store e o persistor

import Map from './Map';
import WatchBus from '../components/WatchBusList';
import BusList from './BusList';
import BeaconCrowdsourcing from '../contexts/BeaconCrowdsourcing';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeScreen = (props: any) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Localização">
            <Tab.Screen name="Configurações" component={BusList} options={{headerShown: false}} />
            <Tab.Screen name="Localização" component={WatchBus} options={{headerShown: false}} />
            {/* <Tab.Screen name="Localização" component={BeaconCrowdsourcing} options={{headerShown: false}} /> */}
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default HomeScreen;
