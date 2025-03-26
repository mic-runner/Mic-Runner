import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../components/UserContext';
import './JoinRoom.css';

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
  const [room, setRoom] = useState('');

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room.trim()) {
      alert('Please enter a room number.');
      return;
    }

    setRoomNumber(room);

    navigate(`/participant?room=${room}`, {
      state: { roomNumber: room },
    });
  };

  return (
    <form className="text-form" onSubmit={handleSubmitText}>
      <span className="join-text">Join a Room</span>
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
