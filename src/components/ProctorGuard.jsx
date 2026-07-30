import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function ProctorGuard({ userId, children }) {
  const [isObfuscated, setIsObfuscated] = useState(false);
  const [liveTimestamp, setLiveTimestamp] = useState(new Date().toLocaleString());

  // 1. Keep timestamp updated for dynamic watermarking attribution
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTimestamp(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Focus Loss Screen Obfuscation & Telemetry Dispatch
  useEffect(() => {
    const handleBlur = async () => {
      setIsObfuscated(true);
      try {
        console.log('[Anti-Cheat Guard] Focus lost violation detected. Dispatching telemetry log...');
        await api.sendTelemetry({
          event_type: 'FOCUS_LOST',
          success: false,
          attempts: 1,
          behavioral_flags: ['FOCUS_LOST_VIOLATION'],
          time_spent_seconds: 0,
          node_id: 'PY_SYNTAX_01' // Standard fallback node ID
        });
      } catch (err) {
        console.error('[Anti-Cheat Guard] Failed to log focus-lost violation telemetry:', err);
      }
    };

    const handleFocus = () => {
      setIsObfuscated(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleBlur();
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId]);

  // 3. Short-Cut Interceptions and Context Menu Blockers
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      console.log('[Anti-Cheat Guard] Right-click blocked.');
    };

    const handleKeyDown = (e) => {
      // DevTools & inspector shortcuts: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      const isDevTools = 
        e.key === 'F12' || 
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u'));

      // System operations shortcuts: Ctrl+P (Print), Ctrl+C (Copy), Ctrl+S (Save)
      const isSysShortcut = 
        (e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p' || e.key === 'C' || e.key === 'c' || e.key === 'S' || e.key === 's');

      // Screenshot keys: PrintScreen key detection
      const isScreenshot = e.key === 'PrintScreen' || e.keyCode === 44;

      if (isDevTools || isSysShortcut || isScreenshot) {
        e.preventDefault();
        e.stopPropagation();
        console.log(`[Anti-Cheat Guard] Intercepted and blocked shortcut key: ${e.key}`);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        console.log('[Anti-Cheat Guard] Blocked PrintScreen keyup.');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
      
      {/* 4. Wrapped Main Content */}
      <div style={{ width: '100%', height: '100%', filter: isObfuscated ? 'blur(20px)' : 'none', transition: 'filter 0.15s ease' }}>
        {children}
      </div>

      {/* 5. Blur Screen Obfuscation Overlay */}
      {isObfuscated && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          background: 'rgba(7, 10, 19, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f87171',
          textAlign: 'center',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>⚠️ Assessment Screen Obfuscated</h2>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '500px', lineHeight: 1.5 }}>
            Focus lost or tab switch detected. Focus back on the assessment window to continue. The proctoring system has logged this incident.
          </p>
        </div>
      )}

      {/* 6. Dynamic Non-Blocking Grid Watermarks */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '40px',
        padding: '20px',
        opacity: 0.12
      }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div 
            key={i} 
            style={{
              transform: 'rotate(-25deg)',
              color: '#00f2fe',
              fontSize: '0.8rem',
              fontWeight: 600,
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              userSelect: 'none'
            }}
          >
            SahAI Secured Assessment | User: {userId || 'unknown'} | {liveTimestamp}
          </div>
        ))}
      </div>

    </div>
  );
}
