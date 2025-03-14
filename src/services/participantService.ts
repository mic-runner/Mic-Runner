import { MessageToPresenter } from "../model/messageToPresenter";
import { ParticipantConnection } from "../model/participantConnection";

class ParticipantService {
  private conn: ParticipantConnection | null = null;

  public connectParticipant(roomId: string, changeLinePos: (i: number) => void) {
    this.conn = new ParticipantConnection("", roomId, changeLinePos);
  }

  public sendComment(comment: string, username: string) {
    if (!this.conn) {
      throw new Error("Connection not established");
    }

    const message: MessageToPresenter = {
      comment: comment,
      username: username,
    }

    this.conn.sendComment(message);
  }
}

export default ParticipantService;
