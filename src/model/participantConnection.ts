import { DataConnection } from "peerjs";
import { Connection } from "./connection";
import { Message } from "./message";

export class ParticipantConnection extends Connection {
  private conn: DataConnection;
  private peerID: string;
  private changePos: (i: number) => void;

  constructor(userId: string, roomId: string, changeLinePos: (i: number) => void) {
    super(userId);
    this.peer.on('error', (err) => {
      console.error("Connection error", err);
      console.error("Trying to connect");
      this.peer.connect(this.peerID);
    })
    this.conn = this.peer.connect(roomId);
    console.log("Connected to ", this.conn.peer);
    this.setupConnectionEvents(changeLinePos);
    this.changePos = changeLinePos;
    this.peerID = roomId;
  }

  private setupConnectionEvents(updateLinePos: (i: number) => void) {
    if (!this.conn.open) {
      return
    }

    this.conn.on("open", () => {
      console.log("Connection with presenter opened", this.conn.peer);
    });

    this.conn.on("data", (body: any) => {
      const data = body as Message;
      console.log(`Received from presenter: ${data}\n`);
      if (data.linePos) {
        updateLinePos(data.linePos);
      } else if (data.comment) {
        console.log(`Comment: ${data.comment}`);
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

  public sendComment(comment: string) {
    if (this.conn.open) {
      this.conn.send({ type: "comment", comment });
    }
    else {
      console.log("Connection not open");
      this.reconnect()
      setTimeout(() => {
        this.sendComment(comment);
      }, 5000)
      return
    }
  }
}
