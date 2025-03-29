import HostRoom from "../hostRoom/HostRoom";
import JoinRoom from "../joinRoom/JoinRoom";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";



function WelcomePage() {
  const navigate = useNavigate()

  useEffect(() => {
      const currURL = new URL(location.href);
      const redirectStr = currURL.searchParams.get("redirect");
      if (redirectStr) {
        const redirect = JSON.parse(decodeURIComponent(redirectStr));
        let path = ""
        if (redirect.path) {
            path = redirect.path.replace(import.meta.env.VITE_APP_BASENAME, "");
        }

        let navigationStr: string = path + "?"
        console.log(navigationStr);
        console.log(redirect.searches);
        if (redirect.searches) {
            for (const [key, value] of Object.entries(redirect.searches)) {
                console.log(key, value);
                navigationStr += key + "=" + value;
            }
        }
        console.log(navigationStr);
        navigate(navigationStr);

      }
  }, [])

  return (
    <div id="participant-layout">
      <div id="participant-header">
        <h2 id="participant-title">
          <div>
            MIC-RUNNER
          </div>
        </h2>
      </div>

      <div id="participant-center">
        <JoinRoom textboxPlaceholder="Room number?" buttonPlaceholder="Join Room" />
      </div>

      <div id="participant-footer">
        <HostRoom />
      </div>
    </div>
  );
}

export default WelcomePage;
