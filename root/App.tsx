import React, { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import UpdateUserLocation from "./src/components/UserLocationUpdate"
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import { requestMultiplePermissions } from './src/components/test_2'

const App: React.FC = () => {
    console.log("Running App");

    // useEffect(() => {
    //     startForegroundService();
    // }, []);

    return (
        <View style={styles.container}>
            <UpdateUserLocation />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
    },
});

export default App;
