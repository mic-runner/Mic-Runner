import HostRoom from "../hostRoom/HostRoom";
import JoinRoom from "../joinRoom/JoinRoom";

function WelcomePage() {
  return (
    <div id="participant-layout">
      <div id="participant-header">
        <h2 id="participant-title">
          <div>
            Welcome to
            <br />
            Mic Runner
          </div>
        </h2>
      </div>

      <div id="participant-center">
        <JoinRoom textboxPlaceholder="Room number?" buttonPlaceholder="Enter" />
      </div>

      <div id="participant-footer">
        <HostRoom />
      </div>
    </div>
  );
}

export default WelcomePage;
