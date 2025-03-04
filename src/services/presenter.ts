import { PresenterConnection } from "../model/presenterConnection";

class PresenterService {
  private conn: PresenterConnection | null = null;

  public connectPresenter(roomId: string) {
    if (this.conn) {
      return;
    }
    this.conn = new PresenterConnection(roomId);
  }

  public sendLinePositions() {
    if (!this.conn) {
      throw new Error("Presenter not connected");
    }
    this.conn.sendLinePositions();
  }
}

export default PresenterService;
