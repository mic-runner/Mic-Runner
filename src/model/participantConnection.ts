import { DataConnection } from "peerjs";
import { Connection } from "./connection";

export class participantConnection extends Connection {
  // private conn: DataConnection;

  constructor(userId: string, presenterId: string, comment: string) {
    super(userId);

    const conn = this.peer.connect(presenterId);

    this.setupConnectionEvents(conn);

    conn.send(comment);
  }

  private setupConnectionEvents(conn: DataConnection) {
    conn.on("open", () => {
      console.log("Connection with presenter opened");
    });

    conn.on("data", (data) => {
      console.log(`Received from presenter: ${data}\n`);
    });

    conn.on("error", (err) => {
      console.error("Connection error", err);
    });
  }
}
