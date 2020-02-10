#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <React/RCTEventEmitter.h>
@import MultipeerConnectivity;


@interface RpmPeerToPeer : RCTEventEmitter <RCTBridgeModule, NSStreamDelegate, MCSessionDelegate, MCNearbyServiceBrowserDelegate, MCNearbyServiceAdvertiserDelegate>

 @property(nonatomic, strong) NSMutableDictionary *peers;
 @property(nonatomic, strong) NSMutableDictionary *connectedPeers;
 @property(nonatomic, strong) NSMutableDictionary *invitationHandlers;
 @property(nonatomic, strong) MCPeerID *peerID;
 @property(nonatomic, strong) MCSession *session;
 @property(nonatomic, strong) MCNearbyServiceBrowser *browser;
 @property(nonatomic, strong) MCNearbyServiceAdvertiser *advertiser;

 @end
