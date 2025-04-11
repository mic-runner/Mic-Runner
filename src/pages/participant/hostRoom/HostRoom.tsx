import { useNavigate } from 'react-router-dom';
import './HostRoom.css';
// import useAlert from '../../../components/Alerts/AlertHook.ts';
import { useState } from 'react';

function generateRandomRoomNumber() {
  return Math.floor(Math.random() * 1000);
}

// Button for hosting a room on the landing page. Generates a random room number and navigates to the presenter route.
function HostRoom() {
  const navigate = useNavigate();
  // const { addAlert } = useAlert();
  const [roomName, setRoomName] = useState('');

  const handleHostRoom = () => {
    const roomNumber = generateRandomRoomNumber();
    // addAlert(`Creating a host room...\n\nYour room number is ${roomNumber}`);
    navigate('/presenter', { state: { room: roomNumber, roomName } });
  };

  return (
    <>
      <input 
      type="text"
      value={roomName}
        className="text-input"
      onChange={e => setRoomName(e.target.value)}
      placeholder='Room name (optional)'
      ></input>
      <button className="host-room-button styled-button" onClick={handleHostRoom}>
        Host a Room
      </button>
    </>
  );
}

export default HostRoom;
