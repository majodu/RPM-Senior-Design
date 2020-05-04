/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/**
 * This should be implemented like a state machine. The States INTERNET, LOCAL, P2P are fine but P2P
 * should be split up into P2P-SENDER and P2P Reciever. It would be way better to implement this on the iOS
 * side since it have a view of the session object, along with peers and connected peers.
 * The state machine logic should happen outside of the P2PEvent Hooks. They should modify state values and
 * the state machine handles everything else.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  setConnectionMode,
  connectionModes,
  setPeer,
} from './redux/modules/connectionState';
import {addQueue} from './redux/modules/ForwardQueue';
import NetInfo from '@react-native-community/netinfo';
import {
  StyleSheet,
  NativeModules,
  Button,
  NativeEventEmitter,
} from 'react-native';

const {RpmPeerToPeer} = NativeModules;
const P2PEvents = new NativeEventEmitter(RpmPeerToPeer);

class NetworkManager extends Component {
  state = {
    deviceName: null,
    deviceID: null,
    isAdvertizing: false,
    isBrowsing: false,
    invitations: [],
    isConnected: false,
    buttonTitle: '',
    peersConnected: {},
    peersConnecting: {},
  };
  // on peer found add to peer connecting
  //    check before sending invite
  // on invide add to peer connecting
  //    check before rsvp
  componentWillUnmount() {
    this.stopAdvertizing();
    this.stopBrowsing();
    this.subDataRecieved.remove();
    this.subPeerConnected.remove();
    this.subPeerDisconnect.remove();
    this.subPeerConnecting.remove();
    this.subPeerFound.remove();
    this.subPeerLost.remove();
    this.subInviteRecieved.remove();
    // this.unsubscribe();
  }
  unsubscribe = NetInfo.addEventListener(state => {
    if (state.type === 'wifi') {
      // set state to local or P2P
      if (this.props.connectionMode !== connectionModes.INTERNET) {
        this.props.setConnectionMode(connectionModes.INTERNET);
        this.stopBrowsing();
        console.log('ADVERTIZING');
      }
      this.startAdvertising();
    } else {
      if (this.props.connectionMode === connectionModes.INTERNET) {
        this.props.setConnectionMode(connectionModes.LOCAL);
        // this.stopBrowsing();
        // this.stopAdvertising();
        this.startAdvertising();
        this.startBrowsing();
      }
    }
    // console.log('Connection type', state.type);
    // console.log('Is connected?', state.isConnected);
    // console.log(state.details);
    console.log('NETINFO', this.props.connectionMode);
  });
  shouldConnect = peer => {
    if (peer.id in this.state.peersConnected) {
      return false;
    }
    if (peer.id in this.state.peersConnecting) {
      return false;
    }
    this.setState({
      peersConnecting: Object.assign({}, this.state.peersConnecting, {
        [peer.id]: peer,
      }),
    });
    return true;
  };

  subDataRecieved = P2PEvents.addListener(
    'RCTMultipeerConnectivityDataReceived',
    body => {
      console.log('THIS WAS RECIEVED', body);
      if (body.sender.id === this.props.connectedPeer) {
        this.props.addQueue(body.data);
      }
    },
  );
  subPeerConnected = P2PEvents.addListener(
    'RCTMultipeerConnectivityPeerConnected',
    body => {
      let copyPeersConnecting = {...this.state.peersConnecting};
      delete copyPeersConnecting[body.peer.id];
      this.setState({
        peersConnecting: copyPeersConnecting,
        peersConnected: Object.assign({}, this.state.peersConnected, {
          [body.peer.id]: body.peer,
        }),
      });
      console.log('Connection Successful!');
      console.log('THIS IS PEER ID', body.peer.id);
      if (this.props.connectionMode !== connectionModes.INTERNET) {
        this.props.setConnectionMode(connectionModes.P2P);
        this.stopBrowsing();
      }
      this.props.setPeer(body.peer.id);
    },
  );

  subPeerFound = P2PEvents.addListener(
    'RCTMultipeerConnectivityPeerFound',
    body => {
      console.log('PEER FOUND');
      if (this.shouldConnect(body.peer)) {
        if (this.props.connectionMode === connectionModes.LOCAL) {
          console.log('sending invite');
          RpmPeerToPeer.invite(body.peer.id, response =>
            console.log(`invite sent to ${body.peer.id}`),
          );
        }
      }
    },
  );
  // if peer found join
  //
  subPeerDisconnect = P2PEvents.addListener(
    'RCTMultipeerConnectivityPeerDisconnected',
    body => {
      console.log('Disconnection');
      let id = body.peer.id;
      if (this.props.connectedPeer === id) {
        this.setState({
          peersConnected: {},
          peersConnected: {},
        });
        if (this.props.connectionMode !== connectionModes.INTERNET) {
          this.props.setConnectionMode(connectionModes.LOCAL);
        }
        this.props.setPeer(null);
        this.stopAdvertizing();
        this.stopBrowsing();
        this.startBrowsing();
        this.startAdvertising();
      }
    },
  );
  subPeerConnecting = P2PEvents.addListener(
    'RCTMultipeerConnectivityPeerConnecting',
    body => {
      console.log('Connecting');
    },
  );

  subInviteRecieved = P2PEvents.addListener(
    'RCTMultipeerConnectivityInviteReceived',
    body => {
      console.log('INVITE RECIEVED');
      if (this.shouldConnect(body.peer)) {
        RpmPeerToPeer.rsvp(body.invite.id, true, response =>
          console.log('invitation accepted'),
        );
      }
    },
  );
  subPeerLost = P2PEvents.addListener(
    'RCTMultipeerConnectivityPeerLost',
    body => {
      //   RpmPeerToPeer.disconnect(() => {});
      //   this.stopBrowsing();
      //   this.startBrowsing();
    },
  );
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
    if (
      this.state.isAdvertizing &&
      RpmPeerToPeer.stopAdvertising !== undefined
    ) {
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
  constructor(props) {
    super(props);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
      <Button
        title={this.state.buttonTitle}
        onPress={() => {
          this.props.setConnectionMode(connectionModes.INTERNET);

          //   console.log(this.props.connectionMode);
          //   console.log(connectionModes.INTERNET);
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  const connectionMode = state.connectionState.connectionMode;
  const connectedPeer = state.connectionState.myConnectedPeer;
  return {connectionMode, connectedPeer};
}
function mapDispatchToProps(dispatch) {
  return {
    setConnectionMode: mode => dispatch(setConnectionMode(mode)),
    setPeer: id => dispatch(setPeer(id)),
    addQueue: data => dispatch(addQueue(data)),
  };
}
const styles = StyleSheet.create({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetworkManager);
