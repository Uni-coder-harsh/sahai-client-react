import React from 'react';
import { BrainCircuit, Cpu, AlertTriangle, Terminal, MessageSquareCode } from 'lucide-react';

export default function GemmaAgentHUD({ isLoading, agentLogs = [], diagnosticData }) {
  return (
    <div className="glass-card animate-fade-in" style={{
      background: 'rgba(6, 11, 25, 0.65)',
      border: '1px solid rgba(0, 242, 254, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(0, 242, 254, 0.05)',
      borderRadius: '16px',
      padding: '24px',
      marginTop: '24px',
      fontFamily: "Inter, sans-serif"
    }}>
      {/* Header Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 242, 254, 0.1)', paddingBottom: '14px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: isLoading ? 'rgba(168, 85, 247, 0.15)' : 'rgba(0, 242, 254, 0.15)',
            border: isLoading ? '1px solid var(--accent)' : '1px solid var(--primary)',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isLoading ? 'pulse 2s infinite' : 'none'
          }}>
            <BrainCircuit size={20} style={{ color: isLoading ? '#a855f7' : '#00f2fe' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Gemma 4 Orchestrator HUD</span>
              {isLoading && <span style={{ fontSize: '0.7rem', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>THINKING</span>}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>vLLM Autonomous Diagnostic Agent Loop</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
          <Cpu size={14} style={{ color: '#64748b' }} />
          <span>gemma-4-26b-it</span>
        </div>
      </div>

      {/* Thinking State Loader */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ border: '2px solid rgba(0, 242, 254, 0.1)', borderTop: '2px solid #00f2fe', borderRadius: '50%', width: '20px', height: '20px', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500, letterSpacing: '0.02em' }}>Reasoning & Planning tool selection paths...</span>
          </div>
          
          {/* Logs console */}
          <div className="custom-scrollbar" style={{
            background: '#04060c',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '10px',
            padding: '14px',
            maxHeight: '150px',
            overflowY: 'auto',
            fontFamily: "'Fira Code', monospace",
            fontSize: '0.75rem',
            color: '#a78bfa'
          }}>
            {agentLogs.length === 0 ? (
              <div style={{ color: '#475569' }}>&gt; Initializing reasoning loop context...</div>
            ) : (
              agentLogs.map((log, index) => (
                <div key={index} style={{ marginBottom: '6px', lineHeight: 1.4 }}>
                  <span style={{ color: '#00f2fe', marginRight: '8px' }}>&gt;</span>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Socratic Diagnostics Outcome */}
      {!isLoading && diagnosticData && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Misconception Alert Card */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertTriangle size={18} style={{ color: '#ef4444' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#f87171', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Misconception Pattern Flagged</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', marginTop: '2px' }}>{diagnosticData.detected_misconception || 'Logical execution discrepancy'}</div>
            </div>
          </div>

          {/* Socratic Hints Split Column view */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="sandbox-grid">
            
            {/* English Hint */}
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.03)',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                <MessageSquareCode size={14} style={{ color: '#00f2fe' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>English Prompt</span>
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#cbd5e1', margin: 0, whiteSpace: 'pre-wrap' }}>
                {diagnosticData.socratic_hint_en || 'Please review your loop boundary variables.'}
              </p>
            </div>

            {/* Hindi Hint */}
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.03)',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                <MessageSquareCode size={14} style={{ color: '#a855f7' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>सॉक्रेटिक संकेत (Hindi)</span>
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#cbd5e1', margin: 0, whiteSpace: 'pre-wrap' }}>
                {diagnosticData.socratic_hint_hi || 'Loop control variables par ek baar dhyan dein.'}
              </p>
            </div>

          </div>

          {/* Lower HUD stats */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.03)',
            borderRadius: '10px',
            padding: '10px 16px',
            fontSize: '0.75rem',
            color: '#64748b',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Root Cause: <strong style={{ color: '#cbd5e1' }}>{diagnosticData.root_cause_node || '--'}</strong></span>
              <span>Next Topic: <strong style={{ color: '#cbd5e1' }}>{diagnosticData.recommended_next_node || '--'}</strong></span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace' }}>
              <Terminal size={12} />
              <span>Tools: {diagnosticData.tools_executed?.length > 0 ? diagnosticData.tools_executed.join(', ') : 'none'}</span>
            </div>
          </div>

        </div>
      )}

      {/* Idle / Uninitialized state */}
      {!isLoading && !diagnosticData && (
        <div style={{ textAlign: 'center', padding: '16px 0', color: '#64748b', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Terminal size={14} />
          <span>Gemma Orchestrator telemetry scanner idle. Execute code or submit notes to compile agent reports.</span>
        </div>
      )}

    </div>
  );
}
