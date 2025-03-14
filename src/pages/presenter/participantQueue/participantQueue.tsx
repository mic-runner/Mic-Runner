import { QueueParticipant } from "../../../model/queueParticipant";
import "./participantQueue.css";
import { useState, useRef } from "react";

interface ParticipantListProps {
  participants: QueueParticipant[];
  currentParticipant: QueueParticipant | null;
  onMute: () => void;
  onNext: () => void;
  hasNextParticipant: boolean;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDelete: (participantId: string) => void;
}

const ParticipantList = ({ 
  participants = [], 
  currentParticipant,
  onMute,
  onNext,
  hasNextParticipant,
  onReorder,
  onDelete
}: ParticipantListProps) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    // Store a reference to the node being dragged
    dragNodeRef.current = e.currentTarget;
    
    // Add styling to the dragged item
    e.currentTarget.classList.add("dragging");
    
    // Set the data being dragged (required for Firefox)
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
    
    // Highlight the dragged item
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    
    // Exit if we're dragging over the same item or we don't have a dragged item
    if (draggedItemIndex === null || draggedItemIndex === index) {
      setTargetIndex(null);
      return;
    }

    setTargetIndex(index);
  };

  const handleDragEnd = () => {
    // Clean up drag state
    if (dragNodeRef.current) {
      dragNodeRef.current.classList.remove("dragging");
      dragNodeRef.current = null;
    }
    
    // If we have both a source and target, reorder
    if (draggedItemIndex !== null && targetIndex !== null && draggedItemIndex !== targetIndex) {
      onReorder(draggedItemIndex, targetIndex);
    }
    
    // Reset drag state
    setDraggedItemIndex(null);
    setTargetIndex(null);
  };

  return (
    <div className="participant-queue-container">
      <div className="queue-header">
        <h2 className="section-title">PARTICIPANTS</h2>
        <div className="speaker-controls">
          <button 
            className="control-button mute-button"
            onClick={onMute}
            disabled={!currentParticipant}
          >
            {currentParticipant && currentParticipant.speaking ? "Mute" : "Unmute"}
          </button>
          <button 
            className="control-button next-button"
            onClick={onNext}
            disabled={!hasNextParticipant}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Current Speaker - Fixed outside of the scrollable area */}
      {currentParticipant && (
        <div className="current-speaker-wrapper">
          <div className="participant-item active">
            <div className="participant-status">
              <div className="mic-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" fill={currentParticipant.speaking ? "#E68888" : "#777777"}/>
                  <path d="M7 12C7 12 7 14 12 14C17 14 17 12 17 12" stroke={currentParticipant.speaking ? "#E68888" : "#777777"} strokeWidth="2"/>
                  <path d="M12 17V20" stroke={currentParticipant.speaking ? "#E68888" : "#777777"} strokeWidth="2"/>
                  <path d="M8 20H16" stroke={currentParticipant.speaking ? "#E68888" : "#777777"} strokeWidth="2"/>
                </svg>
              </div>
              <span className="speaking-status">
                {currentParticipant.speaking ? "Speaking" : "Muted"}
              </span>
            </div>
            <div className="participant-name">{currentParticipant.name}</div>
            {currentParticipant.comment && (
              <div className="participant-comment">{currentParticipant.comment}</div>
            )}
          </div>
        </div>
      )}
      
      {/* Scrollable queue section */}
      <div className="queue-scrollable-section">
        {/* Next Up Label */}
        {participants.length > 0 && (
          <div className="next-up-label">
            NEXT UP
          </div>
        )}
        
        {/* Queue Participants - These will be in the scrollable area */}
        <div className="participants-list">
          {participants.length > 0 ? (
            participants.map((participant, index) => (
              <div 
                key={participant.id} 
                className={`participant-item queue-item ${draggedItemIndex === index ? 'dragging' : ''} ${targetIndex === index ? 'drop-target' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="participant-item-content">
                  <div className="participant-name">{participant.name}</div>
                  {participant.comment && (
                    <div className="participant-comment">{participant.comment}</div>
                  )}
                </div>
                <button 
                  className="delete-button" 
                  onClick={() => onDelete(participant.id)}
                  aria-label="Delete participant"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#E68888"/>
                  </svg>
                </button>
                <div className="drag-handle" title="Drag to reorder">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10H17" stroke="#E68888" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7 14H17" stroke="#E68888" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            ))
          ) : !currentParticipant && (
            <div className="no-participants">No participants in queue</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParticipantList;