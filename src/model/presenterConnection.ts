import { DataConnection } from "peerjs";
import { Connection } from "./connection";

export class PresenterConnection extends Connection {
  private connections: DataConnection[] = [];

  constructor(roomId: string) {
    super(roomId);

    this.setupPeerEvents();
  }

  private setupPeerEvents() {
    this.peer.on("connection", (conn) => {
      console.log(`Participant ${conn.peer} connected`);
      this.connections.push(conn);

      conn.on("open", () => {
        console.log(`Participant ${conn.peer} connected`);
      });

      conn.on("data", (data) => {
        console.log(`Received from participant ${conn.peer}: ${data}`);
      });

      conn.on("close", () => {
        console.log(`Participant ${conn.peer} disconnected`);
        this.connections = this.connections.filter((c) => c !== conn);
      });

      conn.on("error", (err) => {
        console.error(`Connection error with participant ${conn.peer}`, err);
      });
    });
  }
}
