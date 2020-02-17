/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

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

//Routing and navigation
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Peer 2 Peer Native module and Event Hooks
const {RpmPeerToPeer} = NativeModules;
const EvntEmitter = new NativeEventEmitter(RpmPeerToPeer);

// Peer 2 Peer Native Event Listeners
const subTestEvent = EvntEmitter.addListener('TestEvent', reminder => {
  console.log(reminder.event);
});

const subPeerDisconnect = EvntEmitter.addListener(
  'RCTMultipeerConnectivityPeerDisconnected',
  body => {
    console.log(body);
  },
);
const subPeerConnecting = EvntEmitter.addListener(
  'RCTMultipeerConnectivityPeerConnecting',
  body => {
    console.log('peer connecting');
    console.log(body);
  },
);

const subInviteRecieved = EvntEmitter.addListener(
  'RCTMultipeerConnectivityInviteReceived',
  body => {
    console.log('invite recieved');
    console.log(body);
  },
);
const subPeerLost = EvntEmitter.addListener(
  'RCTMultipeerConnectivityPeerLost',
  body => {
    console.log(body);
  },
);
const subPeerFound2 = EvntEmitter.addListener(
  'RCTMultipeerConnectivityPeerFound',
  body => {
    console.log(body);
  },
);

class P2PTest extends Component {
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
  subDataRecieved = EvntEmitter.addListener(
    'RCTMultipeerConnectivityDataReceived',
    body => {
      console.log('data recieved');
      this.setState({
        setColor: body.color,
      });
    },
  );
  subPeerConnected = EvntEmitter.addListener(
    'RCTMultipeerConnectivityPeerConnected',
    body => {
      console.log('peer conneted');
      this.setState({
        isConnected: true,
        peer: body.peer.id,
      });
      console.log(body);
    },
  );
  subPeerFound = EvntEmitter.addListener(
    'RCTMultipeerConnectivityPeerFound',
    body => {
      console.log('connection found');
      //   console.log(body);
      //   console.log(`this is the old state ${this.state.invitations}`);
      let newState = [...this.state.invitations, body.peer];
      //   console.log(
      // `the new state is ${newState} and the length is ${newState.length}`,
      //   );
      if (Array.isArray(newState)) {
        this.setState({
          invitations: newState,
        });
      }
    },
  );
  componentDidMount() {
    RpmPeerToPeer.getName((error, name, id) => {
      this.setState({
        deviceName: name,
        deviceID: id,
      });
    });
  }
  componentWillUnmount() {
    this.stopAdvertizing();
    this.stopBrowsing();
    this.subDataRecieved.remove();
    this.subPeerConnected.remove();
    this.subPeerFound.remove();
  }
  increment = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };
  startAdvertising() {
    if (!this.state.isAdvertizing) {
      console.log('starting advertising');
      RpmPeerToPeer.advertise('test', {data: 'some extra data'});
      this.setState({
        isAdvertizing: true,
      });
    }
  }
  stopAdvertizing() {
    if (this.state.isAdvertizing) {
      RpmPeerToPeer.stopAdvertising();
      this.setState({
        isAdvertizing: false,
      });
    }
  }
  startBrowsing() {
    if (!this.state.isBrowsing) {
      console.log('started browsing');
      RpmPeerToPeer.browse('test');
      this.setState({
        isBrowsing: true,
      });
    }
  }
  stopBrowsing() {
    if (this.state.isBrowsing) {
      RpmPeerToPeer.stopBrowsing();
      this.setState({
        isBrowsing: false,
      });
    }
  }

  render() {
    const counter = this.state.counter;
    const listItems = this.state.invitations.map(peer => (
      <Picker.Item key={peer.id} label={peer.id} value={peer.id} />
    ));
    return (
      <>
        <StatusBar barStyle="dark-content" />

        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text>Device Name: {this.state.deviceName}</Text>
                <Text>Device ID: {this.state.deviceID}</Text>
                <Button
                  title="CameraUI"
                  onPress={() => this.props.navigation.navigate('CameraUI', {})}
                />
                <Button
                  title="Advertise"
                  onPress={() => {
                    // Alert.alert('whoa');
                    // RpmPeerToPeer.browse('test');
                    this.startAdvertising();
                    // RpmPeerToPeer.sampleMethod('Test Notif');
                    // this.increment();
                  }}
                />

                <Button
                  title="Browsing"
                  onPress={() => {
                    this.startBrowsing();
                  }}
                />
                <Button
                  title="Stop"
                  onPress={() => {
                    this.stopAdvertizing();
                    this.stopBrowsing();
                  }}
                />
                <Button
                  title="Send Color"
                  onPress={() => {
                    let newColor = this.state.colors[
                      Math.floor(Math.random() * this.state.colors.length)
                    ];
                    if (this.state.isConnected) {
                      RpmPeerToPeer.sendData([this.state.peer], {
                        body: {
                          color: newColor,
                        },
                      });
                    }
                    this.setState({
                      setColor: newColor,
                    });
                  }}
                />
                {this.state.isBrowsing && (
                  <Picker
                    selectedValue={this.state.pickerValue}
                    style={{height: 50, width: 100}}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({pickerValue: itemValue});
                      if (itemValue !== 'none') {
                        RpmPeerToPeer.invite(itemValue, returned =>
                          console.log('function returned'),
                        );
                      }
                    }}>
                    <Picker.Item key="none" label="None" value="none" />
                    {listItems}
                  </Picker>
                )}
                <View
                  style={{
                    height: 100,
                    width: 100,
                    backgroundColor: this.state.setColor,
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  scrollView: {
    // position: 'absolute',
    backgroundColor: Colors.lighter,
    zIndex: 2,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default P2PTest;
