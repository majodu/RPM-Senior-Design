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

//Redux and Redux Persist
import {Provider} from 'react-redux';
// import {PersistGate} from 'redux-persist/lib/integration/react';

//store
import {store} from '../src/redux/configureStore';
// Components
import {SafeAreaView, StyleSheet, ScrollView, View, Text} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

// My Components
// import P2PTest from './P2PTest';
import CameraUI from './CameraUI';
import IDUpload from './IDUpload';

//Routing and navigation
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import NetworkManager from './NetworkManager';
import FQueueManager from './FQueueManager';
const Stack = createStackNavigator();

console.disableYellowBox = true;
// <FQueueManager />
class App extends Component {
  render() {
    return (
      <>
        <Provider store={store}>
          <NetworkManager />
          <FQueueManager />
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Camera View">
              <Stack.Screen name="Certificate Entry" component={IDUpload} />
              <Stack.Screen name="Camera View" component={CameraUI} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </>
    );
  }
}
const styles = StyleSheet.create({});

export default App;
