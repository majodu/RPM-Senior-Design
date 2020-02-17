/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

// Components
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  Button,
  Alert,
  NativeEventEmitter,
  Picker,
} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

import {
  Button as BaseButton,
  Text as BaseText,
  Icon as BaseIcon,
  Fab as BaseFab,
} from 'native-base';

// My Components
import P2PTest from './P2PTest';
import CameraUI from './CameraUI';

//Routing and navigation
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

class App extends Component {
  state = {
    counter: 0,
    deviceName: null,
    deviceID: null,
    isAdvertizing: false,
    isBrowsing: false,
    invitations: [],
    pickerValue: 'none',
    colors: [
      'blue',
      'red',
      'yellow',
      'orange',
      'green',
      'purple',
      'black',
      'beige',
      'brown',
      'Crimson',
    ],
    setColor: 'blue',
    isConnected: false,
    peer: {},
  };

  render() {
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="CameraUI">
            <Stack.Screen name="CameraUI" component={CameraUI} />
            <Stack.Screen name="P2PTest" component={P2PTest} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
const styles = StyleSheet.create({});

export default App;
