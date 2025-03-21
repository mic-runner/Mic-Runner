import { QueueParticipant } from "../model/queueParticipant";
import { IPresenterService, PresenterConnection } from "../model/presenterConnection";
import { DataConnection, MediaConnection } from "peerjs";
import { MessageToPresenter } from "../model/messageToPresenter";
import { MessageToParticipant } from "../model/messageToParticipant";
import { LinePositionValues } from '../utils/sharedConsts';
import { CurrentParticipant } from "../model/currentParticipant";

export interface IPresenterView {
  updateCurrentParticipant: (currentParticipant: CurrentParticipant) => void;
  updateParticipants: (participants: QueueParticipant[]) => void;
}

class PresenterService {
  
  private view: IPresenterView;
  private presenterConnection: PresenterConnection | null = null;
  private currentParticipant: CurrentParticipant = new CurrentParticipant();
  private participantQueue: QueueParticipant[] = [];


  constructor(view: IPresenterView) {
    this.view = view;

    this.bindCallBackMethods();
  }

  // Any methods that use 'this' and are used in callbacks must have the this context bound in constructor
  // Js is so wack man
  private bindCallBackMethods() {
    this.handleConnection = this.handleConnection.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleConnectionClose = this.handleConnectionClose.bind(this);
    this.handleConnectionError = this.handleConnectionError.bind(this);

    this.handleCall = this.handleCall.bind(this);
    this.handleCallStream = this.handleCallStream.bind(this);
    this.handleCallClose = this.handleCallClose.bind(this);
    this.handleCallError = this.handleCallError.bind(this);

    this.reorderParticipants = this.reorderParticipants.bind(this);
    this.nextParticipant = this.nextParticipant.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.deleteParticipant = this.deleteParticipant.bind(this);
  }


  public connectPresenter(roomId: string) {
    const presenterService: IPresenterService = {
      onConnection: this.handleConnection,
      onMessage: this.handleMessage,
      onConnectionClose: this.handleConnectionClose,
      onConnectionError: this.handleConnectionError,

      onCall: this.handleCall,
      onCallStream: this.handleCallStream,
      onCallClose: this.handleCallClose,
      onCallError: this.handleCallError,
    };

    this.presenterConnection = new PresenterConnection(roomId, presenterService);
  }



  // ------ CONNECTION METHODS -------

  public handleConnection(conn: DataConnection) {
    console.log(`Participant ${conn.peer} connected`);
    this.presenterConnection?.addConnection(conn);
  }

  public handleMessage(participantId: string, message: MessageToPresenter) {
    console.log(`Received from participant: ${participantId}, message: ${message}`);

    if (message.removeFromQueue) {
      this.handleConnectionClose(participantId);
    }
    else {
      this.addToQueue(participantId, message);
    }
  }

  private addToQueue(participantId: string, message: MessageToPresenter) {
      const participant: QueueParticipant = {
        id: participantId,
        name: message.username!,
        comment: message.comment!,
    };

    this.participantQueue.push(participant);
    this.updateParticipantsForFrontend(this.participantQueue);

    // Notify the participant of their position in the queue
    this.notifyParticipantOfPosition(participantId, this.participantQueue.length - 1);
  }


  public handleConnectionClose(participantId: string) {
    this.removeParticipant(participantId);
    this.presenterConnection?.deleteConnection(participantId);
    this.presenterConnection?.deleteCall(participantId);
  }


  public handleConnectionError(participantId: string, err: any) {
    console.error(`Connection error with participant ${participantId}, error: ${err}`);
  }





  // ------ CALL METHODS -------

  public handleCall(participantId: string, call: MediaConnection) {
    if (this.currentParticipant.participant?.id !== participantId) {
      this.presenterConnection?.closeCall(call);
      return;
    }

    this.presenterConnection?.addCall(participantId, call);
  }

  public handleCallStream(remoteStream: MediaStream) {
    console.log("CALL STREAM IN DA SERVICE");
    this.currentParticipant.setAudio(remoteStream);
    this.updateCurrentParticipantForFrontend(this.currentParticipant);
  }

  public handleCallClose(participantId: string) {
    this.presenterConnection?.deleteCall(participantId);
  }

  public handleCallError(participantId: string, err: any) {
    console.error(`Call error with participant ${participantId}, error: ${err}`);
  }









  // ------ QUEUE MANAGEMENT METHODS -------

  public nextParticipant() {

    // Notify the current participant they've been removed
    if (this.currentParticipant.participant) {
      this.notifyParticipantRemoved(this.currentParticipant.participant.id);
    }

    if (this.participantQueue.length > 0) {

      // Get the next participant
      const nextParticipant = this.participantQueue.shift()!;
      this.currentParticipant.setParticipant(nextParticipant);
      this.updateCurrentParticipantForFrontend(this.currentParticipant);
      this.notifyCurrentParticipantMuted();
      this.notifyParticipantOfPosition(this.currentParticipant.participant!.id, -1);

        // Update the positions of remaining participants
      this.updateParticipantsForFrontend(this.participantQueue);
      this.updatePositionsAfterIndex(0);
    } else {
      this.currentParticipant.setParticipant(null);
      this.updateCurrentParticipantForFrontend(this.currentParticipant);
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
    this.updateParticipantsForFrontend(this.participantQueue);
    
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

  // - remove them from the queue, but do not delete their connection
  public deleteParticipant(participantId: string) {
    this.removeParticipant(participantId);
    this.notifyParticipantRemoved(participantId);
    this.presenterConnection?.deleteCall(participantId);
  }

  public toggleMute() {
    if (!this.currentParticipant.participant) return;

    this.currentParticipant.toggleMute();
    this.updateCurrentParticipantForFrontend(this.currentParticipant);

    this.notifyCurrentParticipantMuted();
  }





  // ------ HELPER METHODS -------

  
  public removeParticipant(participantId: string) {

    // Get the index of the participant before removing them
    const participantIndex = this.participantQueue.findIndex(p => p.id === participantId);

    // Remove participant from list
    this.participantQueue = this.participantQueue.filter(p => p.id !== participantId);

    // Also clear current if they were speaking
    if (this.currentParticipant.participant?.id === participantId) {
      this.currentParticipant.setParticipant(null);
      this.updateCurrentParticipantForFrontend(this.currentParticipant);
    }

    this.updateParticipantsForFrontend(this.participantQueue);

    // Notify participants after the removed participant of their new positions
    if (participantIndex !== -1) {
      this.updatePositionsAfterIndex(participantIndex);
    }
  }


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

  private notifyCurrentParticipantMuted() {

    const messageToParticipant: MessageToParticipant = {
      muted: this.currentParticipant.muted,
    };
    
    this.presenterConnection?.sendMessageToParticipant(this.currentParticipant.participant!.id, messageToParticipant)
  }

  // NEED TO CREATE ENTIRELY NEW OBJECTS TO ACTUALLY TRIGGER REACT STATE UPDATES
  // note to self: Don't use classes for React Frontend in Future, only use Interfaces. They don't play nice.
  private updateParticipantsForFrontend(participantQueue: QueueParticipant[]) {
    this.view.updateParticipants([...participantQueue]);
  }

  private updateCurrentParticipantForFrontend(currentParticipant: CurrentParticipant) {
    this.view.updateCurrentParticipant(new CurrentParticipant(currentParticipant));
  }
  
}

export default PresenterService;