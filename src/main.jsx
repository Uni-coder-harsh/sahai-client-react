import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { TelemetryLogsProvider } from './context/TelemetryLogsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <LanguageProvider>
        <TelemetryLogsProvider>
          <App />
        </TelemetryLogsProvider>
      </LanguageProvider>
    </HashRouter>
  </StrictMode>,
)
