import { useContext, useState } from "react";
import { UserContext } from "../../../components/UserContext";
import "./JoinRoom.css";

interface JoinRoomProps {
  textboxPlaceholder: string;
  buttonPlaceholder: string;
}

// Component for joining a room as a participant
// It sets the username and room number in the UserContext on submission
const JoinRoom: React.FC<JoinRoomProps> = (props) => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("JoinRoom must be used within a UserProvider");
  }
  const { setUsername, setRoomNumber } = userContext;

  const [room, setRoom] = useState("");
  const [user, setUser] = useState("");

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(user);
    setRoomNumber(room);
    alert(`\nJoining room: ${room} as ${user}\n`);
    setUser("");
    setRoom("");
  };

  return (
    <form className="text-form" onSubmit={handleSubmitText}>
      <textarea
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className="text-input"
        placeholder="Name"
      />
      <textarea
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="text-input"
        placeholder={props.textboxPlaceholder}
      />
      <button type="submit" className="submit-btn">
        {props.buttonPlaceholder}
      </button>
    </form>
  );
};

export default JoinRoom;
