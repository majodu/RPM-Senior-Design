/* eslint-disable quotes */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/**
 * This was not a super important feature for the demo, but ideally you would not upload privKeys
 * This component should instead create a cert signing request, allow the officer to enter his info
 * into there cert. If using x509v3 certificate format, maybe add a field for badge# and device HWid#
 *
 * This is also could be the place to create a block chain identity
 * A quick start is https://www.blockcerts.org/guide/
 * This is what we should have done
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
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {
  Button as BaseButton,
  Text as BaseText,
  Icon as BaseIcon,
  Fab as BaseFab,
  Container,
  Form,
  Content,
  Item,
  Input,
  Header,
} from 'native-base';

//Routing and navigation
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';

import {setDevID, setOffID} from './redux/modules/ID';

class IDUpload extends Component {
  state = {
    cert: null,
    key: null,
    pass: null,
    offButton: true,
    devButton: false,
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Form>
          <Item>
            <Input
              placeholder="Certificate"
              onChange={c => {
                this.setState({
                  cert: c,
                });
              }}
            />
          </Item>
          <Item>
            <Input
              placeholder="Key"
              onChange={c => {
                this.setState({
                  key: c,
                });
              }}
            />
          </Item>
          <Item last>
            <Input
              placeholder="Password"
              secureTextEntry={true}
              onChange={c => {
                this.setState({
                  pass: c,
                });
              }}
            />
          </Item>
          <BaseButton
            full
            disabled={!this.state.offButton}
            onPress={() => {
              let {cert, key, pass} = this.state;
              this.props.setOffID(cert, key, pass);
              this.setState({
                cert: null,
                key: null,
                pass: null,
                offButton: false,
                devButton: true,
              });
            }}>
            <BaseText>Submit Officer ID</BaseText>
          </BaseButton>
          <BaseButton
            full
            disabled={!this.state.devButton}
            onPress={() => {
              let {cert, key, pass} = this.state;
              this.props.setDevID(cert, key, pass);
              this.setState({
                cert: null,
                key: null,
                pass: null,
                offButton: false,
                devButton: false,
              });
            }}>
            <BaseText>Submit Device ID</BaseText>
          </BaseButton>
        </Form>
      </View>
    );
  }
}
const styles = StyleSheet.create({});

function mapStateToProps(state) {
  return {};
}
function mapDispatchToProps(dispatch) {
  return {
    setDevID: (cert, key, pass) => dispatch(setDevID(cert, key, pass)),
    setOffID: (cert, key, pass) => dispatch(setOffID(cert, key, pass)),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IDUpload);
