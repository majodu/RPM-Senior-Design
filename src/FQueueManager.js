/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/**
This is Component is also dependant on the network state machine. It has different sending methods
depending on the current state. This maybe should be merged with Network Manger as it does not
needs its own state.
The fetch commands need to use client certificates
 */

import React, {Component} from 'react';
import {Button as BaseButton, Text as BaseText} from 'native-base';

import {connect} from 'react-redux';
import {addQueue, removeQueue} from './redux/modules/ForwardQueue';
import {dataModes, connectionModes} from './redux/modules/connectionState';
import {StyleSheet, View, Button, NativeModules} from 'react-native';
import {getUniqueId, getManufacturer} from 'react-native-device-info';
const {RpmPeerToPeer} = NativeModules;
// import '../shim.js';
import crypto from 'crypto';
let uuid = getUniqueId();
class FQueueManager extends Component {
  state = {};

  constructor(props) {
    super(props);
  }
  checkSig(signature, body) {
    let cert = this.props.servCert;
    let servObj = {
      key: cert,
      //   passphrase: 'corona19',
    };
    const verify = crypto.createVerify('RSA-SHA256');
    verify.write(JSON.stringify(body));
    verify.end();
    return verify.verify(servObj, signature, 'hex');
  }

  getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
  }
  sendFull(dat) {
    //INTERNET
    let {offSig, devSig} = this.signData(dat);
    let formData = this.getFormData(dat);
    var video = {
      uri: dat.videoURL,
      type: 'video/quicktime',
      name: dat.videoURL.replace(/^.*[\\\/]/, ''),
    };
    formData.append('offSig', offSig);
    formData.append('devSig', devSig);
    formData.append('video', video);
    fetch('http://192.168.1.179:8080/uploadVideo', {
      method: 'POST',
      headers: {
        // Accept: 'multipart/form-data',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(function(response) {
        return response.json();
      })
      .then(
        (json => {
          if (json.status && this.checkSig(json.signature, dat)) {
            console.log('Successful Request and Signature Matches');
            this.props.removeQueue(dat);
          } else {
            console.log('Bad Request');
          }
        }).bind(this),
      )
      .catch(e => console.log(e));
  }
  signData(data) {
    console.log(data);
    let sign = crypto.createSign('RSA-SHA256');
    sign.write(JSON.stringify(data));
    sign.end();
    let offSig = sign.sign({key: this.props.offKey}, 'hex');
    console.log('using key', this.props.offKey);
    sign = crypto.createSign('RSA-SHA256');
    sign.write(JSON.stringify(data));
    sign.end();
    let devSig = sign.sign({key: this.props.devKey}, 'hex');
    return {offSig, devSig};
  }
  sendMetaData(dat) {
    // console.log(crypto.getHashes());
    const hash = crypto.createHash('sha256');

    hash.update('some data to hash');
    console.log(hash.digest('hex'));
    // let dat = this.props.queue[0];
    // console.log(crypto.getHashes());
    // console.log(this.signData(dat));
    let prepData = {
      metadata: dat,
      ...this.signData(dat),
    };
    fetch('http://192.168.1.179:8080/uploadMetadata', {
      method: 'POST',
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prepData),
    })
      .then(response => {
        return response.json();
      })
      .then(
        (json => {
          if (json.status && this.checkSig(json.signature, dat)) {
            console.log('Successful Request and Signature Matches');
            this.props.removeQueue(dat);
          } else {
            console.log('Bad Request');
          }
        }).bind(this),
      )
      .catch(e => console.log(e));
  }
  p2pFull(dat) {}
  p2pMetaData(dat) {
    // let dat = this.props.queue[0];
    // console.log(crypto.getHashes());
    // console.log(this.signData(dat));
    let signData1 = data => {
      console.log(data);
      let sign = crypto.createSign('RSA-SHA256');
      sign.write(JSON.stringify(data));
      sign.end();
      let offSig = sign.sign({key: this.props.offKey1}, 'hex');
      sign = crypto.createSign('RSA-SHA256');
      sign.write(JSON.stringify(data));
      sign.end();
      let devSig = sign.sign({key: this.props.devKey1}, 'hex');
      return {offSig, devSig};
    };
    fetch('http://192.168.1.179:8080/uploadMetadata', {
      method: 'POST',
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({metadata: dat.metadata, ...this.signData1(dat)}),
    })
      .then(response => {
        return response.json();
      })
      .then(
        (json => {
          if (json.status && this.checkSig(json.signature, dat.metadata)) {
            console.log('Successful Request and Signature Matches');
            this.props.removeQueue(dat);
          } else {
            console.log('Bad Request');
          }
        }).bind(this),
      )
      .catch(e => console.log(e));
  }

  render() {
    console.log('THIS IS THE CONNECTIONMODE ', this.props.connectionMode);
    console.log('THIS IS PEER', this.props.connectedPeer);
    if (this.props.queue.length) {
      let data = this.props.queue[0];
      if (!('metadata' in data)) {
        if (this.props.connectionMode === connectionModes.INTERNET) {
          //CELLULAR
          if (this.props.dataMode === dataModes.HASH) {
            //HASH
            this.sendMetaData(data);
          } else if (this.props.dataMode === dataModes.VIDEO) {
            //VIDEO
            this.sendFull(data);
          }
        } else if (this.props.connectionMode === connectionModes.P2P) {
          if (this.props.connectedPeer !== null) {
            // ADD A SIG stuff to the certificate
            console.log('SENDING P2P METADATA');
            let metadata = {
              metadata: data,
              ...this.signData(data),
            };
            RpmPeerToPeer.send([this.props.connectedPeer], metadata, res => {
              this.props.removeQueue(data);
              console.log(res);
            });
          }
        }
      } else {
        if (this.props.connectionMode === connectionModes.INTERNET) {
          this.p2pMetaData(data);
        }
      }
    }
    //   this.sendMetaData(data
    return <View />;
  }
}

function mapStateToProps(state) {
  const queue = state.fqueue.queue;
  const connectionMode = state.connectionState.connectionMode;
  const dataMode = state.connectionState.dataMode;
  const servCert = state.idState.serverCert;
  const offKey = state.idState.offKey;
  const devKey = state.idState.devKey;
  const connectedPeer = state.connectionState.myConnectedPeer;
  return {
    queue,
    connectionMode,
    dataMode,
    servCert,
    offKey,
    devKey,
    connectedPeer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addQueue: data => dispatch(addQueue(data)),
    removeQueue: data => dispatch(removeQueue(data)),
  };
}
const styles = StyleSheet.create({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FQueueManager);
