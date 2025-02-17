import TextSubmission from "./textSubmission/TextSubmission";
import PressToSpeak from "./pressToSpeak/PressToSpeak";
import WaitingInLine from "./waitingInLine/WaitingInLine";
import "./participant.css";

function participantPage(username: string) {
  return (
    <div id="participant-layout" >
    <div id="participant-header">
    <h1 id="participant-title">Mic Runner</h1>
    <h2 id="participant-username">{username}</h2>
    </div>

    <div id="participant-center">
    {/* <TextSubmission textboxPlaceholder="I have a question about..." buttonPlaceholder="Get in line" textSubmissionHeader="Comment Topic"/> */}
    <WaitingInLine placeInLine="5"/>
    {/* <PressToSpeak /> */}
    </div>

    <div id="participant-footer">
    <h3 id="participant-room">
      Room123
    </h3>
    </div>

  </div>
  );
}

export default participantPage;
