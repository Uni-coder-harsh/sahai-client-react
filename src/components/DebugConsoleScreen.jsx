import React, { useState, useEffect, useRef } from 'react';
import { debugLogs, addLogListener } from '../services/api';
import { Terminal, Trash2, Download, Search, Settings, ShieldAlert, Cpu, Network, RefreshCw } from 'lucide-react';

export default function DebugConsoleScreen() {
  const [logs, setLogs] = useState([...debugLogs]);
  const [filterType, setFilterType] = useState('ALL');
  const [filterText, setFilterText] = useState('');
  const terminalEndRef = useRef(null);

  useEffect(() => {
    // Register listener for real-time logs
    const unsubscribe = addLogListener((newLog, currentLogs) => {
      setLogs([...currentLogs]);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Scroll to bottom when logs update
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const clearLogs = () => {
    debugLogs.length = 0;
    setLogs([]);
  };

  const downloadLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sahai_debug_logs_${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter(log => {
    const matchesType = filterType === 'ALL' || log.type === filterType;
    const matchesSearch = filterText === '' || 
      log.message.toLowerCase().includes(filterText.toLowerCase()) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(filterText.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getLogColor = (type) => {
    switch (type) {
      case 'API_REQUEST':
        return '#38bdf8'; // Sky blue
      case 'API_RESPONSE':
        return '#34d399'; // Emerald
      case 'ML_CLASSIFIER':
        return '#fbbf24'; // Amber (warning indicators)
      case 'BAYESIAN_UPDATE':
        return '#a78bfa'; // Purple
      case 'DAG_PROPAGATION':
        return '#f472b6'; // Pink
      case 'SYSTEM':
        return '#f87171'; // Red
      default:
        return '#9ca3af'; // Gray
    }
  };

  const getBadgeStyle = (type) => {
    return {
      fontSize: '0.75rem',
      fontWeight: 'bold',
      padding: '2px 8px',
      borderRadius: '4px',
      textTransform: 'uppercase',
      display: 'inline-block',
      color: '#fff',
      backgroundColor: getLogColor(type) + '30', // adding alpha transparency
      border: `1px solid ${getLogColor(type)}50`
    };
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal style={{ color: 'var(--primary)' }} />
            <span>Developer Real-Time Logs</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Trace machine learning inferences, Bayesian calculations, and network interactions.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={clearLogs} style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '40px' }}>
            <Trash2 size={16} />
            <span>Clear Logs</span>
          </button>
          <button className="btn btn-primary" onClick={downloadLogs} style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '40px' }}>
            <Download size={16} />
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        {/* Toggles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['ALL', 'API_REQUEST', 'API_RESPONSE', 'ML_CLASSIFIER', 'BAYESIAN_UPDATE', 'DAG_PROPAGATION', 'SYSTEM'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '6px',
                background: filterType === type ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                color: filterType === type ? '#fff' : 'var(--text-secondary)',
                border: filterType === type ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {type === 'ALL' ? 'Show All' : type.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Text Filter */}
        <div style={{ position: 'relative', width: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search payload text..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ paddingLeft: '36px', height: '36px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        style={{ 
          flex: '1', 
          background: '#090d16', 
          border: '1px solid var(--border-color)', 
          borderRadius: '12px', 
          overflowY: 'auto',
          padding: '20px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          lineHeight: '1.6',
          boxShadow: 'inset 0 4px 24px rgba(0,0,0,0.8)'
        }}
      >
        {filteredLogs.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
            <Cpu size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <span>Terminal Idle. Solicit code questions to trigger Bayesian updating sequences.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredLogs.map((log) => (
              <div 
                key={log.id} 
                style={{ 
                  borderLeft: `3px solid ${getLogColor(log.type)}`, 
                  paddingLeft: '14px',
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: '0 8px 8px 0',
                  padding: '10px 14px'
                }}
              >
                {/* Meta details line */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  
                  <span style={getBadgeStyle(log.type)}>
                    {log.type}
                  </span>

                  <span style={{ color: getLogColor(log.type), fontWeight: 'bold' }}>
                    {log.message}
                  </span>
                </div>

                {/* Optional nested details layout */}
                {log.details && (
                  <pre 
                    style={{ 
                      marginTop: '8px', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      background: 'rgba(0,0,0,0.4)', 
                      border: '1px solid rgba(255,255,255,0.03)',
                      color: '#a5b4fc', 
                      fontSize: '0.8rem', 
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all'
                    }}
                  >
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>

    </div>
  );
}
