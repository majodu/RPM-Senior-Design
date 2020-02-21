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

// Check camera permissions
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

//Camera Stuff
import {RNCamera} from 'react-native-camera';

// Temporary use for camera roll access over  rnfs
import CameraRoll from '@react-native-community/cameraroll';

// React File System
import RNFS from 'react-native-fs';

// IOS ALBUM NAME
const albumName = 'RPM Bodycam';
// const dirPicutures = `${RNFS.ExternalStorageDirectoryPath}/Pictures`;

class CameraUI extends Component {
  state = {
    recordOptions: {
      quality: RNCamera.Constants.VideoQuality['480p'],
      codec: RNCamera.Constants.VideoCodec.H264,
      maxDuration: 5,
    },
  };
  saveFile = uri => {
    const albumPath = `${RNFS.PicturesDirectoryPath}/${albumName}`;

    const filePathInAlbum = `${albumPath}/testing.mov`;

    return RNFS.mkdir(albumPath)
      .then(() => {
        RNFS.copyFile(uri, filePathInAlbum)
          // Next step to show album without the need to re-boot your device:
          .then(() => RNFS.scanFile(filePathInAlbum))
          .then(data => {
            console.log(data);
            console.log('File Saved Successfully!');
          });
      })
      .catch(error => {
        console.log('Could not create dir', error);
      });
  };
  recordVideo = async () => {
    if (this.camera) {
      const data = await this.camera.recordAsync(this.state.recordOptions);

      let saved = CameraRoll.saveToCameraRoll(data.uri);
      saved
        .then(function(result) {
          console.log('save succeeded ' + result);
        })
        .catch(function(error) {
          console.log('save failed ' + error);
        });
      console.log('getting video Hash...');
      RNFS.hash(data.uri, 'sha512').then(result => console.log(result));
    }
  };
  constructor(props) {
    super(props);
  }
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
                <BaseButton
                  onPress={() => {
                    check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
                      switch (result) {
                        case RESULTS.UNAVAILABLE:
                          console.log(
                            'This feature is not available (on this device / in this context)',
                          );
                          break;
                        case RESULTS.DENIED:
                          console.log(
                            'The permission has not been requested / is denied but requestable',
                          );
                          request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result =>
                            console.log(result),
                          );
                          break;
                        case RESULTS.GRANTED:
                          console.log('The permission is granted');
                          this.recordVideo();
                          //   CameraRoll.getPhotos({first: 1}).then(resp => {
                          //     console.log(resp.edges.length);
                          //   });
                          break;
                        case RESULTS.BLOCKED:
                          console.log(
                            'The permission is denied and not requestable anymore',
                          );
                          break;
                      }
                    });
                  }}
                  style={{backgroundColor: '#34A34F'}}>
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
