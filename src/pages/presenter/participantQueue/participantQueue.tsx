import "./participantQueue.css";

interface Participant {
  id: number;
  name: string;
  comment: string;
  speaking?: boolean;
}

interface ParticipantListProps {
  participants: Participant[];
}

const ParticipantList = ({ participants = [] }: ParticipantListProps) => {
  return (
    <div className="next-up-section">
      <h2 className="section-title">NEXT UP</h2>
      <div className="participants-list">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <div key={participant.id} className="participant-item">
              <div className="participant-name">{participant.name}</div>
              {participant.comment && (
                <div className="participant-comment">{participant.comment}</div>
              )}
            </div>
          ))
        ) : (
          <div className="no-participants">No participants in queue</div>
        )}
      </div>
    </div>
  );
}

export default ParticipantList;