import { useState, useEffect } from "react";
import "./PressToSpeak.css";


const IMAGE_URLS = {
  muted: "https://mic-runner.github.io/Mic-Runner/muted.png",
  speaking: "https://mic-runner.github.io/Mic-Runner/microphone-img.png",
  tap: "https://mic-runner.github.io/Mic-Runner/tap.png",
};


interface PressToSpeakProps {
  isMuted: boolean;
  sendAudio: (stream: MediaStream | null) => void;
}

const PressToSpeak = ({ isMuted, sendAudio }: PressToSpeakProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // It was taking a long time to load the Mic for some reason. Pre-loading fixes that.
  useEffect(() => {
    Object.values(IMAGE_URLS).forEach(url => { new Image().src = url; });
  }, []);


  useEffect(() => {
    if (!localStream) {
      return
    }
    if (!isSpeaking) {
      localStream.getTracks().forEach(track => {
        console.log("Closing track", track);
        track.enabled = false
        console.log("After", track.enabled)
      });
    }
    else if (isSpeaking) {
      localStream.getTracks().forEach(track => {
        console.log("Opening track", track);
        track.enabled = true
        console.log("After", track.enabled)
      });
    }
  }, [isSpeaking]);

  const handleStart = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isMuted) return;

    console.log("Starting stream", localStream?.getTracks()[0]);

    if (localStream) {
      setIsSpeaking(true);
      return;
    }
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      sendAudio(stream);
      setIsSpeaking(true);
      console.log("Initialized audio stream", stream);
    } catch (err) {
      console.error("Failed to get user media", err);
      setIsSpeaking(false);
    }
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    if (isMuted) {
      setIsSpeaking(false);
      return;
    }
    console.log("Ending stream", localStream?.getTracks()[0]);
    
    setIsSpeaking(false);

    // if (localStream) {
    //   sendAudio(null);
    //   localStream.getTracks().forEach(track => track.stop());
    //   setLocalStream(null);
    // }
  };

  // For mobile users
  // useEffect(() => {
  //   const button = buttonRef.current;
  //   if (!button) return;
  //
  //   const handleTouchStart = (e: TouchEvent) => {
  //     e.preventDefault();
  //     handleStart(e);
  //   };
  //
  //   const handleTouchEnd = (e: TouchEvent) => {
  //     e.preventDefault();
  //     handleEnd(e);
  //   };
  //
  //   button.addEventListener("touchstart", handleTouchStart, { passive: false });
  //   button.addEventListener("touchend", handleTouchEnd, { passive: false });
  //   button.addEventListener("touchcancel", handleTouchEnd, { passive: false });
  //
  //   return () => {
  //     button.removeEventListener("touchstart", handleTouchStart);
  //     button.removeEventListener("touchend", handleTouchEnd);
  //     button.removeEventListener("touchcancel", handleTouchEnd);
  //   };
  // }, [isMuted]);

  return (
    <div className="press-to-speak-container">
      <div
        className={`press-to-speak-button ${(isMuted || !isSpeaking) ? "" : "speaking"}`}
        onMouseDown={handleStart}  // This just helps on desktop
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        >
        {isMuted ? 
        <img id="muted-img" src={IMAGE_URLS.muted} alt="Muted" />
        :
        isSpeaking ? 
        <img id="microphone-img" src={IMAGE_URLS.speaking} alt="Microphone" />
        :
        <img src={IMAGE_URLS.tap} alt="Tap" />
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