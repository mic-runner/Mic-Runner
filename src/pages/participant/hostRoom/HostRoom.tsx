import "./HostRoom.css";

function generateRandomRoomNumber() {
  return (
    "Creating a host room...\n\nYour room number is " +
    Math.floor(Math.random() * 1000)
  );
}

// Button for hosting a room on the landing page. Generates a random room number right now.
function HostRoom() {
  return (
    <button
      className="host-room-button"
      onClick={() => alert(generateRandomRoomNumber())}
    >
      Host a room
    </button>
  );
}

export default HostRoom;
