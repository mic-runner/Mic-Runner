import { DataConnection } from "peerjs";
import { Connection } from "./connection";
import { MessageToPresenter } from "./messageToPresenter.ts";
import { MessageToParticipant } from "./messageToParticipant.ts";


export interface IParticipantService {
  messageReceived: (message: MessageToParticipant) => void;
}

export class ParticipantConnection extends Connection {
  private participantService: IParticipantService;
  private presenterConn: DataConnection = null!;
  private roomId: string;
  private queuedMessages: MessageToPresenter[] = [];

  constructor(userId: string, roomId: string, participantService: IParticipantService) {
    super(userId);
    this.roomId = roomId;
    this.participantService = participantService;

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
      console.log(`Received from presenter:`, body);
      this.participantService.messageReceived(body as MessageToParticipant);
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

  public sendMessage(comment: MessageToPresenter) {
    if (this.presenterConn && this.presenterConn.open) {
      console.log("Sending data immediately");
      this.presenterConn.send(comment);
    } else {
      console.log("Connection not yet open; queuing message");
      this.queuedMessages.push(comment);
    }
  }

  public closeConnection() {
    this.presenterConn.close();
  }

}
