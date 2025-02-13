import './App.css'
import {BrowserRouter,
    Route,
    Routes,
} from "react-router-dom"

import participant from "./pages/participant.tsx";
import presenter from "./pages/presenter.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";

import {useDevice, DeviceType} from "./components/device/useDevice.ts";

// Consider checking connection to Wi-Fi using navigator.connection

function App() {

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
                <Route index element={participant()} />
                <Route path='*' element={ErrorPage()} />
            </Routes>
        )
    }

    return (
      <BrowserRouter>
          {
            (useDevice() == DeviceType.web) ? (presenterRoutes()) : (participantRoutes())
          }
      </BrowserRouter>
    )
}

export default App
