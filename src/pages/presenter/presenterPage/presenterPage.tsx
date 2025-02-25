import "./presenter.css";

function PresenterPage() {
  return (
    <div className="presenter-layout"> 
      <div className="inner-presenter-layout">
        
        <div className="presenter-header">
          <h1 className="presenter-title">Mic Runner</h1>
          <p className="room-number">Room 123</p>
        </div>

        <div className="presenter-content">
            <div className="left-column">

                <div className="top-box">
                  <div className="top-box-inner">
                    <div className="join-box">
                      <div className="qr-code">
                        <div className="qr-placeholder">QR CODE PLACEHOLDER</div>
                      </div>
                      <div className="join-now">
                        Join to speak!
                      </div>
                    </div>
                    <div className="link-box">
                      mic-runner.github.io/room123
                    </div>
                  </div>
                </div>

                <div className="bottom-box">
                  <div className="next-up-section">
                    <h2 className="section-title">NEXT UP</h2>
                    <div className="participants-list">
                      <div className="participant-item">
                        <div className="participant-name">Username123</div>
                        <div className="participant-comment">I have a comment related to frasgerd</div>
                      </div>
                      <div className="participant-item">
                        <div className="participant-name">Username123</div>
                      </div>
                      <div className="participant-item">
                        <div className="participant-name">Username123</div>
                        <div className="participant-comment">I have a question about orders of ignorance</div>
                      </div>
                    </div>
                  </div>
                </div>

            </div>

            <div className="right-column">
              <div className="current-speaker-section">
                <div className="participant-comment-section">
                  <p>Participant Comment: I have a question related to dropping features</p>
                </div>
                
                <div className="current-speaker-box">
                  <div className="microphone-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" fill="#f1f1f1"/>
                      <path d="M7 12C7 12 7 14 12 14C17 14 17 12 17 12" stroke="#f1f1f1" strokeWidth="2"/>
                      <path d="M12 17V20" stroke="#f1f1f1" strokeWidth="2"/>
                      <path d="M8 20H16" stroke="#f1f1f1" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="speaker-info">
                    <div className="speaker-name">Username123</div>
                    <div className="speaker-status">Currently Speaking</div>
                  </div>
                  <div className="speaker-controls">
                    <button className="control-button mute-button">Mute</button>
                    <button className="control-button next-button">Next Participant</button>
                  </div>
                </div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default PresenterPage;