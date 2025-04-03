import { DataConnection, MediaConnection } from "peerjs";
import { Connection } from "./connection";
import { MessageToPresenter } from "./messageToPresenter";
import { MessageToParticipant } from "./messageToParticipant";

export interface IPresenterService {
  onConnection: (conn: DataConnection) => void;
  onMessage: (participantId: string, message: MessageToPresenter) => void;
  onConnectionClose: (participantId: string) => void;
  onConnectionError: (participantId: string, err: any) => void;

  onCall: (participantId: string, call: MediaConnection) => void;
  onCallStream: (remoteStream: MediaStream) => void;
  onCallClose: (participantId: string) => void;
  onCallError: (participantId: string, err: any) => void;
}

export class PresenterConnection extends Connection {
  private presenterService: IPresenterService;
  private participantConnections: Map<string, DataConnection> = new Map();
  private participantCalls: Map<string, MediaConnection> = new Map();

  constructor(roomId: string, presenterService: IPresenterService) {
    super(roomId);
    this.presenterService = presenterService;

    this.setUpOwnConnectionEvents();
  }

  // SET UP EVENTS INVOLVING OUR OWN CONNECTION, SETTING UP PRESENTER
  private setUpOwnConnectionEvents() {
    this.ownConn.on("open", (myparticipantId) => {
      console.log(`My peer ID is ${myparticipantId}.`);
      this.setupParticipantConnectionEvents();
      this.setupCallEvents();
    });
  }

  // CONNECTION METHODS
  // SET UP EVENTS INVOLVING INCOMING PARTICIPANT CONNECTIONS
  private setupParticipantConnectionEvents() {
    // When a participant connects
    this.ownConn.on("connection", (participantConn) => {
      console.log("START OF CONNECTION", participantConn.peer);

      // Connection with participant established
      participantConn.on("open", () => {
        this.presenterService.onConnection(participantConn);
      });

      // Received data from participant
      participantConn.on("data", (body: any) => {
        this.presenterService.onMessage(
          participantConn.peer,
          body as MessageToPresenter
        );
      });

      // Participant connection closed
      participantConn.on("close", () => {
        this.presenterService.onConnectionClose(participantConn.peer);
      });

      // Error with participant connection
      participantConn.on("error", (err) => {
        this.presenterService.onConnectionError(participantConn.peer, err);
      });
    });
  }

  public addConnection(conn: DataConnection) {
    this.participantConnections.set(conn.peer, conn);
  }

  public deleteConnection(participantId: string) {
    const conn = this.participantConnections.get(participantId);

    if (conn) {
      conn.close();
      this.participantConnections.delete(participantId);
    }
  }

  public sendMessageToParticipant(
    participantId: string,
    message: MessageToParticipant
  ) {
    const conn = this.participantConnections.get(participantId);
    if (!conn) {
      console.error("Connection not found");
      return;
    }

    conn.send(message);
  }

  // CALL METHODS
  // IS TRIGGERED WHEN A PARTICIPANT CALLS THE PRESENTER / TRIES TO TALK
  private setupCallEvents() {
    this.ownConn.on("call", (call: MediaConnection) => {
      console.log("RECIEVED NEW CALL");
      this.presenterService.onCall(call.peer, call);

      call.on("stream", (remoteStream) => {
        console.log("RECIEVED STREAM");
        this.presenterService.onCallStream(remoteStream);
        this.applyBandpassFilter(remoteStream);
      });

      call.on("close", () => {
        this.presenterService.onCallClose(call.peer);
      });

      call.on("error", (err) => {
        this.presenterService.onCallError(call.peer, err);
      });
    });
  }

  public addCall(participantId: string, call: MediaConnection) {
    call.answer();
    this.participantCalls.set(participantId, call);
  }

  public deleteCall(participantId: string) {
    const call = this.participantCalls.get(participantId);

    if (call) {
      this.closeCall(call);
      this.participantCalls.delete(participantId);
    }
  }

  public closeCall(call: MediaConnection) {
    call.close();
  }

  private applyBandpassFilter(remoteStream: MediaStream) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(remoteStream);

    // Create a bandpass filter
    const filter = audioContext.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 500; // Center frequency (e.g., 1kHz)
    filter.Q.value = 4; // Quality factor (adjust for width of the band)

    source.connect(filter);

     // Connect to the output (speakers)
     const destination = audioContext.destination;
     filter.connect(destination);
  }
}
