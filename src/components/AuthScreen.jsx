import React, { useState } from 'react';
import { api } from '../services/api';
import { LogIn, UserPlus, Info, ShieldAlert } from 'lucide-react';

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Institution details
  const [institutionName, setInstitutionName] = useState('');
  const [institutionTier, setInstitutionTier] = useState('Tier-3');
  const [institutionRegion, setInstitutionRegion] = useState('');
  const [institutionState, setInstitutionState] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        if (!username || !password) {
          throw new Error('Please enter username/email and password.');
        }
        const data = await api.login({
          usernameOrEmail: username,
          password
        });
        onAuthSuccess(data.user);
      } else {
        if (!username || !name || !email || !password || !confirmPassword || !institutionName || !institutionRegion || !institutionState) {
          throw new Error('Please fill in all required fields, including college details.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        const data = await api.signup({
          username,
          name,
          email,
          password,
          confirmPassword,
          phoneNumber,
          institutionName,
          institutionTier,
          institutionRegion,
          institutionState
        });
        onAuthSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="glass-card auth-card animate-fade-in">
        <div className="glass-card-header" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            SahAI
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {isLogin ? 'Welcome back! Log in to continue learning.' : 'Create your account to start personalizing your cognitive state.'}
          </p>
        </div>

        <div className="glass-card-body">
          {error && (
            <div className="badge-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', lineHeight: 1.4 }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div style={{ borderTop: '1px dashed var(--border-color)', margin: '20px 0', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--primary)' }}>College Tenant Details</h4>
                  
                  <div className="form-group">
                    <label className="form-label">College / Institution Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. Model Engineering College"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Institution Resource Tier *</label>
                    <select
                      className="form-input"
                      value={institutionTier}
                      onChange={(e) => setInstitutionTier(e.target.value)}
                      style={{ height: '44px', background: 'var(--bg-dark)', color: '#fff', cursor: 'pointer' }}
                    >
                      <option value="Tier-1">Tier-1 (High Resource)</option>
                      <option value="Tier-2">Tier-2 (Medium Resource)</option>
                      <option value="Tier-3">Tier-3 (Low Resource)</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Region *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={institutionRegion}
                        onChange={(e) => setInstitutionRegion(e.target.value)}
                        placeholder="e.g. South"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={institutionState}
                        onChange={(e) => setInstitutionState(e.target.value)}
                        placeholder="e.g. Kerala"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">{isLogin ? 'Username or Email *' : 'Username *'}</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isLogin ? "username or email" : "john_doe"}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px', height: '48px' }}
              disabled={loading}
            >
              {loading ? (
                <span>Loading...</span>
              ) : isLogin ? (
                <>
                  <LogIn size={18} />
                  <span>Log In</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', padding: '0 4px' }}
              >
                {isLogin ? 'Register here' : 'Log in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
