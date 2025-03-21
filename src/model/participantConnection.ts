import { DataConnection, MediaConnection } from "peerjs";
import { Connection } from "./connection";
import { MessageToPresenter } from "./messageToPresenter.ts";
import { MessageToParticipant } from "./messageToParticipant.ts";


export interface IParticipantService {
  messageReceived: (message: MessageToParticipant) => void;
}

export class ParticipantConnection extends Connection {
  private participantService: IParticipantService;
  private presenterConn: DataConnection = null!;
  private call: MediaConnection | null = null;
  private roomId: string;
  private queuedMessages: MessageToPresenter[] = [];

  private readonly RECONNECT_TIMEOUT = 8000;

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

      this.connectToPresenter();
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

  private connectToPresenter() {
    this.presenterConn = this.ownConn.connect(this.roomId);
    this.setupPresenterConnectionEvents();
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


  public async sendMessage(comment: MessageToPresenter) {
    if (this.presenterConn && this.presenterConn.open) {
      console.log("Sending data immediately");
      this.presenterConn.send(comment);
    } else {
      console.log("Connection not yet open; queuing message");
      this.queuedMessages.push(comment);
    }

    // If connecting is not working, trigger a reconnect
    setTimeout(() => {
      if (!this.presenterConn || !this.presenterConn.open) {
        console.log(`Connection did not open within ${this.RECONNECT_TIMEOUT / 1000} seconds; attempting to reconnect`);
        this.connectToPresenter();
      }
    }, this.RECONNECT_TIMEOUT); 

  }


  public sendAudio(stream: MediaStream | null) {
    if (stream) {
    
      if (!this.call) {
        console.log("Make call yay");
        this.call = this.ownConn.call(this.roomId, stream);

        this.call.on("close", () => {
          console.log("Call ended.");
          this.call = null;
        });
  
        this.call.on("error", (err) => {
          console.error("Call error:", err);
        });
      } else {
        // If the call already exists, just replace the audio track
        const senders = this.call.peerConnection.getSenders();
        const audioSender = senders.find(sender => sender.track?.kind === 'audio');
        if (audioSender) {
          audioSender.replaceTrack(stream.getAudioTracks()[0]);
        }
      }
    } else {
      // If no stream is provided, simply mute the audio
      if (this.call) {
        const senders = this.call.peerConnection.getSenders();
        const audioSender = senders.find(sender => sender.track?.kind === 'audio');
        if (audioSender && audioSender.track) {
          // Disable the track to effectively mute it without closing the connection
          audioSender.track.enabled = false;
        }
      }
    }
  }

  public closeConnection() {
    this.call?.close();
    this.call = null;
    this.presenterConn.close();
  }

}
