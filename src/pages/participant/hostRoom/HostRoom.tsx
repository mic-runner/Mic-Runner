import { useNavigate } from "react-router-dom";
import "./HostRoom.css";
import useAlert from "../../../components/Alerts/AlertHook.ts";

function generateRandomRoomNumber() {
  return Math.floor(Math.random() * 1000);
}

// Button for hosting a room on the landing page. Generates a random room number and navigates to the presenter route.
function HostRoom() {
  const navigate = useNavigate();
  const { addAlert } = useAlert();

  const handleHostRoom = () => {
    const roomNumber = generateRandomRoomNumber();
    addAlert(`Creating a host room...\n\nYour room number is ${roomNumber}`);
    navigate("/presenter", { state: { room: roomNumber } });
  };

  return (
    <button className="host-room-button styled-button" onClick={handleHostRoom}>
      Host a Room
    </button>
  );
}

export default HostRoom;
