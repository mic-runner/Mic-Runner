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

  private allconnections: Map<string, DataConnection> = new Map();

  constructor(roomId: string, presenterService: IPresenterService) {
    super(roomId);
    this.presenterService = presenterService;

    this.setupPeerEvents();
  }

  private setupPeerEvents() {
    this.peer.on("connection", (conn) => {

      conn.on("open", () => {
        this.presenterService.connectionOpened(conn);
      });

      conn.on("data", (body: any) => {
        this.presenterService.messageReceived(conn.peer, body as MessageToPresenter);
      });

      conn.on("close", () => {
        this.presenterService.connectionClosed(conn.peer);
      });

      conn.on("error", (err) => {
        this.presenterService.connectionError(conn.peer, err);
      });
    });
  }


  public addConnection(conn: DataConnection) {
    this.allconnections.set(conn.peer, conn);
  }

  public deleteConnection(peerId: string) {
    this.allconnections.delete(peerId);
  }

  public sendMessageToParticipant(peerId: string, message: MessageToParticipant) {
    const conn = this.allconnections.get(peerId);
    if (!conn) {
      console.error("Connection not found");
      return;
    }
    
    conn.send(message);
  }
  


}
