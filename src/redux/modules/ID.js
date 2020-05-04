import {getUniqueId, getManufacturer} from 'react-native-device-info';
/**
 * Only public keys should be managed here
 * Private keys should be managed with the keychain
 * Unfortunately Certificates do not have any react native lib to store in keychain for IOS
 * but they do have a pretty simple api if a native library were to be written
 */
const initialState = {
  //peer_id as the key and the other data as the body
  ID: getUniqueId(),
  offKey: null,
  devKey: null,
  // This was hardcoded since it was a public cert, but there should be a function checking
  // there is a server role in ther certificate.
  serverCert: `-----BEGIN CERTIFICATE-----
MIIEpjCCAo6gAwIBAgIUNzX22o4NIa2NY3JuElJZNstr7gkwDQYJKoZIhvcNAQEL
BQAwgYgxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJWQTEQMA4GA1UEBwwHVmlyZ2lu
YTEZMBcGA1UECgwQUlBNIFBvbGljZSBEZXB0LjEQMA4GA1UECwwHdGVjaG9wczEL
MAkGA1UEAwwCY2ExIDAeBgkqhkiG9w0BCQEWEWNlcnRzQGV4YW1wbGUuY29tMB4X
DTIwMDQyNjA5NDkyMFoXDTIzMDEyMDA5NDkyMFowgZAxCzAJBgNVBAYTAlVTMQsw
CQYDVQQIDAJWQTEQMA4GA1UEBwwHRmFpcmZheDEZMBcGA1UECgwQUlBNIFBvbGlj
ZSBEZXB0LjEQMA4GA1UECwwHdGVjaG9wczETMBEGA1UEAwwKaGFzaHNlcnZlcjEg
MB4GCSqGSIb3DQEJARYRY2VydHNAZXhhbXBsZS5jb20wggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQCfK7YGBg+phVnqCMPOQPJ4HhDLwQNWkNguAXYK/Zo+
xWS4naiQzyI2kQDqyn64IYxTXb67JpOQ1Bvmbh58RuG//MWAnrlg47U0Ysq1hb0m
G7CEFQL5Eu0M9KBXpNnI5bltfBdYoak9Uj12JIerfDXhirvLf5RQJOkD4hwnBXrF
+HcBmQFHPNtU22Kvv07QI3AulsNyJHcMHWHwL/IhxN2+LNGw73quAppaLCoBMbjY
Fw5yy9DjNkYVGaKss5uc5GcxtPcqYX0EjR5yEMd3oZYVKlAjXZrrrHC56qypgIA6
r5/6xDraBTVsk3UEyDU44aoZwKOneuZqYMeTNUF5wyjVAgMBAAEwDQYJKoZIhvcN
AQELBQADggIBAHe7KWpIUKvtLJL7pRs9C1cGO2+/lGI2oxM0LxFgaWsFw++7oD9I
rJehP4QFub6lBDacwOF3El7pdqnFsa8q/7XQm3cFtx/IPVSYiCxG+hpb5kHrGv+a
i2+9Bi0Cof/07KPo/6nT0PHnr0Z+hHfxiOCfItkg16YWIVgV0MaKztsIbINswd8g
+kTQZDzoPxdXtn4H5pkG6asGrLDoeaGx9MKnEkruyyJdDo2KVHYM734I6vSSmbEw
+kWAAo2wxfUowifG4uTainBP95YGRLgTuld9ZoHbDJUtMpl23cb8yR2FqXA5TrT+
wJLFMbobqvLx0RdBN4DDDddeqEFxjtADNR6DjyPDHy7yEN2ouQ71+xD8EQTSsasi
roda7BMwNLfiV8E96/7K+8Sxf2GcYwCm/Qq1dlchRLewTi4mpzY9egv9rZmgFJkE
cxfWJxR4xI5U8z2wXvjW/iyZ72THCWJM+1FM3kSxTRlEMIXKKMUqgAZlYlthEdxy
Xfa8fzfHZgBl5uD8eQwphZ9CMibLdP2Rc7pJbH72pAE/4IbYveCmtv+laVtvXnnO
4KUSOt+kOJ/0NlcJsRDipty9l9+zWDTOHZ4YYlrikv3ckYYBL2yryCWUjiUN7k8H
ZNtt8dI4jAEpYdFRbL490hFxh2IyIfIhBcjG729rz8AqZY/y40D0fUG9
-----END CERTIFICATE-----
`,
};
// let initialState = {a: 'a'};

// Actions
const OFFSET = 'ID/offset';
const DEVSET = 'ID/devset';

// const  = 'metadata/DELETEALL';

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OFFSET:
      return Object.assign({}, state, {offID: {...action.data}});
    case DEVSET:
      return Object.assign({}, state, {devID: {...action.data}});
    default:
      return state;
  }
}

// Action Creators
export function setOffID(cert, key, pass) {
  let data = {
    cert,
    key,
    pass,
  };
  return {type: 'nothing', data};
}
export function setDevID(cert, key, pass) {
  let data = {
    cert,
    key,
    pass,
  };
  return {type: 'nothing', data};
}
