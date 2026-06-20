import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const TelemetryLogsContext = createContext(null);

export function TelemetryLogsProvider({ children }) {
  const [telemetryLogs, setTelemetryLogs] = useState([
    `> [${new Date().toLocaleTimeString()}] 🖥️ Telemetry System Bootstrapped.`,
    `> [${new Date().toLocaleTimeString()}] 🧠 Bayesian Math parameters initialized (prior Beta(2.0, 2.0)).`,
    `> [${new Date().toLocaleTimeString()}] 📡 Direct HTTP payload tunnel listening...`
  ]);

  const addTelemetryLog = useCallback((message) => {
    const timeStr = new Date().toLocaleTimeString();
    setTelemetryLogs((prev) => [...prev, `> [${timeStr}] ${message}`]);
  }, []);

  const clearTelemetryLogs = useCallback(() => {
    setTelemetryLogs([]);
  }, []);

  // Set up window listener to intercept events from api.js
  useEffect(() => {
    const handleTelemetryLogEvent = (e) => {
      if (e.detail) {
        addTelemetryLog(e.detail);
      }
    };
    window.addEventListener('telemetry-log', handleTelemetryLogEvent);
    return () => {
      window.removeEventListener('telemetry-log', handleTelemetryLogEvent);
    };
  }, [addTelemetryLog]);

  return (
    <TelemetryLogsContext.Provider value={{ telemetryLogs, addTelemetryLog, clearTelemetryLogs }}>
      {children}
    </TelemetryLogsContext.Provider>
  );
}

export function useTelemetryLogs() {
  const context = useContext(TelemetryLogsContext);
  if (!context) {
    throw new Error('useTelemetryLogs must be used within a TelemetryLogsProvider');
  }
  return context;
}
