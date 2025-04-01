import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../components/UserContext';
import './JoinRoom.css';
import useAlert from "../../../components/Alerts/AlertHook.ts";
import Peer from "peerjs";

interface JoinRoomProps {
  textboxPlaceholder: string;
  buttonPlaceholder: string;
}

// Component for joining a room as a participant
// It sets the username and room number in the UserContext on submission
const JoinRoom: React.FC<JoinRoomProps> = props => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (!userContext) {
    throw new Error('JoinRoom must be used within a UserProvider');
  }

  const { setRoomNumber } = userContext;
  const { addAlert } = useAlert();
  const [room, setRoom] = useState('');

  const checkPeer = (roomId: string)=> {
    const testPeer = new Peer(roomId);
    testPeer.on('error', (error) => {
      console.log(error);
      if (error.type == 'unavailable-id') {
        console.log("ID already exists -- Room is valid")
        testPeer.destroy();
        navigate(`/participant?room=${roomId}`, {
          state: { roomNumber: roomId },
        });
        return
      }
      console.log("Something else happened -- Room is probably not valid")
      addAlert(error.message);
      testPeer.destroy();
      navigate('/')
    })

    testPeer.on('open', () => {
      console.log(`Peer did not exist ${roomId}`)
      testPeer.destroy();
      addAlert('Room not found')
      navigate('/');
    })
  }

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room.trim()) {
      addAlert('Please enter a room number.');
      return;
    }
    setRoomNumber(room);

    checkPeer(room);
  };

  return (
    <form className="text-form" onSubmit={handleSubmitText}>
      <input
        value={room}
        onChange={e => setRoom(e.target.value)}
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
