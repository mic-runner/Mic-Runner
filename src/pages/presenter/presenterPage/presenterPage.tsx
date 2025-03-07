import { useState, useEffect } from "react";
import "./presenterPage.css";
import QRCodeSection from "../qrCode/qrCode";
import ParticipantList from "../participantQueue/participantQueue";
import DataService, { Participant, RoomInfo } from "../../../services/dataService";
import {useLocation, useNavigate} from "react-router-dom";

const PresenterPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setParticipants(DataService.getParticipants());

    if (state) {
        // Keeping the roomInfo object for centralization of updates
        const room: RoomInfo = {
            roomNumber: state.room,
            joinUrl: `${window.location.origin}/participant?room=${state.room}`,
        };

        setRoomInfo(room);
    }
    else {
        // If the host has no room number navigate to the landing page
        navigate("/");
    }
  }, []);

  const nextParticipant = () => {
    if (participants.length > 0) {
      setCurrentParticipant({
        ...participants[0],
        speaking: true
      });
      
      setParticipants(participants.slice(1));
    } else {
      setCurrentParticipant(null);
    }
  };

  const toggleMute = () => {
    if (currentParticipant) {
      setCurrentParticipant({
        ...currentParticipant,
        speaking: !currentParticipant.speaking
      });
    }
  };

  // Handle reordering of participants
  const handleReorderParticipants = (fromIndex: number, toIndex: number) => {
    // Create a copy of the participants array
    const updatedParticipants = [...participants];
    
    // Remove the dragged item
    const [draggedItem] = updatedParticipants.splice(fromIndex, 1);
    
    // Insert it at the new position
    updatedParticipants.splice(toIndex, 0, draggedItem);
    
    // Update state with new order
    setParticipants(updatedParticipants);
  };

  // Handle deleting a participant
  const handleDeleteParticipant = (participantId: number) => {
    setParticipants(participants.filter(p => p.id !== participantId));
  };

  return (
    <div className="presenter-layout"> 
      <div className="inner-presenter-layout">
        
        <div className="presenter-header">
          <h1 className="presenter-title">Mic Runner</h1>
          <p className="room-number">Room {roomInfo?.roomNumber}</p>
        </div>

        <div className="presenter-content">
            <div className="qr-column">
                {roomInfo ? (
                  <QRCodeSection joinUrl={(roomInfo as RoomInfo).joinUrl} />
                ) : (
                  <div className="qr-placeholder">QR CODE PLACEHOLDER</div>
                )}
            </div>

            <div className="participant-column">
              <ParticipantList 
                participants={participants} 
                currentParticipant={currentParticipant}
                onMute={toggleMute}
                onNext={nextParticipant}
                hasNextParticipant={participants.length > 0 || currentParticipant !== null}
                onReorder={handleReorderParticipants}
                onDelete={handleDeleteParticipant}
              />
            </div>
        </div>
      </div>
    </div>
  );
}

export default PresenterPage;