import Peer from "peerjs";

export abstract class Connection {
  protected ownConn: Peer;

  private iceConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }, // Primary STUN
      {
        urls: "stun:stun.relay.metered.ca:80", // Other STUN
      },
      {
        urls: "turn:global.relay.metered.ca:80", //TURNs with credentials
        username: "e3ad760fe887d9e08a94e18f",
        credential: "S4dcWSoVsJ/CSU1x",
      },
      {
        urls: "turn:global.relay.metered.ca:80?transport=tcp",
        username: "e3ad760fe887d9e08a94e18f",
        credential: "S4dcWSoVsJ/CSU1x",
      },
      {
        urls: "turn:global.relay.metered.ca:443",
        username: "e3ad760fe887d9e08a94e18f",
        credential: "S4dcWSoVsJ/CSU1x",
      },
      {
        urls: "turns:global.relay.metered.ca:443?transport=tcp",
        username: "e3ad760fe887d9e08a94e18f",
        credential: "S4dcWSoVsJ/CSU1x",
      },
    ],
  };

  constructor(peerId: string) {
    if (!peerId) {
      this.ownConn = new Peer({
        config: this.iceConfig,
        debug: 3,
      })
    }
    else {
      this.ownConn = new Peer(peerId, {
        config: this.iceConfig,
        debug: 3,
      });
    }
  }
}
