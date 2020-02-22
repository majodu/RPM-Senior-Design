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
import {SafeAreaView, StyleSheet, ScrollView, View, Text} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

// My Components
import P2PTest from './P2PTest';
import CameraUI from './CameraUI';

//Routing and navigation
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

class App extends Component {
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
