import {useContext, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import { UserContext } from "../../components/UserContext";
import TextSubmission from "./textSubmission/TextSubmission";
import PressToSpeak from "./pressToSpeak/PressToSpeak";
import WaitingInLine from "./waitingInLine/WaitingInLine";
import "./participant.css";

function ParticipantPage() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("ParticipantPage must be used within a UserProvider");
  }

  const { username, roomNumber, placeInLine, setPlaceInLine, setRoomNumber } = userContext;
  const [currentComponent, setCurrentComponent] = useState("textSubmission");
  const navigate = useNavigate(); // Initialize useNavigate
  const [params]= useSearchParams();

  useEffect(() => {
    // The format of a url with a room value is https://micrunner.click/participant?room=#
    if (params.get("room")) {
      setRoomNumber(params.get("room") as string);
      console.log(`Room number set ${roomNumber}`)
    }
    //Normal application behavior
    else {
      console.log("No url params")

      // If there is no room number navigate back to launch page
      console.log(`Room number ${roomNumber}`);
      if (!roomNumber) {
        console.log("No room number")
        navigate("/");
      }
    }
  }, [])




  //////////DELETE LATER!! THIS IS JUST TO SIMULATE WAITING IN LINE///////////////////// 

  if (currentComponent === "waitingInLine" && Number(placeInLine) > 0) {
    setTimeout(() => {
      setPlaceInLine(() => String(Math.max(0, Number(placeInLine) - 1)));
    }, 1000); 
  }

  // when you delete this, you might have to change the next if statement to not make it into a number first when comparing and just compare it to a string 0. 
  // you can also get rid of the setPlaceInLine from the userContext when you delete this

  // sorry for the hassle! 
  ///////////////////////////////////////////////////////////////////////////////////// 

  const handleSubmitText = () => {
    setCurrentComponent("waitingInLine");
  };

  if (Number(placeInLine) === 0 && currentComponent === "waitingInLine") {
    setCurrentComponent("pressToSpeak");
  }

  const handleBack = () => {
    if (currentComponent === "textSubmission") {
      navigate("/"); 
    } else if (currentComponent === "waitingInLine" || currentComponent === "pressToSpeak") {
      setCurrentComponent("textSubmission");
    } 
  };

  return (
    <div id="participant-layout">
      <div id="participant-header">
        <h1 id="participant-title">Mic Runner</h1>
        <h2 id="participant-username">{username}</h2>
      </div>

      <div id="participant-center">
        {currentComponent === "textSubmission" && (
          <TextSubmission
            textboxPlaceholder="I have a question about..."
            buttonPlaceholder="Get in line"
            textSubmissionHeader="Comment Topic"
            onSubmitText={handleSubmitText}
          />
        )}
        {currentComponent === "waitingInLine" && (
          <WaitingInLine placeInLine={placeInLine.toString()} />
        )}
        {currentComponent === "pressToSpeak" && <PressToSpeak />}
      </div>

      <div id="participant-footer">
        <h3 id="participant-room">Room {roomNumber}</h3>
        <button onClick={handleBack} className="back-button styled-button">
        {currentComponent === "textSubmission" ? "Back" : "Leave Line"}
      </button>
      </div>
    </div>
  );
}

export default ParticipantPage;
