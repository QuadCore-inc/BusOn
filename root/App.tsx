import React from "react";
import { View, StyleSheet } from "react-native";
import UpdateUserLocation from "./src/components/UserLocationUpdate";  // Importando o componente UpdateUserLocation

const App: React.FC = () => {
    console.log("Running App");
    return (
        <View style={styles.container}>
            <UpdateUserLocation /> {/* Usando o componente UpdateUserLocation */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", // Alinha o conteúdo no centro da tela
    },
});

export default App;
