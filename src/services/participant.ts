import { ParticipantConnection } from "../model/participantConnection";

class ParticipantService {
  private conn: ParticipantConnection | null = null;

  public connectParticipant(userId: string, roomId: string, changeLinePos: (i: number) => void) {
    this.conn = new ParticipantConnection(userId, roomId, changeLinePos);
  }

  public sendComment(comment: string) {
    if (!this.conn) {
      throw new Error("Connection not established");
    }
    this.conn.sendComment(comment);
  }
}

export default new ParticipantService();
