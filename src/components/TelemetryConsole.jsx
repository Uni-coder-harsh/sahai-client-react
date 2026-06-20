import React, { useEffect, useRef, useState } from 'react';
import { useTelemetryLogs } from '../context/TelemetryLogsContext';
import { Terminal, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

export default function TelemetryConsole() {
  const { telemetryLogs, clearTelemetryLogs } = useTelemetryLogs();
  const [isMinimized, setIsMinimized] = useState(true);
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (!isMinimized && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [telemetryLogs, isMinimized]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        fontFamily: "'Courier New', Courier, monospace",
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
        borderRadius: '8px',
        border: isMinimized
          ? '1px solid rgba(16, 185, 129, 0.4)'
          : '1px solid rgba(0, 240, 255, 0.3)',
        background: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        width: isMinimized ? '200px' : '480px',
        height: isMinimized ? '40px' : '320px',
        overflow: 'hidden',
      }}
    >
      {/* Title Bar */}
      <div
        onClick={() => setIsMinimized(!isMinimized)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderBottom: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
          userSelect: 'none',
          height: '40px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal
            size={16}
            style={{
              color: isMinimized ? '#10b981' : '#00f0ff',
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: isMinimized ? '#10b981' : '#00f0ff',
              letterSpacing: '0.05em',
            }}
          >
            {isMinimized ? '📡 TELEMETRY' : 'root@sahai-telemetry:~'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
          {!isMinimized && (
            <button
              onClick={clearTelemetryLogs}
              title="Clear Terminal"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)')}
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'none',
              border: 'none',
              color: isMinimized ? '#10b981' : '#00f0ff',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      {!isMinimized && (
        <div
          style={{
            flex: 1,
            padding: '12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            margin: 0,
            fontSize: '0.75rem',
            color: '#39ff14', // Neon green
            lineHeight: '1.4',
            textAlign: 'left',
          }}
        >
          {telemetryLogs.map((log, index) => {
            let color = '#39ff14'; // default neon green
            if (log.includes('📡')) color = '#00f0ff'; // neon cyan for payloads
            else if (log.includes('🧠')) color = '#bf5af2'; // purple for ML
            else if (log.includes('📉')) color = '#ffd60a'; // gold for DAG
            else if (log.includes('✅')) color = '#30d158'; // green for syncs
            else if (log.includes('🖥️')) color = '#8e8e93';

            return (
              <div
                key={index}
                style={{
                  color,
                  wordBreak: 'break-all',
                  whiteSpace: 'pre-wrap',
                  textShadow: '0 0 2px rgba(57, 255, 20, 0.2)',
                }}
              >
                {log}
              </div>
            );
          })}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
}
