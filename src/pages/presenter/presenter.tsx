import "./presenter.css";

function PresenterPage() {
  return (
    <div id="presenter-layout">
      {/* Left Section */}
      <div id="left-section">
        <div id="qr-info">
          <h1 id="title">MIC RUNNER</h1>
          <h2 id="room-id">Room123</h2>
          <div id="qr-code">
            <img src="qr-code-placeholder.png" alt="QR Code" />
          </div>
          <p id="join-text">Join to speak!</p>
          <a href="https://mic-runner.github.io/room123" id="room-link">
            mic-runner.github.io/room123
          </a>
        </div>

        <hr className="divider" />

        <div id="next-up">
          <h2>Next Up</h2>
          <ul>
            <li>
              <strong>Username123</strong>
              <p>I have a comment related to frasgerd</p>
            </li>
            <li>
              <strong>Username123</strong>
              <p>I have a question about orders of ignorance</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Section */}
      <div id="right-section">
        <h2 id="participant-comment">
          Participant Comment: I have a question related to dropping features
        </h2>

        <div id="current-speaker">
          <div id="microphone-icon">🎤</div> {/* Replace with SVG if needed */}
          <h3 id="speaker-username">Username123</h3>
          <p id="speaker-status">Currently Speaking</p>
        </div>

        <div id="controls">
          <button className="control-button">Mute</button>
          <button className="control-button">Next Participant</button>
        </div>
      </div>
    </div>
  );
}

export default PresenterPage;