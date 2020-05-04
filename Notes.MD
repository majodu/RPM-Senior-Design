App Features

- Certificate
- Server Side
- Livestream (Possibly File fs?)
- Video over P2P
- PeerTalk USB Upload
- Settings for video length
- Update Ping

The Peer seeking process has to happen in the background with automatic connection and disconnection

Revamp the whole P2P with a background process that keeps track of peer IDs and certificates, pauses on app close and reopens on app open

- On p2p enable, start searching for connections
- On connect, enable data sending

Video Starts recording
Checks connection and data mode

Server side

MetaData format

```json
{
Hash: 'sha...'
//Recording
DeviceID: 'DeviceID',
StartTime: 'Serialized DateObject'
EndTime: 'Serialized DateObject'

}

```
