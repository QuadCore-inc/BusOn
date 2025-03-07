import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { startBackgroundJob, stopBackgroundJob } from './BackgroundTask'; // Import functions

const App: React.FC = () => {
  const [playing, setPlaying] = useState(false);

  const toggleBackground = async () => {
    setPlaying(!playing);

    if (!playing) {
      await startBackgroundJob();
    } else {
      await stopBackgroundJob();
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