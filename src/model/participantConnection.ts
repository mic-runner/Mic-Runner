import { DataConnection } from "peerjs";
import { Connection } from "./connection";
import { MessageToPresenter } from "./messageToPresenter.ts";
import { MessageToParticipant } from "./messageToParticipant.ts";

export class ParticipantConnection extends Connection {
  private presenterConn: DataConnection = null!;
  private roomId: string;
  private changePos: (i: number) => void;
  private queuedMessages: MessageToPresenter[] = [];

  constructor(userId: string, roomId: string, changeLinePos: (i: number) => void) {
    super(userId);
    this.changePos = changeLinePos;
    this.roomId = roomId;

    this.setUpOwnConnectionEvents();
  }

  // SET UP EVENTS INVOLVING OUR OWN CONNECTION, SETTING UP PARTICIPANT
  private setUpOwnConnectionEvents() {

    // Own connection established
    this.ownConn.on('open', (myPeerId) => {
      console.log(`My peer ID is ${myPeerId}. Now connecting to ${this.roomId}`);

      this.presenterConn = this.ownConn.connect(this.roomId);
      this.setupPresenterConnectionEvents();
    });

    // Own connection closed
    this.ownConn.on('close', () => {
      console.log("Peer closed");
    });

     // Error with own connection
     this.ownConn.on('error', (err) => {
      console.error("Peer error:", err);
    });

  }

   // SET UP EVENTS INVOLVING CONNECTION WITH PRESENTER
  private setupPresenterConnectionEvents() {

    // Connection with presenter established
    this.presenterConn.on("open", () => {
      console.log("Data connection opened with presenter.");

      while (this.queuedMessages.length > 0) {
        const msg = this.queuedMessages.shift();
        if (msg) this.presenterConn.send(msg);
      }
    });

    // Received data from presenter
    this.presenterConn.on("data", (body: any) => {
      const data = body as MessageToParticipant;
      console.log(`Received from presenter:`, data);

      if (data.linePos !== undefined && data.linePos !== null) {
        this.changePos(data.linePos);
      } else if (data.connectionInfo) {
        console.log(`Info from presenter: ${data.connectionInfo}`);
      }
    });

    // Connection with presenter closed
    this.presenterConn.on("close", () => {
      console.warn("Data connection closed.");
    });

    // Error with connection to presenter
    // - error / retry handling can be added here if needed
    this.presenterConn.on("error", (err) => {
      console.error("Data connection error:", err);
    });

  }

  public sendComment(comment: MessageToPresenter){
    if (this.presenterConn && this.presenterConn.open) {
      console.log("Sending data immediately");
      this.presenterConn.send(comment);
    } else {
      console.log("Connection not yet open; queuing message");
      this.queuedMessages.push(comment);
    }
  }
}
