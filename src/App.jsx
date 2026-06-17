import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { api, getBaseUrl } from './services/api';
import AuthScreen from './components/AuthScreen';
import PersonalizeScreen from './components/PersonalizeScreen';
import InitialTestScreen from './components/InitialTestScreen';
import DashboardScreen from './components/DashboardScreen';
import SkillMeshScreen from './components/SkillMeshScreen';
import FailureReportScreen from './components/FailureReportScreen';
import ProfileScreen from './components/ProfileScreen';
import GuestLandingScreen from './components/GuestLandingScreen';
import QuestionBankScreen from './components/QuestionBankScreen';
import DebugConsoleScreen from './components/DebugConsoleScreen';

import { 
  LayoutDashboard, 
  Network, 
  Code, 
  AlertOctagon, 
  User, 
  LogOut,
  Sparkles,
  BookOpen,
  Terminal
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Progression States
  const [needsPersonalization, setNeedsPersonalization] = useState(false);
  const [needsInitialTest, setNeedsInitialTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState('');

  // Restore session on mount
  useEffect(() => {
    // 0. Check API URL Config
    const url = getBaseUrl();
    if (!url) {
      setConfigError(true);
      setLoading(false);
      return;
    }

    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        api.setToken(savedToken);
        
        // Check progression requirements
        checkProgression(parsedUser);
      } catch (e) {
        console.error("Session restore error:", e);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const checkProgression = (usr) => {
    if (!usr.academic_stream) {
      setNeedsPersonalization(true);
      setNeedsInitialTest(false);
    } else {
      setNeedsPersonalization(false);
      // Check if diagnostic test completed in local storage
      const completed = localStorage.getItem(`initial_test_complete_${usr.id}`);
      setNeedsInitialTest(!completed);
    }
    setLoading(false);
  };

  const handleAuthSuccess = (loggedUser) => {
    setUser(loggedUser);
    setToken(api.token);
    localStorage.setItem('auth_user', JSON.stringify(loggedUser));
    checkProgression(loggedUser);
    
    // Auto redirect based on gates
    if (!loggedUser.academic_stream) {
      navigate('/personalize');
    } else {
      const completed = localStorage.getItem(`initial_test_complete_${loggedUser.id}`);
      if (!completed) {
        navigate('/initial-test');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handlePersonalizeSuccess = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    setNeedsPersonalization(false);
    setNeedsInitialTest(true);
    navigate('/initial-test');
  };

  const handleTestComplete = () => {
    localStorage.setItem(`initial_test_complete_${user.id}`, 'true');
    setNeedsInitialTest(false);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    api.setToken(null);
    setUser(null);
    setToken(null);
    setNeedsPersonalization(false);
    setNeedsInitialTest(false);
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // 0. Configuration Error Gate (Localhost Fallback Disabled)
  if (configError) {
    return (
      <div className="auth-bg" style={{ display: 'flex', alignItems: 'center', justify: 'center', minHeight: '100vh', padding: '20px', background: 'var(--bg-dark)' }}>
        <div className="glass-card animate-fade-in" style={{ maxWidth: '500px', width: '100%' }}>
          <div className="glass-card-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertOctagon size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>API Gateway Required</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Localhost Fallback Disabled</span>
            </div>
          </div>
          <div className="glass-card-body">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              A valid backend API endpoint is required to sync machine learning weights and cognitive state distributions. No production URL was injected during build time, and automatic localhost fallback is disabled.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (customApiUrl.trim()) {
                localStorage.setItem('custom_api_url', customApiUrl.trim());
                setConfigError(false);
                window.location.reload();
              }
            }}>
              <div className="form-group">
                <label className="form-label">Configure API Gateway URL *</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="e.g. https://api-service.up.railway.app/api"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px', marginTop: '8px' }}>
                Save Configuration & Connect
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Determine active tab highlighted in sidebar
  const activeTab = location.pathname.substring(1) || 'dashboard';

  // Guest route wrapper: Redirect to dashboard if logged in
  const renderGuestRoute = (element) => {
    if (user) {
      if (needsPersonalization) return <Navigate to="/personalize" replace />;
      if (needsInitialTest) return <Navigate to="/initial-test" replace />;
      return <Navigate to="/dashboard" replace />;
    }
    return element;
  };

  // Private route wrapper: Redirect to login if not logged in, enforce personalization gates
  const renderPrivateRoute = (element) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    // Enforce Onboarding Gates
    if (needsPersonalization) {
      if (location.pathname !== '/personalize') {
        return <Navigate to="/personalize" replace />;
      }
    } else if (needsInitialTest) {
      if (location.pathname !== '/initial-test') {
        return <Navigate to="/initial-test" replace />;
      }
    } else {
      // Block accessing onboarding gates once completed
      if (location.pathname === '/personalize' || location.pathname === '/initial-test') {
        return <Navigate to="/dashboard" replace />;
      }
    }

    return (
      <div className="app-container">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          {/* Brand details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px 24px 8px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <Sparkles size={24} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              SahAI Core
            </span>
          </div>

          {/* User preview */}
          <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
              {user.name ? user.name[0].toUpperCase() : user.username[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user.name || user.username}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user.academic_stream || 'Student'}
              </div>
            </div>
          </div>

          {/* Navigation list */}
          <nav className="nav-menu">
            <button
              onClick={() => navigate('/dashboard')}
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textTransform: 'none', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => navigate('/qbank')}
              className={`nav-link ${activeTab === 'qbank' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textTransform: 'none', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <BookOpen size={18} />
              <span>Question Bank</span>
            </button>

            <button
              onClick={() => navigate('/mesh')}
              className={`nav-link ${activeTab === 'mesh' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textTransform: 'none', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <Network size={18} />
              <span>Skill Mesh</span>
            </button>

            <button
              onClick={() => navigate('/failures')}
              className={`nav-link ${activeTab === 'failures' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textTransform: 'none', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <AlertOctagon size={18} />
              <span>Failure Logs</span>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textTransform: 'none', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => navigate('/logs')}
              className={`nav-link ${activeTab === 'logs' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textTransform: 'none', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <Terminal size={18} />
              <span>Debug Console</span>
            </button>
          </nav>

          {/* Quick logout button at bottom */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: 'auto' }}>
            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'none', border: 'none', color: '#f87171', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace Contents */}
        <main className="main-content">
          {element}
        </main>
      </div>
    );
  };

  return (
    <Routes>
      {/* Guest Routes */}
      <Route path="/" element={renderGuestRoute(<GuestLandingScreen />)} />
      <Route path="/login" element={renderGuestRoute(<AuthScreen onAuthSuccess={handleAuthSuccess} />)} />
      <Route path="/signup" element={renderGuestRoute(<AuthScreen onAuthSuccess={handleAuthSuccess} />)} />
      
      {/* Onboarding gates */}
      <Route path="/personalize" element={user && needsPersonalization ? (
        <PersonalizeScreen user={user} onPersonalizeSuccess={handlePersonalizeSuccess} />
      ) : (
        <Navigate to="/dashboard" replace />
      )} />
      
      <Route path="/initial-test" element={user && needsInitialTest ? (
        <InitialTestScreen user={user} onTestComplete={handleTestComplete} />
      ) : (
        <Navigate to="/dashboard" replace />
      )} />

      {/* Private App Routes */}
      <Route path="/dashboard" element={renderPrivateRoute(<DashboardScreen user={user} onTabChange={(tab) => navigate(`/${tab}`)} />)} />
      <Route path="/qbank" element={renderPrivateRoute(<QuestionBankScreen user={user} />)} />
      <Route path="/mesh" element={renderPrivateRoute(<SkillMeshScreen user={user} />)} />
      <Route path="/failures" element={renderPrivateRoute(<FailureReportScreen user={user} />)} />
      <Route path="/profile" element={renderPrivateRoute(<ProfileScreen user={user} onLogout={handleLogout} />)} />
      <Route path="/logs" element={renderPrivateRoute(<DebugConsoleScreen />)} />

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
