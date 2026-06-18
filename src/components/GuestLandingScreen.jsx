import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Network, Activity, ShieldCheck, GraduationCap, Compass, BookOpen, AlertTriangle } from 'lucide-react';

export default function GuestLandingScreen() {
  const navigate = useNavigate();

  return (
    <div className="landing-container" style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 8%', borderBottom: '1px solid var(--border-color)', backdropFilter: 'blur(12px)', sticky: 'top', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={28} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            SahAI Core
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/login')} style={{ height: '40px', padding: '0 20px' }}>Log In</button>
          <button className="btn btn-primary" onClick={() => navigate('/signup')} style={{ height: '40px', padding: '0 20px' }}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ padding: '80px 8% 60px 8%', textAlign: 'center', position: 'relative' }}>
        {/* Decorative background glows */}
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(130px)', top: '10%', left: '10%', opacity: 0.15, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--secondary)', filter: 'blur(130px)', bottom: '10%', right: '10%', opacity: 0.15, pointerEvents: 'none' }} />

        <div className="badge badge-primary" style={{ display: 'inline-flex', gap: '8px', padding: '8px 16px', borderRadius: '30px', fontSize: '0.85rem', marginBottom: '24px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={14} /> Next-Generation Personalized Education Engine
        </div>

        <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', maxWidth: '900px', margin: '0 auto 24px auto', background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Real-Time Cognitive Science for Tier-3 College Classrooms
        </h1>

        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto 40px auto' }}>
          SahAI models student knowledge as a dynamic Bayesian Belief network, dynamically adapting learning paths and detecting syntax misconceptions through real-time code telemetry.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/signup')} style={{ height: '54px', padding: '0 32px', fontSize: '1.05rem', borderRadius: '30px' }}>
            <span>Start Free Evaluation</span>
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/login')} style={{ height: '54px', padding: '0 32px', fontSize: '1.05rem', borderRadius: '30px' }}>
            <span>Sign In to Classroom</span>
          </button>
        </div>
      </header>

      {/* Core Mathematical Architecture (Spiderweb Analogy) */}
      <section style={{ padding: '80px 8%', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>The Mathematical Spiderweb Analogy</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto' }}>
              Imagine the student's brain is a spiderweb covered in water droplets. Each intersection on the web is a subtopic concept (e.g., Loops or Strings).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>1. The Initial State</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Every subtopic (e.g. <code>Arithmetic Operators</code>) is represented as a <strong>Beta Distribution</strong> with priors $\alpha = 2$ (successes) and $\beta = 2$ (failures). Expected Mastery is:
                <div style={{ fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', margin: '12px 0', color: 'var(--primary)', textAlign: 'center', fontSize: '1rem', fontWeight: 600 }}>
                  E[K] = α / (α + β) = 50.0%
                </div>
                We do not assume arbitrary binary scores. Every student begins on a mathematically sound cognitive baseline.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Activity size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>2. Misconception Vectors</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                When a student answers incorrectly, it's not a simple zero. Options are audited for specific concept distractors.
                Choosing option A might trigger:
                <ul style={{ paddingLeft: '20px', margin: '10px 0', fontSize: '0.85rem' }}>
                  <li><code>Arithmetic Operators</code> (Weight: 0.85)</li>
                  <li><code>Variables Scope</code> (Weight: 0.35)</li>
                </ul>
                The math engine penalizes the beta parameter directly by this distractor weight: β_new = β_old + 0.85, dropping mastery to 41.2%.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Network size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>3. Asymmetric DAG Ripple</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Updating a node vibrates the web. If a student fails <code>Arithmetic</code>, there is a 65% probability (W_diag = 0.65) that their foundational <code>Type Conversion</code> is weak.
                We propagate a fraction of the failure penalty backward:
                <div style={{ fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', margin: '12px 0', color: '#ec4899', textAlign: 'center', fontSize: '0.85rem' }}>
                  Penalty = 0.85 × 0.65 = 0.5525
                </div>
                Foundational mastery drops to 43.9% automatically, without direct testing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Software 2.0 Telemetry Features */}
      <section style={{ padding: '80px 8%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div className="badge badge-accent" style={{ marginBottom: '16px' }}>Software 2.0 Telemetry</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px' }}>
              Keystroke-Level Behavioral Classifier
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Instead of just checking output correctness, SahAI monitors the code sandbox for raw developer behavioral metadata:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <GraduationCap style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Copy-Paste Cheat Detector</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pasting 50 characters in 1 second with 0 backspaces triggers a Copy-Paste classification. The math engine discounts the mastery reward by 90%.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Activity style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Shotgun Debugging Classification</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Spamming "Run Code" multiple times with tiny code changes flags guess patterns, applying a 50% penalty modifier to mastery growth.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Math Demo Card */}
          <div className="glass-card" style={{ padding: '36px', background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} style={{ color: 'var(--primary)' }} />
              <span>Mathematical Flow Visualizer</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>PRIMARY CONCEPT</span>
                  <span>Arithmetic Operators</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Expected Mastery E[K]</span>
                  <span style={{ color: 'var(--warning)' }}>50.0% → 41.2%</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--error)', marginTop: '4px' }}>
                  Updating distribution parameters: α = 2.0, β = 2.85 (+0.85 penalty)
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>PREREQUISITE RELATIONSHIP</span>
                  <span>Type Conversion (W_diag = 0.65)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Propagated Mastery E[K]</span>
                  <span style={{ color: 'var(--warning)' }}>50.0% → 43.9%</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--error)', marginTop: '4px' }}>
                  Propagated penalty to parent: β = 2.55 (+0.55 penalty)
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '8px', fontSize: '0.85rem', color: '#6ee7b7' }}>
                <strong>Hackathon Proof:</strong> This asymmetric Bayesian DAG propagation allows SahAI to model cognitive mastery across 100+ concepts with sub-millisecond database payloads, bypassing heavy neural network training costs.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '40px 8%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>© 2026 SahAI Core. Designed for hackathons, backed by mathematical cognitive diagnostics.</p>
      </footer>
    </div>
  );
}
