import { useState, useEffect, useRef } from "react";
import "./PressToSpeak.css";


interface PressToSpeakProps {
  isMuted: boolean;
  sendAudio: (stream: MediaStream | null) => void;
}

const PressToSpeak = ({ isMuted, sendAudio }: PressToSpeakProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);


  useEffect(() => {
    if (!isSpeaking && localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
  }, [isSpeaking]);

  const handleStart = async (e: React.MouseEvent | TouchEvent) => {
    e.preventDefault();
  
    if (isMuted) return;
  
    setIsSpeaking(true);
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      sendAudio(stream);
    } catch (err) {
      console.error("Failed to get user media", err);
      setIsSpeaking(false);
    }
  };

  const handleEnd = (e: React.MouseEvent | TouchEvent) => {
    e.preventDefault();

    if (isMuted) {
      return;
    }
    
    setIsSpeaking(false);

    if (localStream) {
      sendAudio(null); 
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  };

  // For mobile users
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
  
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handleStart(e);
    };
  
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      handleEnd(e);
    };
  
    button.addEventListener("touchstart", handleTouchStart, { passive: false });
    button.addEventListener("touchend", handleTouchEnd, { passive: false });
    button.addEventListener("touchcancel", handleTouchEnd, { passive: false });
  
    return () => {
      button.removeEventListener("touchstart", handleTouchStart);
      button.removeEventListener("touchend", handleTouchEnd);
      button.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isMuted]); 

  

  return (
    <div className="press-to-speak-container">
      <div
        ref={buttonRef}
        className={`press-to-speak-button ${(isMuted || !isSpeaking) ? "" : "speaking"}`}
        onMouseDown={handleStart}  // This just helps on desktop
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        >
        {isMuted ? 
        <img id="muted-img" src="https://mic-runner.github.io/Mic-Runner/muted.png" alt="Muted" />
        :
        isSpeaking ? 
        // <img src="https://mic-runner.github.io/Mic-Runner/mic.png" alt="Microphone" />
        <img id="microphone-img" src="https://mic-runner.github.io/Mic-Runner/microphone-img.png" alt="Microphone" />
        :
        <img src="https://mic-runner.github.io/Mic-Runner/tap.png" alt="Tap" />
      }
      </div>
      <div className="speaking-instructions">
        <h1>{isMuted ? "Muted by Presenter" : isSpeaking ? "NOW SPEAKING" : "Hold to Speak"}</h1>
        <p>{isMuted ? "Presenter has muted you for now" : "Talk into your phone's microphone"}</p>
      </div>
      {/* <p>{isSpeaking ? "Talk into your phone's microphone" : ""}</p> */}
      
    </div>
  );
};

export default PressToSpeak;