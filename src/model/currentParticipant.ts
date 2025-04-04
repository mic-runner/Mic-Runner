import { QueueParticipant } from "./queueParticipant";

export class CurrentParticipant {
  private _participant: QueueParticipant | null = null;
  public muted = true;
  public daAudio: HTMLAudioElement = document.createElement("audio");

  // Optional copy constructor
  // Used because React state changes only work when you create a new object
  // Note to self: Don't use classes for React Frontend in Future, only use Interfaces
  constructor(other?: CurrentParticipant) {
    if (other) {
      this._participant = other.participant;
      this.muted = other.muted;
      this.daAudio = other.daAudio;
    }
  }

  public get participant(): QueueParticipant | null {
    return this._participant;
  }

  public setParticipant(participant: QueueParticipant | null) {
    this._participant = participant;
    this.resetAudio();
  }

  public toggleMute() {
    this.muted = !this.muted;

    if (this.daAudio.srcObject === null) {
      return;
    }

    this.playAudio();
  }

  public setAudio(stream: MediaStream) {
    this.daAudio.srcObject = stream;
    this.playAudio();
  }

  private playAudio() {
    if (this.muted) {
      this.daAudio.pause();
    } else {
      this.daAudio.play();
    }
  }


  private resetAudio() {
    this.daAudio.pause();
    this.daAudio.srcObject = null;
    this.daAudio.load();
    this.muted = false;
  }
}