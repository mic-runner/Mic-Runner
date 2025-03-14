import { QueueParticipant } from "../model/queueParticipant";
import { IPresenterService, PresenterConnection } from "../model/presenterConnection";
import { DataConnection } from "peerjs";
import { MessageToPresenter } from "../model/messageToPresenter";
import { MessageToParticipant } from "../model/messageToParticipant";

export interface IPresenterView {
  updateCurrentParticipant: (currentParticipant: QueueParticipant | null) => void;
  updateParticipants: (participants: QueueParticipant[]) => void;
}

class PresenterService {
  
  private view: IPresenterView;
  private presenterConnection: PresenterConnection | null = null;
  private currentParticipant: QueueParticipant | null = null;
  private participantQueue: QueueParticipant[] = [];

  constructor(view: IPresenterView) {
    this.view = view;
  }

  public connectPresenter(roomId: string) {
    const presenterService: IPresenterService = {
      connectionOpened: this.participantJoined.bind(this),
      messageReceived: this.participantMessage.bind(this),
      connectionClosed: this.participantLeft.bind(this),
      connectionError: this.participantError.bind(this),
    };

    this.presenterConnection = new PresenterConnection(roomId, presenterService);
  }


  // ------ CONNECTION METHODS -------

  public participantJoined(conn: DataConnection) {
    console.log(`Participant ${conn.peer} connected`);
    this.presenterConnection?.addConnection(conn);
  }

  public participantMessage(peerId: string, message: MessageToPresenter) {
    console.log(`Received from participant: ${peerId}, message: ${message}`);

    const participant: QueueParticipant = {
      id: peerId,
      name: message.username,
      comment: message.comment,
      speaking: false,
    };

    this.participantQueue.push(participant);
    this.view.updateParticipants([...this.participantQueue]);

    // Notify the participant of their position in the queue
    this.notifyParticipantOfPosition(peerId, this.participantQueue.length - 1);
  }

  public participantLeft(peerId: string) {
    console.log(`Participant ${peerId} disconnected`);

    // Get the index of the participant before removing them
    const participantIndex = this.participantQueue.findIndex(p => p.id === peerId);

    // Remove participant from list
    this.participantQueue = this.participantQueue.filter(p => p.id !== peerId);

    // Also clear current if they were speaking
    if (this.currentParticipant?.id === peerId) {
      this.currentParticipant = null;
      this.view.updateCurrentParticipant(null);
    }

    this.view.updateParticipants([...this.participantQueue]);

    // Notify participants after the removed participant of their new positions
    if (participantIndex !== -1) {
      this.updatePositionsAfterIndex(participantIndex);
    }
  }

  public participantError(peerId: string, err: any) {
    console.error(`Connection error with participant ${peerId}, error: ${err}`);
  }


  // ------ QUEUE METHODS -------

  public nextParticipant() {

    // Notify the current participant they've been removed
    if (this.currentParticipant){
      this.notifyParticipantRemoved(this.currentParticipant.id);
    }

    if (this.participantQueue.length > 0) {

      // Get the next participant
      const nextParticipant = this.participantQueue.shift()!;
      this.currentParticipant = { ...nextParticipant, speaking: true };
      this.view.updateCurrentParticipant(this.currentParticipant);
      this.notifyParticipantOfPosition(nextParticipant.id, -1);

        // Update the positions of remaining participants
      this.view.updateParticipants([...this.participantQueue]);
      this.updatePositionsAfterIndex(0);
    } else {
      this.currentParticipant = null;
      this.view.updateCurrentParticipant(null);
    }

  }

  public toggleMute() {
    if (this.currentParticipant) {
      this.currentParticipant.speaking = !this.currentParticipant.speaking;
      this.view.updateCurrentParticipant({ ...this.currentParticipant });
    }
  }

  public reorderParticipants(fromIndex: number, toIndex: number) {
    const updatedParticipants = [...this.participantQueue];
    const [item] = updatedParticipants.splice(fromIndex, 1);
    updatedParticipants.splice(toIndex, 0, item);
    
    // Store the participant ID to notify them of their new position
    const movedParticipantId = item.id;
    
    // Update the queue
    this.participantQueue = updatedParticipants;
    this.view.updateParticipants([...this.participantQueue]);
    
    // Notify the moved participant of their new position
    this.notifyParticipantOfPosition(movedParticipantId, toIndex);
    
    // Calculate the range of positions that need to be updated
    const startIndex = Math.min(fromIndex, toIndex);
    const endIndex = Math.max(fromIndex, toIndex);
    
    // Update positions for all affected participants
    for (let i = startIndex; i <= endIndex; i++) {
      const participant = this.participantQueue[i];
      if (participant.id !== movedParticipantId) {
        this.notifyParticipantOfPosition(participant.id, i);
      }
    }
  }

  public deleteParticipant(participantId: string) {
    // Find the participant's index before removing
    const participantIndex = this.participantQueue.findIndex(p => p.id === participantId);
    
    if (participantIndex !== -1) {
      // Notify the participant they've been removed
      this.notifyParticipantRemoved(participantId);
      
      // Remove the participant
      this.participantQueue = this.participantQueue.filter(p => p.id !== participantId);
      this.view.updateParticipants([...this.participantQueue]);
      
      // Update positions for participants after the removed one
      this.updatePositionsAfterIndex(participantIndex);
    }
  }

  // ------ HELPER METHODS -------

  private updatePositionsAfterIndex(startIndex: number) {
    // Update positions for all participants after the given index
    for (let i = startIndex; i < this.participantQueue.length; i++) {
      const participant = this.participantQueue[i];
      this.notifyParticipantOfPosition(participant.id, i);
    }
  }

  private notifyParticipantOfPosition(participantId: string, position: number) {
    const messageToParticipant: MessageToParticipant = {
      linePos: position + 1,
    };
    
    this.presenterConnection?.sendMessageToParticipant(participantId, messageToParticipant);
  }

  private notifyParticipantRemoved(participantId: string) {
    const messageToParticipant: MessageToParticipant = {
      connectionInfo: "You have been removed from the queue."
    };
    
    this.presenterConnection?.sendMessageToParticipant(participantId, messageToParticipant);
  }

  
}

export default PresenterService;