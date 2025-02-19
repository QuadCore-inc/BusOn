import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

import MapComponent from './components/Map'

import { UserLocationUpdate } from './components/UserLocationUpdate';


const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

export default class App extends Component {
  render() {
    return (
      <View style={styles.page}>
        {/* <MapComponent /> */}
        <UserLocationUpdate />
      </View>
    );
  }
}