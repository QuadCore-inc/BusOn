import React from 'react';
import { View, StyleSheet } from "react-native";

import HomeScreen from './src/screens/Navigation';
import './gesture-handler';

const App: React.FC = () => {
    return (
        <HomeScreen />
    );
};

export default App;
