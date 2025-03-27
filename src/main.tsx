// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AlertProvider from './components/Alerts/AlertProvider.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AlertProvider>
        <App />
    </AlertProvider>
  // </StrictMode>,
)
