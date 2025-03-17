import { MessageToParticipant } from "../model/messageToParticipant";
import { MessageToPresenter } from "../model/messageToPresenter";
import { ParticipantConnection } from "../model/participantConnection";

export interface IParticipantView {
  updatePlaceInLine: (lineNum: number) => void;
}

class ParticipantService {
  private view: IParticipantView;
  private conn: ParticipantConnection | null = null;

  constructor(view: IParticipantView) {
    this.view = view;

    this.bindCallBackMethods();
  }

  private bindCallBackMethods() {
    this.handleReceivedMessage = this.handleReceivedMessage.bind(this);
  }


  public connectParticipant(roomId: string) {
    const participantService = {
      messageReceived: this.handleReceivedMessage,
    }

    this.conn = new ParticipantConnection("", roomId, participantService);
  }

  public sendComment(comment: string, username: string) {
    const message: MessageToPresenter = {
      comment: comment,
      username: username,
    }

    this.conn?.sendMessage(message);
  }

  public removeFromQueue() {
    const message: MessageToPresenter = {
      removeFromQueue: true,
    }

    this.conn?.sendMessage(message);
  }

  public handleReceivedMessage(message: MessageToParticipant) {
    if (message.linePos !== undefined && message.linePos !== null) {
      this.view.updatePlaceInLine(message.linePos);
    }
  }


  public disconnectFromPresenter() {
    this.conn?.closeConnection();
  }

}

export default ParticipantService;
