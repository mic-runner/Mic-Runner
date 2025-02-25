import "./qrCode.css";

interface QRCodeSectionProps {
  joinUrl: string | undefined;
  hasRealQR?: boolean;
}

const QRCodeSection = ({ joinUrl, hasRealQR = false }: QRCodeSectionProps) => {
  return (
    <div className="top-box-inner">
      <div className="join-box">
        <div className="qr-code">
          {hasRealQR ? (
            <div>Real QR code would go here</div>
          ) : (
            <div className="qr-placeholder">QR CODE PLACEHOLDER</div>
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