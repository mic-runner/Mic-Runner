import './App.css'
import {BrowserRouter,
    Route,
    Routes,
} from "react-router-dom"

import participant from "./pages/participant/participant.tsx";
import presenter from "./pages/presenter/presenter.tsx";
import ErrorPage from "./pages/errorPage/ErrorPage.tsx";

import {useDevice, DeviceType} from "./components/device/useDevice.ts";

// Consider checking connection to Wi-Fi using navigator.connection

function App() {

    // I added this so I can work on the mobile version on my laptop. set this to true if you want actual functionality and false if you're working on mobile
    const isMobileOverride = false;

    // presenterRoutes if we want to do logic with getting the device type (mobile vs desktop)
    const presenterRoutes = () => {
        return (
            <Routes>
                <Route index element={presenter()} />
                <Route path='*' element={ErrorPage()} />
            </Routes>
        )
    }

    // participant routes for mobile devices
    const participantRoutes = () => {
        return (
            <Routes>
                {/* I hardcoded a Username here that will need to be typed in by the user eventually on the landing page.  */}
                <Route index element={participant({username: "Username123", placeInLine: '1'})} /> 
                <Route path='*' element={ErrorPage()} />
            </Routes>
        )
    }

    return (
      <BrowserRouter>
          {
            (isMobileOverride && useDevice() == DeviceType.web) ? (presenterRoutes()) : (participantRoutes())
          }
      </BrowserRouter>
    )
}

export default App
