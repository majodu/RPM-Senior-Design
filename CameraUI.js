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
import {P2PTest} from './P2PTest';

//Camera Stuff
import {RNCamera} from 'react-native-camera';

//Routing and navigation
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

class CameraUI extends Component {
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
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <SafeAreaView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.overlay}>
          <View style={styles.yav}>
            <View style={styles.sampleTest}>
              <BaseFab
                active={this.state.active}
                direction="up"
                containerStyle={{}}
                style={{backgroundColor: '#5067FF'}}
                position="bottomRight"
                onPress={() => this.setState({active: !this.state.active})}>
                <BaseIcon name="share" />
                <Button style={{backgroundColor: '#34A34F'}}>
                  <BaseIcon name="logo-whatsapp" />
                </Button>
                <Button style={{backgroundColor: '#3B5998'}}>
                  <BaseIcon name="logo-facebook" />
                </Button>
                <Button disabled style={{backgroundColor: '#DD5144'}}>
                  <BaseIcon name="mail" />
                </Button>
              </BaseFab>
            </View>
          </View>
        </SafeAreaView>
        <SafeAreaView>
          <Text> Hello There!</Text>
          <Button
            title="P2P Test"
            onPress={() => this.props.navigation.navigate('P2PTest', {})}
          />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  yav: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  sampleTest: {
    position: 'absolute',
    left: 10,
    bottom: 0,
    backgroundColor: 'green',
    width: 100,
    height: 100,
  },
  overlay: {
    // display: 'flex',
    position: 'absolute',
    // backgroundColor: 'transparent',
    zIndex: 1,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
  },
});

export default CameraUI;
