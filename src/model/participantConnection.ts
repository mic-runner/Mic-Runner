import { DataConnection } from "peerjs";
import { Connection } from "./connection";
import { MessageToPresenter } from "./messageToPresenter.ts";
import ConnectionError from "../components/connectionError.ts";
import { MessageToParticipant } from "./messageToParticipant.ts";

export class ParticipantConnection extends Connection {
  private conn: DataConnection;
  private peerID: string;
  private changePos: (i: number) => void;
  private waitBeforeTimeout: number = 30; // Number in seconds
  private waitTime = 5000; // Number in milliseconds

  constructor(userId: string, roomId: string, changeLinePos: (i: number) => void) {
    super(userId);
    this.peerID = roomId;
    this.peer.on('error', (err) => {
      console.error("Connection error", err);
      console.error("Trying to connect");
      if (this.waitBeforeTimeout > 0) {
        this.waitBeforeTimeout -= this.waitTime / 1000;
        this.conn = this.peer.connect(this.peerID);
      }
      else {
        console.error("Failed to connect", err);
        throw new ConnectionError("Failed to connect");
      }
    })
    this.conn = this.peer.connect(roomId);
    console.log("Connected to ", this.conn.peer);
    this.setupConnectionEvents(changeLinePos);
    this.changePos = changeLinePos;
  }

  private setupConnectionEvents(updateLinePos: (i: number) => void) {
    this.conn.on("open", () => {
      console.log("Connection with presenter opened", this.conn.peer);
    });

    this.conn.on("data", (body: any) => {
      const data = body as MessageToParticipant;
      console.log(`Received from presenter: ${data}\n`);
      console.log(data);
      if (data.linePos || data.linePos == 0) {
        updateLinePos(data.linePos);
      } else if (data.connectionInfo) {
        console.log(`Comment: ${data.connectionInfo}`);
      }
    });

    this.conn.on("error", (err) => {
      console.error("Connection error", err);
    });

    this.peer.on('open', () => {
      console.log("Peer opened");
    })

    this.peer.on('close', () => {
      console.log("Peer closed");
    })

    this.peer.on('error', (err) => {
      console.error("Connection error", err);
    })
  }

  private reconnect() {
    this.conn = this.peer.connect(this.peerID);
    console.log("Connected to ", this.conn.peer);
    this.setupConnectionEvents(this.changePos);
  }

  public sendComment(comment: MessageToPresenter){
    if (this.conn.open) {
      this.waitBeforeTimeout = 30;
      this.conn.send(comment);
    }
    else {
      console.log("Connection not open");
      this.reconnect()
      if (this.waitBeforeTimeout > 0) {
        setTimeout(() => {
          this.waitBeforeTimeout -= this.waitTime / 1000;
          this.sendComment(comment);
        }, this.waitTime);
      }
      else {
        console.error(`Failed to connect timeout: ${this.waitBeforeTimeout}; time between attempts (ms): ${this.waitTime}`);
        throw new ConnectionError("Failed to reconnect");
      }
    }
  }
}
