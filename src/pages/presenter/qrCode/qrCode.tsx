import { useEffect, useState } from "react";
import "./qrCode.css";
import QRCode from "react-qr-code";

interface QRCodeSectionProps {
  joinUrl: string | undefined;
}

const QRCodeSection = ({ joinUrl }: QRCodeSectionProps) => {

  const [qrSize, setQrSize] = useState(0);
  
  const calculateQrSize = () => {
    const newSize = Math.min(window.innerHeight * 0.52, window.innerWidth * 0.68);
    setQrSize(newSize);
  };
  
  useEffect(() => {
    calculateQrSize();
    window.addEventListener('resize', calculateQrSize);
    return () => {
      window.removeEventListener('resize', calculateQrSize);
    };
  }, []);


  return (
    <div className="top-box-inner">
      <div className="join-now">
        <h2>Join to speak!</h2>
      </div>
      <div className="join-box">
        <div className="qr-code">
            {joinUrl ? (
                <QRCode 
                  value={joinUrl as string} 
                  size={qrSize} 
                />
            ) : (
                <div className="qr-placeholder">QR code is loading</div>
            )}
        </div>
      </div>
      <div className="link-box">
        <p>{joinUrl ? joinUrl : ""}</p>
      </div>
    </div>
  );
}

export default QRCodeSection;