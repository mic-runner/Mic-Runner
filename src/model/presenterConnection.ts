import { DataConnection } from "peerjs";
import { Connection } from "./connection";
import { Message } from "./message";

export class PresenterConnection extends Connection {
  private allconnections: Set<DataConnection>;
  private connectionQueue: DataConnection[];

  constructor(roomId: string) {
    super(roomId);

    this.peer.on("open", () => {
      console.log("Opened peer");
    })

    this.allconnections = new Set<DataConnection>();
    this.connectionQueue = [];

    this.setupPeerEvents();
  }

  private setupPeerEvents() {
    this.peer.on("connection", (conn) => {
      console.log(`Participant ${conn.peer} connected`);
      this.allconnections.add(conn);

      conn.on("open", () => {
        console.log(`Participant ${conn.peer} connected`);
      });

      conn.on("data", (body: any) => {
        const data = body as Message;
        console.log(`Received from participant ${conn.peer}: ${data}`);
        console.log(data);
        if (data.comment) {
          console.log(`Comment: ${data.comment}`);
          this.connectionQueue.push(conn);
          console.log("Queue after adding connection", conn, this.connectionQueue);

          this.sendLinePositions();
        }
      });

      conn.on("close", () => {
        console.log(`Participant ${conn.peer} disconnected`);
        this.allconnections.delete(conn);
        this.connectionQueue = this.connectionQueue.filter((c) => c !== conn);
      });

      conn.on("error", (err) => {
        console.error(`Connection error with participant ${conn.peer}`, err);
      });
    });
  }

  sendLinePositions() {
    this.connectionQueue.forEach((conn, linePos) => {
      console.log("Sending position to peer", conn.peer);
      console.log({
        type: "linePos",
        linePos,
      });
      console.log("Connection open?", conn.open);
      conn.send({
        type: "linePos",
        linePos,
      });
    });
  }

  public nextParticipant() {
    this.connectionQueue.shift();
    this.sendLinePositions();
  }
}
