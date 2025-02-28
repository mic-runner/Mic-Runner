import { DataConnection } from "peerjs";
import { Connection } from "./connection";
import { Message } from "./message";

export class ParticipantConnection extends Connection {
  private conn: DataConnection;

  constructor(userId: string, roomId: string, changeLinePos: (i: number) => void) {
    super(userId);
    this.conn = this.peer.connect(roomId);
    this.setupConnectionEvents(changeLinePos);
  }

  private setupConnectionEvents(updateLinePos: (i: number) => void) {
    this.conn.on("open", () => {
      console.log("Connection with presenter opened");
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
  }

  public sendComment(comment: string) {
    this.conn.send({ type: "comment", comment });
  }
}
