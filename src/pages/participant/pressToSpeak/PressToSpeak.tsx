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

  const handleStart = async (e: React.MouseEvent | TouchEvent) => {
    e.preventDefault(); 

    if (isMuted) {
      return;
    }

    setIsSpeaking(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      sendAudio(stream); // Send the local stream when speaking
    } catch (err) {
      console.error("Failed to get user media", err);
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
      localStream.getTracks().forEach(track => track.stop()); // Stop the stream when done speaking
      setLocalStream(null);
    }
  };

  // For mobile users
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
        e.preventDefault();
        handleStart(e);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
        e.preventDefault();
        handleEnd(e);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    document.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  

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
        <img src="https://mic-runner.github.io/Mic-Runner/muted.png" alt="Muted" />
        :
        isSpeaking ? 
        <img src="https://mic-runner.github.io/Mic-Runner/mic.png" alt="Microphone" />
        :
        <img src="https://mic-runner.github.io/Mic-Runner/tap.png" alt="Tap" />
      }
      </div>

      <h1>{isMuted ? "Muted" : isSpeaking ? "SPEAKING" : "Hold to Speak"}</h1>
    </div>
  );
};

export default PressToSpeak;