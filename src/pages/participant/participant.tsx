import "./participant.css";

function participantPage(username: string) {
  return (
    <div id="participant-layout" >
    <div id="participant-header">
    <h1 id="participant-title">Mic Runner</h1>
    <h2 id="participant-username">{username}</h2>
    </div>

    <div id="participant-center">
      Center Components here
    </div>

    <div id="participant-footer">
    <h3 id="participant-room">
      Room123
    </h3>
    </div>

  </div>
  );
}

export default participantPage;
