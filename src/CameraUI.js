/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/**
 * This part is ok. The main thing is that the camera usage is kind of messy. You have to create a
 * new video every 5 seconds so you can hash it. If you wanted to implement something natively on
 * iOS you would have to use AVCaptureVideoDataOutput so you can hash the frames. This could allow you
 * to build livestream and hash functionality. These hashes could then be passed to the react side every
 * certain amount of seconds.
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

// Check camera permissions
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

//Camera Stuff
import {RNCamera} from 'react-native-camera';

// Temporary use for camera roll access over  rnfs
import CameraRoll from '@react-native-community/cameraroll';

// React File System
import RNFS from 'react-native-fs';

// IOS ALBUM NAME
const albumName = 'RPMBodycam';
// const dirPicutures = `${RNFS.ExternalStorageDirectoryPath}/Pictures`;

import {connect} from 'react-redux';

import {add} from './redux/modules/metadata';
import NetworkManager from './NetworkManager';
import {addQueue} from './redux/modules/ForwardQueue';
import {setDataMode, dataModes} from './redux/modules/connectionState';
import {getUniqueId, getManufacturer} from 'react-native-device-info';

class CameraUI extends Component {
  state = {
    recordOptions: {
      quality: RNCamera.Constants.VideoQuality['480p'],
      codec: RNCamera.Constants.VideoCodec.H264,
      maxDuration: 10,
    },
    isRecording: false,
  };
  constructor(props) {
    super(props);
  }
  uuid = getUniqueId();
  saveFile = uri => {
    const albumPath = `${RNFS.DocumentDirectoryPath}/${albumName}`;

    const filePathInAlbum = `${albumPath}/testing.mov`;

    return RNFS.mkdir(albumPath)
      .then(() => {
        RNFS.copyFile(uri, filePathInAlbum)
          // Next step to show album without the need to re-boot your device:
          .then(() => RNFS.scanFile(filePathInAlbum))
          .then(data => {
            console.log('File Saved Successfully!');
          });
      })
      .catch(error => {
        console.log('Could not create dir', error);
      });
  };

  recordVideo = async () => {
    if (this.camera) {
      setTimeout(
        function() {
          this.stopRecording();
        }.bind(this),
        5000,
      );
      let metadata = {
        startTime: Date(),
        hops: 0,
        recieveTime: 'null',
        isRecording: true,
        deviceID: this.uuid,
        videoURL: null,
      };
      const data = await this.camera.recordAsync(this.state.recordOptions);
      metadata.endTime = Date();
      metadata.videoURL = data.uri;
      let saved = CameraRoll.saveToCameraRoll(data.uri);
      saved
        .then(function(result) {
          console.log('save succeeded ' + result);
        })
        .catch(function(error) {
          console.log('save failed ' + error);
        });
      // console.log('getting video Hash...');

      //   console.log('metadata');
      //   console.log(metadata);
      RNFS.hash(data.uri, 'sha256').then(result => {
        metadata.hash = result;
        this.props.addQueue(metadata);
        this.props.add(
          metadata.hash,
          metadata.deviceID,
          metadata.startTime,
          metadata.endTime,
          metadata.recieveTime,
          metadata.hops,
          metadata.isRecording,
        );
      });
      // Do network things.
      //Store Metadata Local

      if (this.state.isRecording) {
        this.recordVideo();
      }
    }
  };
  stopRecording = () => {
    if (this.camera) {
      this.camera.stopRecording();
    }
  };

  deleteFile(filename) {
    const filepath = `${dirPicutures}/${filename}`;
    RNFS.unlink(filepath)
      .then(() => {
        console.log('FILE DELETED');
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch(err => {
        console.log(err.message);
      });
  }
  render() {
    let record = this.state.isRecording;
    return (
      <View>
        <SafeAreaView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.Overlay}>
          <View style={styles.ButtonContainer}>
            <View style={styles.RecordButtonContainer}>
              <BaseButton
                light={record}
                danger={!record}
                onPress={() => {
                  this.setState({
                    isRecording: !this.state.isRecording,
                  });
                  if (record) {
                    // this.stopRecording();
                  } else {
                    this.recordVideo();
                  }
                }}>
                <BaseText light={record}>
                  {!record ? ' Record ' : '    Stop'}
                </BaseText>
              </BaseButton>
            </View>

            <View style={styles.DataTypeSelectorContainer}>
              <BaseFab
                active={this.state.active}
                direction="up"
                containerStyle={{}}
                style={{backgroundColor: '#5067FF'}}
                // position="bottomLeft"
                onPress={() => this.setState({active: !this.state.active})}>
                <BaseIcon name="share" />
                <BaseButton
                  onPress={() => {
                    this.props.setDataMode(dataModes.HASH);
                  }}
                  style={{backgroundColor: '#34A34F'}}>
                  <BaseIcon name="ios-code-working" />
                </BaseButton>
                <BaseButton
                  onPress={() => {
                    console.log(`setting datamode ${dataModes.VIDEO}`);
                    this.props.setDataMode(dataModes.VIDEO);
                  }}
                  style={{backgroundColor: '#3B5998'}}>
                  <BaseIcon name="ios-videocam" />
                </BaseButton>
                <BaseButton
                  onPress={() => {
                    this.props.navigation.navigate('Certificate Entry', {});
                  }}
                  style={{backgroundColor: '#DD5144'}}>
                  <BaseIcon name="ios-document" />
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
      </View>
    );
  }
}
function mapStateToProps(state) {
  const connectionMode = state.connectionState.connectionMode;
  return {connectionMode};
}
function mapDispatchToProps(dispatch) {
  return {
    addQueue: data => {
      dispatch(addQueue(data));
    },
    add: function(
      hash,
      deviceID,
      startTime,
      endTime,
      recieveTime,
      hops,
      isRecording,
    ) {
      dispatch(
        add(hash, deviceID, startTime, endTime, recieveTime, hops, isRecording),
      );
    },
    setDataMode: mode => dispatch(setDataMode(mode)),
  };
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
    width: 130,
    top: 0,
    left: 0,
  },
  RecordButtonContainer: {
    position: 'absolute',
    // backgroundColor: 'blue',
    marginLeft: -48,
    height: 69,
    width: 100,
    bottom: 0,
    left: '50%',
  },
  DataTypeSelectorContainer: {
    position: 'absolute',
    left: 10,
    bottom: 0,
    // backgroundColor: 'green',
    width: 90,
    height: 90,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CameraUI);
// check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
//                       switch (result) {
//                         case RESULTS.UNAVAILABLE:
//                           console.log(
//                             'This feature is not available (on this device / in this context)',
//                           );
//                           break;
//                         case RESULTS.DENIED:
//                           console.log(
//                             'The permission has not been requested / is denied but requestable',
//                           );
//                           request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result =>
//                             console.log(result),
//                           );
//                           break;
//                         case RESULTS.GRANTED:
//                           console.log('The permission is granted');
//                           this.recordVideo();
//                           //   CameraRoll.getPhotos({first: 1}).then(resp => {
//                           //     console.log(resp.edges.length);
//                           //   });
//                           break;
//                         case RESULTS.BLOCKED:
//                           console.log(
//                             'The permission is denied and not requestable anymore',
//                           );
//                           break;
//                       }
//                     });
//                   }
//                 }
