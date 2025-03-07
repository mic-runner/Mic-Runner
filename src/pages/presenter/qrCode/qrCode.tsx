import "./qrCode.css";
import QRCode from "react-qr-code";

interface QRCodeSectionProps {
  joinUrl: string | undefined;
}

const QRCodeSection = ({ joinUrl }: QRCodeSectionProps) => {

  // Calculate QR code size as 47% of viewport height, max 350px
  const qrSize = Math.min(350, window.innerHeight * 0.47);
  
  return (
    <div className="top-box-inner">
      <div className="join-now">
        Join to speak!
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
        {joinUrl ? joinUrl : ""}
      </div>
    </div>
  );
}

export default QRCodeSection;