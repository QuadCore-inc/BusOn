import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Map  from './Map';
import LocationScreen from './Location';
import WifiDetailsProvider from '../contexts/WifiListContext';
import WatchBus from '../components/WatchBus';

const Tab = createBottomTabNavigator();

const HomeScreen = (props: any) => {
  return (
    <NavigationContainer>
        <Tab.Navigator>
            <Tab.Screen name="Mapa" 
                component={Map} >
            </Tab.Screen>
            <Tab.Screen name="Localização" 
                component={WatchBus} >
            </Tab.Screen>
            <Tab.Screen name="WifiList" 
                component={WifiDetailsProvider} >
            </Tab.Screen>
        </Tab.Navigator>
    </NavigationContainer>
  );
};

export default HomeScreen;