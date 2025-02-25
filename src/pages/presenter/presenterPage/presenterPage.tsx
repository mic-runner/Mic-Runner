import { useState, useEffect } from "react";
import "./presenterPage.css";
import QRCodeSection from "../qrCode/qrCode";
import ParticipantList from "../participantQueue/participantQueue";
import CurrentParticipant from "../currentParticipant/currentParticipant";
import DataService, { Participant, RoomInfo } from "../../../services/dataService";

const PresenterPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);

  useEffect(() => {
    setParticipants(DataService.getParticipants());
    setRoomInfo(DataService.getRoomInfo());
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

  return (
    <div className="presenter-layout"> 
      <div className="inner-presenter-layout">
        
        <div className="presenter-header">
          <h1 className="presenter-title">Mic Runner</h1>
          <p className="room-number">Room {roomInfo?.roomNumber}</p>
        </div>

        <div className="presenter-content">
            <div className="left-column">
                <div className="top-box">
                  <QRCodeSection joinUrl={roomInfo?.joinUrl} />
                </div>

                <div className="bottom-box">
                  <ParticipantList participants={participants} />
                </div>
            </div>

            <div className="right-column">
              <CurrentParticipant 
                participant={currentParticipant}
                onMute={toggleMute}
                onNext={nextParticipant}
                hasNextParticipant={participants.length > 0 || currentParticipant !== null}
              />
            </div>
        </div>
      </div>
    </div>
  );
}

export default PresenterPage;