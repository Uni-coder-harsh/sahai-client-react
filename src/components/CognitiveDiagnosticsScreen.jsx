import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  Activity, 
  ShieldAlert, 
  TrendingUp,
  Award,
  Terminal,
  BookOpen
} from 'lucide-react';

export default function CognitiveDiagnosticsScreen({ user }) {
  const [cognitiveState, setCognitiveState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDiagnostics = async () => {
    try {
      const data = await api.fetchCognitiveState(user.id);
      setCognitiveState(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load cognitive diagnostics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiagnostics();
  }, [user.id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const practicedConcepts = cognitiveState.filter(n => parseFloat(n.alpha) !== 2.0 || parseFloat(n.beta) !== 2.0);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity style={{ color: 'var(--primary)' }} />
            <span>Cognitive Diagnostics & Behavior Audit</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Keystroke-level telemetry audits, behavioral modifiers, and Bayesian Belief state parameters</p>
        </div>
      </div>

      {error && (
        <div className="badge-error" style={{ display: 'flex', padding: '12px', borderRadius: '10px', marginBottom: '24px' }}>
          <AlertTriangle size={18} style={{ marginRight: '8px' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left column: Active diagnostic distributions */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Sparkles size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Bayesian Topic Diagnostics</h2>
          </div>

          {practicedConcepts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <p style={{ margin: '0 0 12px 0' }}><strong>No active telemetry patterns logged yet.</strong></p>
              <p style={{ fontSize: '0.85rem' }}>Solve some MCQs in the Question Bank or compile scratchpad code blocks in the Sandbox. SahAI will audit your interaction latency and parameters to build dynamic updates here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                Each concepts' prior distribution is updated in real-time. Nodes below have active telemetry histories recorded:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {practicedConcepts.map(node => {
                  const alphaVal = parseFloat(node.alpha);
                  const betaVal = parseFloat(node.beta);
                  const isGuessing = (betaVal - Math.floor(betaVal) > 0.05);

                  return (
                    <div key={node.node_id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{node.concept_name}</span>
                        <span className={`badge ${parseFloat(node.expected_mastery) > 0.6 ? 'badge-success' : parseFloat(node.expected_mastery) > 0.45 ? 'badge-warning' : 'badge-error'}`}>
                          {(parseFloat(node.expected_mastery) * 100).toFixed(1)}% E[K]
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                        Alpha (Successes): {alphaVal.toFixed(3)} | Beta (Failures): {betaVal.toFixed(3)}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {betaVal > alphaVal && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--error)', background: 'rgba(239,68,68,0.05)', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={12} />
                            <span>Foundational gap detected</span>
                          </span>
                        )}
                        {isGuessing && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--warning)', background: 'rgba(245,158,11,0.05)', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <HelpCircle size={12} />
                            <span>Behavioral modifier applied</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Explanation of modifiers & recovery guidelines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Telemetry Explanations */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} style={{ color: 'var(--primary)' }} />
              <span>Behavior Compliance Codes</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>
              SahAI audits keystroke metadata and distractor selections to customize student learning rates. Guidelines for recovery:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--error)', marginBottom: '4px' }}>
                  Copy-Paste Plagiarism (50% penalty)
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', display: 'block' }}>
                  Inserting large code blocks under 1 second discounts alpha parameters to a 0.5 multiplier. Write your code sequentially to recover.
                </span>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--warning)', marginBottom: '4px' }}>
                  Shotgun Debugging (20% penalty)
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', display: 'block' }}>
                  Clicking "Run Code" multiple times under 15 seconds with minor adjustments applies a 0.8 learning rate modifier. Take your time before running.
                </span>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--error)', marginBottom: '4px' }}>
                  Blind Option Guessing (50% penalty)
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', display: 'block' }}>
                  Spamming multiple MCQ option changes under 3 seconds per try limits learning rate to 0.5 and scales distractor weights.
                </span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#10b981', marginBottom: '4px' }}>
                  Grit Reward Multiplier (1.2x bonus)
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', display: 'block' }}>
                  Resolving syntax errors manually and keeping typing velocities steady increases the alpha parameters, boosting expected mastery speeds.
                </span>
              </div>
            </div>
          </div>

          {/* DAG Ripple Explanations */}
          <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.03) 0%, rgba(15,23,42,0.4) 100%)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Network size={18} style={{ color: 'var(--primary)' }} />
              <span>Asymmetric DAG Propagation</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              The curriculum is structured as a prerequisite graph. When you submit telemetry for a concept (like pointers), updates ripple backwards. If you struggle, parent nodes (like syntax) are penalized, explaining why foundational topics may drop without direct testing.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
