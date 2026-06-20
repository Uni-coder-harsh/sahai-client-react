import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Network, 
  Activity, 
  ShieldCheck, 
  GraduationCap, 
  Compass, 
  BookOpen, 
  AlertTriangle,
  Terminal,
  Code,
  Users
} from 'lucide-react';

export default function GuestLandingScreen() {
  const navigate = useNavigate();

  return (
    <div className="landing-container" style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>
      
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 8%', borderBottom: '1px solid var(--border-color)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10, 10, 12, 0.75)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={28} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            SahAI Core
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/institute/dashboard')} 
            style={{ height: '40px', padding: '0 16px', fontSize: '0.85rem', color: 'var(--primary)', borderColor: 'rgba(0, 240, 255, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ShieldCheck size={16} />
            <span>Institute Portal</span>
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/login')} style={{ height: '40px', padding: '0 20px', fontSize: '0.85rem' }}>Log In</button>
          <button className="btn btn-primary" onClick={() => navigate('/signup')} style={{ height: '40px', padding: '0 20px', fontSize: '0.85rem' }}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ padding: '90px 8% 70px 8%', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(130px)', top: '10%', left: '10%', opacity: 0.12, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--secondary)', filter: 'blur(130px)', bottom: '10%', right: '10%', opacity: 0.12, pointerEvents: 'none' }} />

        <div className="badge badge-primary" style={{ display: 'inline-flex', gap: '8px', padding: '8px 16px', borderRadius: '30px', fontSize: '0.85rem', marginBottom: '24px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={14} /> B2B2C Educational Data Mining & Multi-Tenant RBAC
        </div>

        <h1 style={{ fontSize: '3.6rem', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', maxWidth: '1000px', margin: '0 auto 24px auto', background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Dynamic Bayesian Modeling & Multi-Tenant Access for Colleges
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '780px', margin: '0 auto 40px auto' }}>
          SahAI maps student cognitive states using real-time code sandbox telemetry and handwriting OCR grading, while providing administrators and faculty with domain-whitelisted analytics to audit entire academic cohorts.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/signup')} style={{ height: '54px', padding: '0 28px', fontSize: '0.95rem', borderRadius: '30px' }}>
            <span>Start Free Evaluation</span>
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/login')} style={{ height: '54px', padding: '0 28px', fontSize: '0.95rem', borderRadius: '30px' }}>
            <span>Student Sign In</span>
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/institute/dashboard')} 
            style={{ height: '54px', padding: '0 28px', fontSize: '0.95rem', borderRadius: '30px', borderColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
            <span>Institute Portal (Admin/Faculty)</span>
          </button>
        </div>
      </header>

      {/* Simplified Student & Institute Dual Platform Overview */}
      <section style={{ padding: '60px 8%', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px' }}>Dual-Purpose Academic Platform</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto' }}>
              SahAI acts as both a personalized cognitive workspace for individual students and an enterprise oversight center for university administrators and deans.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
            
            {/* Aspect 1: The Student Experience */}
            <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(0, 240, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0, 240, 255, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <GraduationCap size={20} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>For Students: Adaptive Workspaces</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Students interact with a real-time responsive curriculum and submit coding tasks that continuously refine their personalized cognitive mastery profiles.
              </p>
              
              <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Compass size={16} style={{ color: 'var(--primary)', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Timed Diagnostic Test</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Evaluates students at onboarding to bootstrap prior distributions mathematically.</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Code size={16} style={{ color: 'var(--primary)', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Keystroke-Audited IDE Sandbox</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>An embedded scratchpad that runs compilation checks and monitors behavior metrics.</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Network size={16} style={{ color: 'var(--primary)', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Interactive Skill Mesh</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>A 3D visualization showing concept nodes, average mastery, and prerequisite dependency lines.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Aspect 2: The Institute Administration Portal */}
            <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <ShieldCheck size={20} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>For Institutions: Multi-Tenant RBAC</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                University deans and department heads access whitelisted administrative tools to manage access requests and view cohort weaknesses.
              </p>

              <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Users size={16} style={{ color: '#10b981', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Domain Whitelisting Security</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>The first user to register under an institutional domain (e.g., @cuk.ac.in) acts as SuperAdmin.</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={16} style={{ color: '#10b981', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Faculty Approval Queues</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subsequent faculty or dean signups require approval from the SuperAdmin to restrict access.</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Activity size={16} style={{ color: '#10b981', marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Cohort Weakness Visualizers</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Aggregated force-directed graphs highlighting critical topic struggles (e.g. pointer errors).</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Core Mathematical Science Made Simple */}
      <section style={{ padding: '80px 8%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px' }}>Cognitive Science Simplified</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            SahAI does not measure student knowledge as simple binary grades. Every topic (e.g., Loops or Pointers) is represented as a dynamic probability distribution.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '16px' }}>
              <Compass size={20} />
            </div>
            <h4 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '10px' }}>Prior Beta Distributions</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Priors begin as standard curves centered at 50% mastery. Correct answers add positive evidence, shifting mastery upwards. Incorrect answers add negative evidence, lowering it.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(20, 184, 166, 0.08)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '16px' }}>
              <AlertTriangle size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <h4 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '10px' }}>Misconception Weights</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Instead of simple penalties, wrong MCQ selections are mapped to specific misunderstandings (distractors), updating corresponding foundation concept parameters in the DB.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.08)', color: '#ec4899', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '16px' }}>
              <Network size={20} />
            </div>
            <h4 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '10px' }}>Asymmetric DAG Propagation</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Topics are linked in a Directed Acyclic Graph. A failure in a complex concept automatically ripples back to decrease mastery in prerequisite nodes, avoiding blind spots.
            </p>
          </div>

        </div>
      </section>

      {/* Keystroke Telemetry & Code Audits */}
      <section style={{ padding: '80px 8%', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div className="badge badge-accent" style={{ marginBottom: '16px' }}>ML Telemetry Engine</div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px' }}>
              Keystroke-Level Behavioral Audits
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Our sandbox records keyboard latency, paste rates, and code compiles. Machine learning models classify student behavior in real-time:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <ShieldCheck size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 4px 0' }}>Copy-Paste Detection</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Rapid inserts of large code blocks with minimal backspaces discount cognitive mastery rewards by 90% due to plagiarised input.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Activity size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 4px 0' }}>Shotgun Debugging Classification</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Rapidly repeating compiles with minor adjustments triggers a shotgun guess pattern classification, penalizing learning rates to 0.5.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Flow visualizer */}
          <div className="glass-card" style={{ padding: '36px', background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} style={{ color: 'var(--primary)' }} />
              <span>Real-Time Bayesian Parameters</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>EVALUATION TARGET</span>
                  <span>Variables & Pointers</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Expected Mastery E[K]</span>
                  <span style={{ color: 'var(--warning)' }}>50.0% → 41.2%</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--error)', marginTop: '4px' }}>
                  Updated params: α = 2.0, β = 2.85 (+0.85 penalty)
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>DAG PROPAGATED EDGE</span>
                  <span>Basic Indentation (W_diag = 0.65)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Prerequisite Mastery E[K]</span>
                  <span style={{ color: 'var(--warning)' }}>50.0% → 43.9%</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--error)', marginTop: '4px' }}>
                  Propagated penalty to parent: β = 2.55 (+0.55 penalty)
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '8px', fontSize: '0.85rem', color: '#6ee7b7' }}>
                <strong>Zero-Cold Start:</strong> Bayesian graphs adapt student profiles within sub-milliseconds using local updates without needing expensive network execution pipelines.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '40px 8%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>© 2026 SahAI Core. Educational Data Mining & Multi-Tenant Administration Platform.</p>
      </footer>
    </div>
  );
}
