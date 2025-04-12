import { useState, useEffect, useRef } from "react";
import "./PressToSpeak.css";

interface PressToSpeakProps {
  isMuted: boolean;
  sendAudio: (stream: MediaStream | null) => void;
}

const PressToSpeak = ({ isMuted, sendAudio }: PressToSpeakProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const handleStream = async () => {
      if (isSpeaking && !isMuted) {
        try {
          // Get new stream each time button is pressed
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          sendAudio(stream);
        } catch (err) {
          console.error("Failed to get user media", err);
          setIsSpeaking(false);
        }
      } else {
        // Stop current stream when button is released
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          sendAudio(null);
        }
      }
    };

    handleStream();

    return () => {
      // Cleanup if component unmounts while speaking
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        sendAudio(null);
      }
    };
  }, [isSpeaking, isMuted, sendAudio]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!isMuted) setIsSpeaking(true);
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setIsSpeaking(false);
    };

    // Mouse events
    button.addEventListener("mousedown", handleStart);
    button.addEventListener("mouseup", handleEnd);
    button.addEventListener("mouseleave", handleEnd);

    // Touch events
    button.addEventListener("touchstart", handleStart, { passive: false });
    button.addEventListener("touchend", handleEnd, { passive: false });
    button.addEventListener("touchcancel", handleEnd, { passive: false });

    return () => {
      // Cleanup event listeners
      button.removeEventListener("mousedown", handleStart);
      button.removeEventListener("mouseup", handleEnd);
      button.removeEventListener("mouseleave", handleEnd);
      button.removeEventListener("touchstart", handleStart);
      button.removeEventListener("touchend", handleEnd);
      button.removeEventListener("touchcancel", handleEnd);
    };
  }, [isMuted]);

  return (
    <div className="press-to-speak-container">
      <div
        ref={buttonRef}
        className={`press-to-speak-button ${(isMuted || !isSpeaking) ? "" : "speaking"}`}
      >
        {isMuted ? 
          <img id="muted-img" src="https://mic-runner.github.io/Mic-Runner/muted.png" alt="Muted" />
        : isSpeaking ? 
          <img id="microphone-img" src="https://mic-runner.github.io/Mic-Runner/microphone-img.png" alt="Microphone" />
        :
          <img src="https://mic-runner.github.io/Mic-Runner/tap.png" alt="Tap" />
        }
      </div>
      <div className="speaking-instructions">
        <h1>{isMuted ? "Muted by Presenter" : isSpeaking ? "NOW SPEAKING" : "Hold to Speak"}</h1>
        <p>{isMuted ? "Presenter has muted you for now" : "Talk into your phone's microphone"}</p>
      </div>
    </div>
  );
};

export default PressToSpeak;