import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../../components/UserContext.tsx';
import TextSubmission from './textSubmission/TextSubmission.tsx';
import PressToSpeak from './pressToSpeak/PressToSpeak.tsx';
import WaitingInLine from './waitingInLine/WaitingInLine.tsx';
import Loading from '../miscPages/Loading.tsx';
import ConnectionErrorPage from '../miscPages/ConnectionError.tsx';
import ParticipantService, { IParticipantView } from '../../services/participantService.ts';
import { LinePositionValues } from '../../utils/sharedConsts.ts';

function ParticipantPage() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error('ParticipantPage must be used within a UserProvider');
  }

  const {username, roomNumber, setRoomNumber } = userContext;
  const [placeInLine, setPlaceInLine] = useState<number>(LinePositionValues.NOT_IN_LINE);
  const [hasConnectionError, setHasConnectionError] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const view: IParticipantView = {
    updatePlaceInLine: setPlaceInLine,
    updateMuted: setIsMuted,
  };

  const [service] = useState(new ParticipantService(view));

  // Handle URL room parameter
  useEffect(() => {
    const roomFromURL = params.get('room');

    if (roomFromURL) {
      setRoomNumber(roomFromURL);
      console.log(`Room number set from URL: ${roomFromURL}`);
    } else if (!roomNumber) {
      console.log('No room number in URL and user context');
      navigate('/'); // Navigate to home page if there's no room number
    } else {
      console.log(`Room number set from context: ${roomNumber}`);
    }
  }, [params]);

  // Handle connection establishment once roomNumber is set
  useEffect(() => {
    if (roomNumber) {
      console.log(`Establishing connection to room: ${roomNumber}`);
      try {
        service.connectParticipant(roomNumber);
      } catch (e) {
        console.error('Failed to load connection', e);
        navigate('/');
      }
    } else {
      console.log('Room number not set, cannot establish connection.');
    }
  }, [roomNumber]);

  const handleSubmitText = (text: string, sentUsername: string) => {
    try {
      setPlaceInLine(LinePositionValues.LOADING);
      service.sendComment(text, sentUsername);
    } catch (e) {
      console.error('Failed to send comment', e);
      setHasConnectionError(true);
    }
  };

  const handleBack = () => {
    if (placeInLine === LinePositionValues.NOT_IN_LINE) {
      service.disconnectFromPresenter();
      navigate('/');
    } else {
      service.removeFromQueue();
      setPlaceInLine(LinePositionValues.NOT_IN_LINE);
    }
  };

  // Render the appropriate component based on placeInLine
  const renderContent = () => {
    if (hasConnectionError) {
      return <ConnectionErrorPage />;
    }

    if (placeInLine === LinePositionValues.NOT_IN_LINE) {
      return (
        <TextSubmission
          textboxPlaceholder="(Optional) I have a question about..."
          buttonPlaceholder="Get in line"
          textSubmissionHeader="Join the Queue"
          onSubmitText={handleSubmitText}
        />
      );
    }

    // User is loading into the queue
    if (placeInLine === LinePositionValues.LOADING) {
      return <Loading roomNumber={roomNumber} />;
    }

    // User is the current speaker
    if (placeInLine === LinePositionValues.CURRENT_SPEAKER) {
      return <PressToSpeak isMuted={isMuted} sendAudio={service.sendAudio} />;
    }

    // Default: user is in line but not the current speaker
    return <WaitingInLine placeInLine={placeInLine} />;
  };

  // Determine button text based on state
  const getBackButtonText = () => {
    return placeInLine === LinePositionValues.NOT_IN_LINE ? 'Back' : 'Leave Line';
  };

  return (
    <div id="participant-layout">
      <div id="participant-header">
        <h1 id="participant-title">MIC-RUNNER</h1>
        <h3 id="participant-username">{username}</h3>
        <div className='participant-room-container'>
          <h3 id="participant-room">ROOM {roomNumber}</h3>
        </div>
      </div>

      <div id="participant-center">{renderContent()}</div>

      <div id="participant-footer">
        {/* <div className='participant-room-container'>
          <h3 id="participant-room">ROOM {roomNumber}</h3>
        </div> */}
        <button onClick={handleBack} className="back-button styled-button">
          {getBackButtonText()}
        </button>
      </div>
    </div>
  );
}

export default ParticipantPage;
