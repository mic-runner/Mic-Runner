import { DataConnection } from "peerjs";
import { Connection } from "./connection";
import { MessageToPresenter } from "./messageToPresenter";
import { MessageToParticipant } from "./messageToParticipant";


export interface IPresenterService {
  connectionOpened: (conn: DataConnection) => void;
  messageReceived: (peerId: string, message: MessageToPresenter) => void;
  connectionClosed: (peerId: string) => void;
  connectionError: (peerId: string, err: any) => void;
}


export class PresenterConnection extends Connection {

  private presenterService: IPresenterService;

  private participantConnections: Map<string, DataConnection> = new Map();

  constructor(roomId: string, presenterService: IPresenterService) {
    super(roomId);
    this.presenterService = presenterService;

    this.setUpOwnConnectionEvents();
  }

  // SET UP EVENTS INVOLVING OUR OWN CONNECTION, SETTING UP PRESENTER
  private setUpOwnConnectionEvents() {

    this.ownConn.on('open', (myPeerId) => {
      console.log(`My peer ID is ${myPeerId}.`);
      this.setupParticipantConnectionEvents();
    });
  }

  // SET UP EVENTS INVOLVING INCOMING PARTICIPANT CONNECTIONS
  private setupParticipantConnectionEvents() {

    // When a participant connects
    this.ownConn.on("connection", (participantConn) => {
      console.log("START OF CONNECTION", participantConn.peer);

      // Connection with participant established
      participantConn.on("open", () => {
        this.presenterService.connectionOpened(participantConn);
      });

      // Received data from participant
      participantConn.on("data", (body: any) => {
        this.presenterService.messageReceived(participantConn.peer, body as MessageToPresenter);
      });

      // Participant connection closed
      participantConn.on("close", () => {
        this.presenterService.connectionClosed(participantConn.peer);
      });

      // Error with participant connection
      participantConn.on("error", (err) => {
        this.presenterService.connectionError(participantConn.peer, err);
      });
    });
  }


  public addConnection(conn: DataConnection) {
    this.participantConnections.set(conn.peer, conn);
  }

  public deleteConnection(peerId: string) {
    const conn = this.participantConnections.get(peerId);

    // TODO do we want to delete the connection?
    if (conn) {
      conn.close();
      this.participantConnections.delete(peerId);
    }
  }

  public sendMessageToParticipant(peerId: string, message: MessageToParticipant) {
    const conn = this.participantConnections.get(peerId);
    if (!conn) {
      console.error("Connection not found");
      return;
    }

    conn.send(message);
  }
  


}
