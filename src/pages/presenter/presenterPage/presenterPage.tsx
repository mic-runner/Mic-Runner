import { useState, useEffect } from "react";
import "./presenterPage.css";
import QRCodeSection from "../qrCode/qrCode";
import ParticipantList from "../participantQueue/participantQueue";
import { useLocation, useNavigate } from "react-router-dom";

import PresenterService, { IPresenterView } from "../../../services/presenterService.ts";
import { QueueParticipant } from "../../../model/queueParticipant.ts";
import { RoomInfo } from "../../../model/roomInfo.ts";
import { CurrentParticipant } from "../../../model/currentParticipant.ts";


const PresenterPage = () => {
  const { state } = useLocation();
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [currentParticipant, setCurrentParticipant] = useState<CurrentParticipant>(new CurrentParticipant());
  const [participants, setParticipants] = useState<QueueParticipant[]>([]);

  const navigate = useNavigate();

  // CS 340 speaking to me like the green goblin mask
  const view: IPresenterView = {
    updateCurrentParticipant: setCurrentParticipant,
    updateParticipants: setParticipants,
  };

  const [service] = useState<PresenterService>(new PresenterService(view));


  useEffect(() => {
    initializeRoom(state);
  }, []);


  // For some reason state has to be type any?
  const initializeRoom = (state: any) => {
    if (!state) {
      navigate("/");
      return;
    }
    // Keeping the roomInfo object for centralization of updates
    const room: RoomInfo = {
        roomNumber: state.room,
        joinUrl: `${window.location.origin + import.meta.env.VITE_APP_BASENAME}/participant?room=${state.room}`,
    };
    setRoomInfo(room);

    service.connectPresenter(room.roomNumber);
  }


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
              onMute={service.toggleMute}
              onNext={service.nextParticipant}
              hasNextParticipant={
                participants.length > 0 || currentParticipant.participant !== null
              }
              onReorder={service.reorderParticipants}
              onDelete={service.deleteParticipant}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenterPage;