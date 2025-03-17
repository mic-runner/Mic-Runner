import { QueueParticipant } from "../model/queueParticipant";
import { IPresenterService, PresenterConnection } from "../model/presenterConnection";
import { DataConnection } from "peerjs";
import { MessageToPresenter } from "../model/messageToPresenter";
import { MessageToParticipant } from "../model/messageToParticipant";
import { LinePositionValues } from '../utils/sharedConsts';

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

    this.bindCallBackMethods();
  }

  // Any methods that use 'this' and are used in callbacks must have the this context bound in constructor
  // Js is so wack man
  private bindCallBackMethods() {
    this.participantJoined = this.participantJoined.bind(this);
    this.participantMessage = this.participantMessage.bind(this);
    this.participantLeft = this.participantLeft.bind(this);
    this.participantError = this.participantError.bind(this);
    this.reorderParticipants = this.reorderParticipants.bind(this);
    this.nextParticipant = this.nextParticipant.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.deleteParticipant = this.deleteParticipant.bind(this);
  }


  public connectPresenter(roomId: string) {
    const presenterService: IPresenterService = {
      connectionOpened: this.participantJoined,
      messageReceived: this.participantMessage,
      connectionClosed: this.participantLeft,
      connectionError: this.participantError,
    };

    this.presenterConnection = new PresenterConnection(roomId, presenterService);
  }



  // ------ CONNECTION METHODS -------

  public participantJoined(conn: DataConnection) {
    console.log(`Participant ${conn.peer} connected`);
    this.presenterConnection?.addConnection(conn);
  }

  public participantMessage(participantId: string, message: MessageToPresenter) {
    console.log(`Received from participant: ${participantId}, message: ${message}`);

    if (message.removeFromQueue) {
      this.participantLeft(participantId);
    }
    else {
      this.addToQueue(participantId, message);
    }
  }

  private addToQueue(participantId: string, message: MessageToPresenter)
  {
      const participant: QueueParticipant = {
        id: participantId,
        name: message.username!,
        comment: message.comment!,
        speaking: false,
    };

    this.participantQueue.push(participant);
    this.view.updateParticipants([...this.participantQueue]);

    // Notify the participant of their position in the queue
    this.notifyParticipantOfPosition(participantId, this.participantQueue.length - 1);
  }



  public participantLeft(participantId: string) {

    // Get the index of the participant before removing them
    const participantIndex = this.participantQueue.findIndex(p => p.id === participantId);

    // Remove participant from list
    this.participantQueue = this.participantQueue.filter(p => p.id !== participantId);

    // Also clear current if they were speaking
    if (this.currentParticipant?.id === participantId) {
      this.currentParticipant = null;
      this.view.updateCurrentParticipant(null);
    }

    this.view.updateParticipants([...this.participantQueue]);

    // Notify participants after the removed participant of their new positions
    if (participantIndex !== -1) {
      this.updatePositionsAfterIndex(participantIndex);
    }
  }


  public participantError(participantId: string, err: any) {
    console.error(`Connection error with participant ${participantId}, error: ${err}`);
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
    this.participantLeft(participantId);
    this.notifyParticipantRemoved(participantId);
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
      linePos: LinePositionValues.NOT_IN_LINE,
    };
    
    this.presenterConnection?.sendMessageToParticipant(participantId, messageToParticipant);
  }

  
}

export default PresenterService;