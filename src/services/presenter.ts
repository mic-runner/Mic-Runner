import { PresenterConnection } from "../model/presenterConnection";

class PresenterService {
  private conn: PresenterConnection | null = null;

  public connectPresenter(roomId: string) {
    this.conn = new PresenterConnection(roomId);
  }

  public sendLinePositions() {
    if (!this.conn) {
      throw new Error("Presenter not connected");
    }
    this.conn.sendLinePositions();
  }
}

export default new PresenterService();
