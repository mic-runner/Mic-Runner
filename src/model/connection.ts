import Peer from "peerjs";

export abstract class Connection {
  protected peer: Peer;

  private iceConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }, // Primary STUN
      {
        urls: "turn:openrelay.metered.ca:443", // Primary TURN
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
  };

  constructor(peerId: string) {
    if (!peerId) {
      this.peer = new Peer({
        config: this.iceConfig,
        debug: 3,
      })
    }
    else {
      this.peer = new Peer(peerId, {
        config: this.iceConfig,
        debug: 3,
      });
    }
  }
}
