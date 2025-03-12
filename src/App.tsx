import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Participant from "./pages/participant/participant.tsx";
import ErrorPage from "./pages/miscPages/ErrorPage.tsx";
import WelcomePage from "./pages/participant/welcomePage/WelcomePage.tsx";

import { UserProvider } from "./components/UserContext.tsx";
import Presenter from "./pages/presenter/presenterPage/presenterPage.tsx";

function App() {
  return (

    // IF IN DEVELOPMENT, SHOULDN'T HAVE A BASENAME
    <BrowserRouter basename={import.meta.env.VITE_APP_BASENAME}>
      <UserProvider>
        <Routes>
          {/* Default landing page */}
          <Route path="/" element={<WelcomePage />} />

          {/* Presenter route */}
          <Route path="/presenter" element={<Presenter />} />

          {/* Participant route */}
          {/*username: props.username, placeInLine: props.placeInLine, roomNumber: props.roomNumber -> from UserContext, I updated the props for participant*/}
          <Route path="/participant" element={<Participant />} />

          {/* Catch-all for unknown routes */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
