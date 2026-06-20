import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  Activity, 
  Terminal,
  Network
} from 'lucide-react';
import { SkillPassport, MasteryTrajectoryChart, HistoryRepairList } from './InteractiveRepairHub';

export default function CognitiveDiagnosticsScreen({ user }) {
  const [cognitiveState, setCognitiveState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected concept details state
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeHistory, setNodeHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadDiagnostics = async () => {
    try {
      const data = await api.fetchCognitiveState(user.id);
      setCognitiveState(data);
      
      // Auto-select the first concept that has been practiced, or fallback to first concept
      const practiced = data.filter(n => parseFloat(n.alpha) !== 2.0 || parseFloat(n.beta) !== 2.0);
      if (practiced.length > 0) {
        setSelectedNode(practiced[0]);
      } else if (data.length > 0) {
        setSelectedNode(data[0]);
      }
      
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load cognitive diagnostics.');
    } finally {
      setLoading(false);
    }
  };

  const loadNodeHistory = async (nodeId) => {
    setLoadingHistory(true);
    try {
      const res = await api.fetchStudentNodeHistory(user.id, nodeId);
      if (res.success) {
        setNodeHistory(res.history);
      }
    } catch (err) {
      console.error('Failed to load student node trajectory history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadDiagnostics();
  }, [user.id]);

  // Load history whenever selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      loadNodeHistory(selectedNode.node_id);
    }
  }, [selectedNode]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #00F0FF', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const practicedConcepts = cognitiveState.filter(n => parseFloat(n.alpha) !== 2.0 || parseFloat(n.beta) !== 2.0);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Skill Passport Header */}
      <SkillPassport user={user} cognitiveState={cognitiveState} />

      {/* Main Grid Layout */}
      <div className="responsive-grid-12-1" style={{ marginTop: '24px' }}>
        
        {/* Left Column: List of Practiced/Selectable Concepts */}
        <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Sparkles size={20} style={{ color: '#00F0FF' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Bayesian Belief Index</h2>
          </div>

          {cognitiveState.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <p style={{ margin: '0 0 12px 0' }}><strong>No active telemetry patterns logged yet.</strong></p>
              <p style={{ fontSize: '0.85rem' }}>Solve some MCQs in the Question Bank or compile scratchpad code blocks in the Sandbox. SahAI will audit your interaction latency and parameters to build dynamic updates here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', margin: '0 0 8px 0' }}>
                Select a concept node below to examine its time-series trajectory and review tutor recovery logs:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cognitiveState.map(node => {
                  const isSelected = selectedNode?.node_id === node.node_id;
                  const alphaVal = parseFloat(node.alpha);
                  const betaVal = parseFloat(node.beta);
                  const isGuessing = (betaVal - Math.floor(betaVal) > 0.05);

                  return (
                    <div 
                      key={node.node_id} 
                      onClick={() => setSelectedNode(node)}
                      style={{ 
                        background: isSelected ? 'rgba(0, 240, 255, 0.06)' : 'rgba(255,255,255,0.01)', 
                        border: isSelected ? '1px solid #00F0FF' : '1px solid var(--border-color)', 
                        padding: '16px', 
                        borderRadius: '12px',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 0 15px rgba(0, 240, 255, 0.15)' : 'none',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? '#00F0FF' : '#fff' }}>{node.concept_name}</span>
                        <span className={`badge ${parseFloat(node.expected_mastery) > 0.6 ? 'badge-success' : parseFloat(node.expected_mastery) > 0.45 ? 'badge-warning' : 'badge-error'}`}>
                          {(parseFloat(node.expected_mastery) * 100).toFixed(0)}% E[K]
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        Success Vector [α: {alphaVal.toFixed(2)}, β: {betaVal.toFixed(2)}]
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Interactive Repair Panel for Selected Concept */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {selectedNode ? (
            <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    {selectedNode.concept_name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#00F0FF', fontFamily: 'var(--font-mono)', marginTop: '4px', display: 'block' }}>
                    Node Address: {selectedNode.node_id}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Current Mastery</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: parseFloat(selectedNode.expected_mastery) >= 0.6 ? 'var(--success)' : '#FF4500' }}>
                    {(parseFloat(selectedNode.expected_mastery) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {loadingHistory ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                  <div style={{ border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #00F0FF', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Trajectory Recharts Graph */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                      Mastery Trajectory
                    </h4>
                    <MasteryTrajectoryChart historyData={nodeHistory} />
                  </div>

                  {/* Accordion History Repair List */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                      Interactive Repair Logs
                    </h4>
                    <HistoryRepairList 
                      history={nodeHistory} 
                      conceptNode={selectedNode} 
                      onPracticeClick={() => window.location.href = '/qbank'}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>Select a concept node on the left index to inspect its time-series trajectory and cognitive logs.</p>
            </div>
          )}

          {/* BehaviorCompliance Details */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} style={{ color: '#00F0FF' }} />
              <span>Keystroke & Option Telemetry Compliance</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <strong style={{ color: '#ef4444' }}>Copy-Paste Plagiarism (Mastery Penalty 90%)</strong>
                <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>Inserting blocks of code under 1 second will flag plagiarism checks, capping mastery rewards.</p>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <strong style={{ color: '#f59e0b' }}>Shotgun Debugging (Mastery Penalty 50%)</strong>
                <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>Compiling script iterations rapidly with minimal keystrokes scales down Bayesian alphas.</p>
              </div>
              <div>
                <strong style={{ color: '#ef4444' }}>Blind Option Guessing (Mastery Penalty 90%)</strong>
                <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>Spamming distractor selections inside 3 seconds triggers distractor parameter locks.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
