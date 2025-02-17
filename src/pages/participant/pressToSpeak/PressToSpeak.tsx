import { useState, useEffect, useRef } from "react";
import "./PressToSpeak.css";

const PressToSpeak = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // These functions are for the desktop version
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); 
    setIsSpeaking(true);
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsSpeaking(false);
  };

  // This is for the mobile version. 
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Ensure the touch is on the button
      if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
        e.preventDefault();
        setIsSpeaking(true);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Ensure the touch is on the button
      if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
        e.preventDefault();
        setIsSpeaking(false);
      }
    };

    // Add event listeners for touch events on the document but filter with contains to ensure it's the button
    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    document.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    // Clean up event listeners on component unmount
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
        className={`press-to-speak-button ${isSpeaking ? "speaking" : ""}`}
        onMouseDown={handleStart}  // This just helps on desktop
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {isSpeaking ? 
          <img src="public/mic.png" alt="Microphone" />
          :
          <img src="public/tap.png" alt="Tap" />
        }
      </div>

      <h1>{isSpeaking ? "SPEAKING" : "Hold to Speak"}</h1>
    </div>
  );
};

export default PressToSpeak;
