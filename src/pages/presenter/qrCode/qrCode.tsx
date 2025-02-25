import "./qrCode.css";
import QRCode from "react-qr-code";

interface QRCodeSectionProps {
  joinUrl: string | undefined;
}

const QRCodeSection = ({ joinUrl }: QRCodeSectionProps) => {
  return (
    <div className="top-box-inner">
      <div className="join-box">
        <div className="qr-code">
            {joinUrl ? (
                <QRCode value={joinUrl as string} />
            ) : (
                <div className="qr-placeholder">QR code is loading</div>
            )}
        </div>
        <div className="join-now">
          Join to speak!
        </div>
      </div>
      <div className="link-box">
        {joinUrl ? joinUrl : ""}
      </div>
    </div>
  );
}

export default QRCodeSection;