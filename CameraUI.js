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
import {SafeAreaView, StyleSheet, View, Text, Button} from 'react-native';

import {
  Button as BaseButton,
  Text as BaseText,
  Icon as BaseIcon,
  Fab as BaseFab,
} from 'native-base';

//Camera Stuff
import {RNCamera} from 'react-native-camera';

//Routing and navigation
import 'react-native-gesture-handler';

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
          style={styles.Overlay}>
          <View style={styles.ButtonContainer}>
            <View>
              <BaseButton
                rounded
                info
                style={{width: 100}}
                onPress={() => this.props.navigation.navigate('P2PTest', {})}>
                <BaseText> Test P2P </BaseText>
              </BaseButton>
            </View>
            <View style={styles.DataTypeSelectorContainer}>
              <BaseFab
                active={this.state.active}
                direction="up"
                containerStyle={{}}
                style={{backgroundColor: '#5067FF'}}
                position="bottomRight"
                onPress={() => this.setState({active: !this.state.active})}>
                <BaseIcon name="share" />
                <BaseButton style={{backgroundColor: '#34A34F'}}>
                  <BaseIcon name="logo-whatsapp" />
                </BaseButton>
                <BaseButton style={{backgroundColor: '#3B5998'}}>
                  <BaseIcon name="logo-facebook" />
                </BaseButton>
                <BaseButton disabled style={{backgroundColor: '#DD5144'}}>
                  <BaseIcon name="mail" />
                </BaseButton>
              </BaseFab>
            </View>
          </View>
        </SafeAreaView>
        <SafeAreaView>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.Camera}
          />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  ButtonContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  P2PTestContainer: {
    position: 'absolute',
    height: 100,
    width: 150,
    top: 0,
    left: 0,
  },
  DataTypeSelectorContainer: {
    position: 'absolute',
    left: 10,
    bottom: 0,
    backgroundColor: 'green',
    width: 100,
    height: 100,
  },
  Overlay: {
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
  Camera: {
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
  },
});

export default CameraUI;
