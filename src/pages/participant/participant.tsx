import { useState } from "react";
import TextSubmission from "./textSubmission/TextSubmission";
import PressToSpeak from "./pressToSpeak/PressToSpeak";
import WaitingInLine from "./waitingInLine/WaitingInLine";
import "./participant.css";

interface participantProps {
  username: string;
  placeInLine: string; // this is a string number representing the place this person is in line.
  roomNumber: string;
}

function ParticipantPage(props: participantProps) {
  // to see other components, switch 'textSubmission' to either: 'waitingInLine' or 'pressToSpeak' and reload the page.
  const [currentComponent] = useState("pressToSpeak");

  return (
    <div id="participant-layout">
      <div id="participant-header">
        <h1 id="participant-title">Mic Runner</h1>
        <h2 id="participant-username">{props.username}</h2>
      </div>

      <div id="participant-center">
        {currentComponent === "textSubmission" && (
          <TextSubmission
            textboxPlaceholder="I have a question about..."
            buttonPlaceholder="Get in line"
            textSubmissionHeader="Comment Topic"
          />
        )}
        {currentComponent === "waitingInLine" && (
          <WaitingInLine placeInLine={props.placeInLine} />
        )}
        {currentComponent === "pressToSpeak" && <PressToSpeak />}
      </div>

      <div id="participant-footer">
        <h3 id="participant-room">Room123{/*props.roomNumber*/}</h3>
      </div>
    </div>
  );
}

export default ParticipantPage;
