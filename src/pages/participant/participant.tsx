import {useContext, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import { UserContext } from "../../components/UserContext";
import TextSubmission from "./textSubmission/TextSubmission";
import PressToSpeak from "./pressToSpeak/PressToSpeak";
import WaitingInLine from "./waitingInLine/WaitingInLine";
import "./participant.css";
import Loading from "../miscPages/Loading.tsx";
import ConnectionErrorPage from "../miscPages/ConnectionError.tsx";
import ParticipantService from "../../services/participant.ts";

function ParticipantPage() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("ParticipantPage must be used within a UserProvider");
  }

  const { username, roomNumber, placeInLine, setPlaceInLine, setRoomNumber} = userContext;
  const [service] = useState(new ParticipantService())
  const [currentComponent, setCurrentComponent] = useState("textSubmission");
  const navigate = useNavigate(); 
  const [params]= useSearchParams();




  //////////DELETE LATER!! THIS IS JUST TO SIMULATE WAITING IN LINE///////////////////// 

  // if (currentComponent === "waitingInLine" && Number(placeInLine) > 0) {
  //   setTimeout(() => {
  //     setPlaceInLine(() => String(Math.max(0, Number(placeInLine) - 1)));
  //   }, 1000);
  // }

  // when you delete this, you might have to change the next if statement to not make it into a number first when comparing and just compare it to a string 0. 
  // you can also get rid of the setPlaceInLine from the userContext when you delete this

  // sorry for the hassle! 
  ///////////////////////////////////////////////////////////////////////////////////// 

  const updatePlaceInLine = (i: number) => {
    setPlaceInLine(i.toString());
  }


  useEffect(() => {
    // The format of a URL with a room value is https://micrunner.click/participant?room=#
    const roomFromURL = params.get("room");

    if (roomFromURL) {
      setRoomNumber(roomFromURL);
      console.log(`Room number set from URL: ${roomFromURL}`);
    } else if (!roomNumber) {
      console.log("No room number in URL and user context");
      navigate("/"); // Navigate to home page if there's no room number
    } else {
      console.log(`Room number set from context: ${roomNumber}`);
    }
  }, [params, roomNumber, setRoomNumber, navigate]);



  
  // Handle connection establishment once roomNumber is set
  useEffect(() => {
    if (roomNumber) {
      console.log(`Establishing connection to room: ${roomNumber}`);
      // TODO:
      // USER ID MIGHT NEED TO BE UNIQUE AND IT WONT BE AS IT IS NOW!!
      try {
        service.connectParticipant("", roomNumber, updatePlaceInLine);
      }
      catch (e) {
        console.error("Failed to load connection", e);
        navigate("/");
      }
    } else {
      console.error("Room number not set, cannot establish connection.");
    }
  }, [roomNumber]); 

  const handleSubmitText = (text: string) => {
    setCurrentComponent("waitingInLine");
    setPlaceInLine("loading")
    try {
      service.sendComment(text);
    }
    catch (e) {
      console.error("Failed to load connection", e);
      setCurrentComponent("connectionError");
    }
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
        {currentComponent === "waitingInLine" && placeInLine === "loading" && (
            <Loading roomNumber={roomNumber} />
        )}
        {currentComponent === "waitingInLine" && placeInLine !== "loading" && (
          <WaitingInLine placeInLine={placeInLine.toString()} />
        )}
        {currentComponent === "pressToSpeak" && <PressToSpeak />}
        {currentComponent === "connectionError" && <ConnectionErrorPage />}
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
