import { useNavigate } from "react-router-dom";
import "./HostRoom.css";

function generateRandomRoomNumber() {
  return Math.floor(Math.random() * 1000);
}

// Button for hosting a room on the landing page. Generates a random room number and navigates to the presenter route.
function HostRoom() {
  const navigate = useNavigate();

  const handleHostRoom = () => {
    const roomNumber = generateRandomRoomNumber();
    alert(`Creating a host room...\n\nYour room number is ${roomNumber}`);
    navigate("/presenter");
  };

  return (
    <button className="host-room-button styled-button" onClick={handleHostRoom}>
      Host a room
    </button>
  );
}

export default HostRoom;
