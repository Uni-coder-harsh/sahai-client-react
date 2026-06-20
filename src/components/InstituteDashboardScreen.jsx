import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  AlertTriangle, 
  ArrowLeft, 
  CheckCircle2, 
  Network, 
  BookOpen,
  Terminal,
  Activity
} from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';

export default function InstituteDashboardScreen() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([
    { id: 1, name: 'Dr. Ramesh Krishnan', email: 'ramesh.krishnan@cuk.ac.in', role: 'Faculty', date: '2026-06-20', approved: false },
    { id: 2, name: 'Prof. Sunita Verma', email: 'sunita.verma@cuk.ac.in', role: 'Faculty', date: '2026-06-20', approved: false },
    { id: 3, name: 'Dean Dr. VP Mishra', email: 'vpmishra.dean@cuk.ac.in', role: 'Dean', date: '2026-06-19', approved: false }
  ]);
  const [toastMessage, setToastMessage] = useState('');
  
  const handleApprove = (id, email) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, approved: true } : req));
    setToastMessage(`✅ Access approved. Faculty credentials activated for ${email}`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Setup mock graph data for Cohort Skill Mesh
  const graphData = {
    nodes: [
      { id: 'CS_PY_SYNTAX', name: 'Basic Syntax & Indentation', info: '88% Mastery', color: '#10b981', val: 15 },
      { id: 'CS_PY_VARIABLES', name: 'Variables & Types', info: '85% Mastery', color: '#10b981', val: 15 },
      { id: 'CS_PY_CONDITIONALS', name: 'Conditionals (if/else)', info: '80% Mastery', color: '#10b981', val: 15 },
      { id: 'CS_PY_LOOPS', name: 'Loops (for/while)', info: '61% Mastery', color: '#f59e0b', val: 18 },
      { id: 'CS_PY_FUNCTIONS', name: 'Functions & Scope', info: '58% Mastery', color: '#f59e0b', val: 18 },
      { id: 'CS_PY_LISTS', name: 'Lists & Tuples', info: '44% Mastery', color: '#ef4444', val: 22 },
      { id: 'CS_PY_DICTS', name: 'Dictionaries & Sets', info: '42% Mastery', color: '#ef4444', val: 22 },
      { id: 'CS_PY_FILE_IO', name: 'File Handling (I/O)', info: '35% Mastery', color: '#ef4444', val: 22 },
      { id: 'CS_PY_POINTERS', name: 'CS_PY_POINTERS (Pointers & Memory)', info: '70% Class Failure Rate', color: '#ef4444', val: 45, isCritical: true }
    ],
    links: [
      { source: 'CS_PY_SYNTAX', target: 'CS_PY_VARIABLES' },
      { source: 'CS_PY_VARIABLES', target: 'CS_PY_CONDITIONALS' },
      { source: 'CS_PY_CONDITIONALS', target: 'CS_PY_LOOPS' },
      { source: 'CS_PY_LOOPS', target: 'CS_PY_FUNCTIONS' },
      { source: 'CS_PY_FUNCTIONS', target: 'CS_PY_LISTS' },
      { source: 'CS_PY_LISTS', target: 'CS_PY_DICTS' },
      { source: 'CS_PY_DICTS', target: 'CS_PY_FILE_IO' },
      { source: 'CS_PY_FILE_IO', target: 'CS_PY_POINTERS' },
      { source: 'CS_PY_VARIABLES', target: 'CS_PY_POINTERS' }
    ]
  };

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'var(--text-primary)', padding: '30px 50px', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '30px',
          right: '30px',
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          zIndex: 10000,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <ArrowLeft size={16} />
            <span>Portal Exit</span>
          </button>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Central University of Karnataka
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              WORKSPACE: HEAD OF DEPARTMENT (Maths) | Prof. G.J. Reddy
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '8px 16px', borderRadius: '12px' }}>
          <ShieldCheck size={20} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tenant Domain Approved: @cuk.ac.in</span>
        </div>
      </header>

      {/* Aggregate Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0 }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Cohort Size</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>142 Students</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(20,184,166,0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0 }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Enrolled Faculty</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>12 Lecturers</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0 }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Avg Syllabus Mastery</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>64.8% Mean</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: 'var(--error)', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0 }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Critical Class Obstacle</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--error)' }}>CS_PY_POINTERS</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
        
        {/* Left Side: Pending Approvals & Security logic card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Component A: Pending Approvals */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Pending Access Requests</h2>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '12px 8px' }}>Faculty Name</th>
                    <th style={{ padding: '12px 8px' }}>Email Address</th>
                    <th style={{ padding: '12px 8px' }}>Role</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px 8px', fontWeight: 600 }}>{req.name}</td>
                      <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>{req.email}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: req.role === 'Dean' ? 'rgba(236,72,153,0.1)' : 'rgba(99,102,241,0.1)', color: req.role === 'Dean' ? '#ec4899' : 'var(--primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                          {req.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                        {req.approved ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
                            <CheckCircle2 size={16} />
                            <span>Approved</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApprove(req.id, req.email)}
                            style={{
                              background: '#10b981',
                              border: 'none',
                              color: '#fff',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                              transition: 'transform 0.1s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Task 3: Security Explanation Card */}
          <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.03) 0%, rgba(15,23,42,0.4) 100%)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', flexShrink: 0 }}>
                <Terminal size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  RBAC Whitelist Engine Logs
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                  <strong>Domain Whitelisting Active:</strong> The first registered user for <code>@cuk.ac.in</code> acts as SuperAdmin. Subsequent signups from this domain require SuperAdmin approval for Faculty/Dean access.
                </p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>[Status: SECURE]</span>
                  <span>[Gateway: Active]</span>
                  <span>[Policy: Strict Domain Auth]</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Component B (Cohort Skill Mesh Graph) */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '490px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Network size={22} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Aggregate Cohort Weaknesses</h2>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(239,68,68,0.1)', color: 'var(--error)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              CSE 2nd Year
            </span>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4, margin: '0 0 20px 0' }}>
            Interactive dependency visualization. Red nodes indicate severe class mastery failures. The diameter is proportional to concept friction parameters.
          </p>

          <div style={{ flex: 1, background: '#070709', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
            <ForceGraph2D
              graphData={graphData}
              width={460}
              height={320}
              backgroundColor="#070709"
              nodeColor={node => node.color}
              nodeVal={node => node.val}
              nodeLabel={node => `${node.name}: ${node.info}`}
              linkColor={() => 'rgba(255,255,255,0.06)'}
              linkWidth={1.5}
              cooldownTicks={100}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.id;
                const fontSize = 10 / globalScale;
                ctx.font = `${fontSize}px var(--font-mono)`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                // Draw outer glow for critical node
                if (node.isCritical) {
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 14, 0, 2 * Math.PI, false);
                  ctx.fillStyle = 'rgba(239,68,68,0.2)';
                  ctx.fill();
                  
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI, false);
                  ctx.fillStyle = 'rgba(239,68,68,0.6)';
                  ctx.fill();
                } else {
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
                  ctx.fillStyle = node.color;
                  ctx.fill();
                }

                // Node labels
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = node.isCritical ? '#ff6b6b' : 'rgba(255, 255, 255, 0.7)';
                ctx.fillText(label, node.x, node.y + (node.isCritical ? 18 : 10));
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
