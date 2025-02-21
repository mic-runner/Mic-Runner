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
                  <div>
                    TODO: Top Left Content
                  </div>
                </div>
                <div className="bottom-box">
                  <div>
                    TODO: Bottom Left Content
                  </div>
                </div>
            </div>

            <div className="right-column">
              <div>
                TODO: Right Content
              </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default PresenterPage;