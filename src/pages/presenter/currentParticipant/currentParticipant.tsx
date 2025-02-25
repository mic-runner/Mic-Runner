import "./currentParticipant.css";

interface Participant {
  id: number;
  name: string;
  comment: string;
  speaking?: boolean;
}

interface CurrentParticipantProps {
  participant: Participant | null;
  onMute: () => void;
  onNext: () => void;
  hasNextParticipant: boolean;
}

const CurrentParticipant = ({ participant, onMute, onNext, hasNextParticipant }: CurrentParticipantProps) => {
  return (
    <div className="current-participant-container">
      <div className="participant-comment-section">
        {participant?.comment ? <p>Participant Comment: {participant.comment}</p> : <p>&nbsp;</p>}
      </div>
      <div className="current-speaker-box">
        <div className="microphone-icon">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" fill="#f1f1f1"/>
            <path d="M7 12C7 12 7 14 12 14C17 14 17 12 17 12" stroke="#f1f1f1" strokeWidth="2"/>
            <path d="M12 17V20" stroke="#f1f1f1" strokeWidth="2"/>
            <path d="M8 20H16" stroke="#f1f1f1" strokeWidth="2"/>
          </svg>
        </div>
        <div className="speaker-info">
          <div className="speaker-name">{participant ? participant.name : "No current user"}</div>
          {participant && (
            <div className="speaker-status">
              {participant.speaking ? "Currently Speaking" : "Muted"}
            </div>
          )}
        </div>
      </div>
      <div className="speaker-controls">
        <button 
          className="control-button mute-button"
          onClick={onMute}
          disabled={!participant}
        >
          {participant && participant.speaking ? "Mute" : "Unmute"}
        </button>
        <button 
          className="control-button next-button"
          onClick={onNext}
          disabled={!hasNextParticipant}
        >
          Next Participant
        </button>
      </div>
    </div>
  );
}

export default CurrentParticipant;