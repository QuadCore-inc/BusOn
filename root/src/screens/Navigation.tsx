import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { Provider } from 'react-redux'; // Importando o Provider do react-redux
import { PersistGate } from 'redux-persist/integration/react'; // Importando o PersistGate
import { store, persistor } from '../state/store'; // Importando a store e o persistor
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Map from './Map';
import WatchBus from '../components/WatchBusList';
import BusList from './BusList';
import BeaconCrowdsourcing from '../contexts/BeaconCrowdsourcing';
import BottomTest from'./Bottom';
import { colors } from '../utils/styles';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeScreen = (props: any) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Tab.Navigator initialRouteName="Localização"
           screenOptions={({ route }) => ({
            tabBarActiveTintColor: colors.colorAcai,
            tabBarInactiveTintColor: "gray",
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              let iconName = "help-circle-outline";
      
              if (route.name === "Localização") {
                iconName = "map-marker-radius-outline";
              } else if (route.name === "Configurações") {
                iconName = "cog-outline";
              }
      
              return <Icon name={iconName} size={size} color={color} />;
            },
          })}
          >
            <Tab.Screen name="Configurações" component={BusList} options={{headerShown: false}} />
            <Tab.Screen name="Localização" component={WatchBus} options={{headerShown: false}} />
            {/* <Tab.Screen name="Cuzinho" component={BottomTest} options={{headerShown: false}} /> */}
  
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default HomeScreen;
