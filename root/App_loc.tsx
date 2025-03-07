import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
// import { startBackgroundService, stopBackgroundService } from './src/components/test_3'; // Import functions
import { requestMultiplePermissions } from './src/components/test_2'; // Import functions
// import culhao from './src/components/test_3'
import BackgroundService from 'react-native-background-actions';

requestMultiplePermissions()

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments) => {
    console.log("Entrando na tarefa");
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            console.log(i);
            await sleep(delay);
        }
        resolve();
    });
};

const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane',
    parameters: {
        delay: 5000,
    },
};

const startBackgroundService = async () => {
    try {
        await BackgroundService.start(veryIntensiveTask, options);
        await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
        console.log('Background service started successfully!');
    } catch (error) {
        console.error('Error starting background service:', error);
    }
};

const stopBackgroundService = async () => {
    try {
        await BackgroundService.stop();
        console.log('Background service stopped successfully!');
    } catch (error) {
        console.error('Error stopping background service:', error);
    }
};

const App: React.FC = () => {
    const [playing, setPlaying] = useState(false);

    const toggleBackground = async () => {
        setPlaying(!playing);

        if (!playing) {
            console.log("Solicitando inicio");
            await startBackgroundService();
        } else {
            console.log("Solicitando fim");
            await stopBackgroundService();
        }
    };

    return (
        <View style={styles.body}>
            <TouchableOpacity style={styles.button} onPress={toggleBackground}>
                <Text style={styles.buttonText}>
                    {playing ? 'Stop Background Task' : 'Start Background Task'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    body: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: 50,
        width: 200,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default App;