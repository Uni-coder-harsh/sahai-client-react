import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  User, 
  LogOut, 
  Globe, 
  Check, 
  GraduationCap, 
  Link2, 
  Edit3, 
  Save, 
  X, 
  Building2, 
  BookOpen, 
  Database,
  Camera
} from 'lucide-react';

const PRESETS_AVATARS = [
  { id: 'avatar_coder', label: 'Student Coder', emoji: '💻' },
  { id: 'avatar_ai', label: 'AI Wizard', emoji: '🧙‍♂️' },
  { id: 'avatar_scientist', label: 'Science Guru', emoji: '🔬' },
  { id: 'avatar_math', label: 'Math Genius', emoji: '📐' },
  { id: 'avatar_hacker', label: 'Cyber Ninja', emoji: '🥷' },
  { id: 'avatar_grad', label: 'Scholar Cap', emoji: '🎓' }
];

export default function ProfileScreen({ user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Custom API URL config
  const [customUrl, setCustomUrl] = useState('');
  const [urlSuccess, setUrlSuccess] = useState(false);

  // Editable Form fields
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [academicStream, setAcademicStream] = useState('');
  const [currentSemester, setCurrentSemester] = useState('1');
  const [graduationYear, setGraduationYear] = useState('2027');
  const [currentCgpa, setCurrentCgpa] = useState('');
  const [stateOfResidence, setStateOfResidence] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('en');
  
  // Institution fields
  const [instName, setInstName] = useState('');
  const [instTier, setInstTier] = useState('Tier-3');
  const [instRegion, setInstRegion] = useState('');
  const [instState, setInstState] = useState('');

  // Target syllabus / GATE
  const [targetingGate, setTargetingGate] = useState(false);
  const [gatePaper1, setGatePaper1] = useState('');
  const [gatePaper2, setGatePaper2] = useState('');
  const [syllabusReferral, setSyllabusReferral] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar_coder');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.fetchUserProfile(user.id);
      setProfile(data);
      
      // Populate fields
      setName(data.name || '');
      setPhoneNumber(data.phone_number || '');
      setAcademicStream(data.academic_stream || 'B.Tech CSE');
      setCurrentSemester(String(data.current_semester || 1));
      setGraduationYear(String(data.graduation_year || 2027));
      setCurrentCgpa(data.current_cgpa ? String(data.current_cgpa) : '');
      setStateOfResidence(data.state_of_residence || '');
      setPrimaryLanguage(data.primary_language || 'en');
      
      setInstName(data.institution_name || '');
      setInstTier(data.institution_tier || 'Tier-3');
      setInstRegion(data.institution_region || '');
      setInstState(data.institution_state || '');

      const extra = data.device_signature || {};
      setTargetingGate(extra.targeting_gate || false);
      setGatePaper1(extra.gate_paper_1 || '');
      setGatePaper2(extra.gate_paper_2 || '');
      setSyllabusReferral(extra.syllabus_referral || '');
      setSelectedAvatar(extra.avatar || 'avatar_coder');
      setCustomPhotoUrl(extra.custom_photo_url || '');

    } catch (err) {
      console.error('Failed to load user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    setCustomUrl(localStorage.getItem('custom_api_url') || '');
  }, [user.id]);

  const handleSaveUrl = (e) => {
    e.preventDefault();
    setUrlSuccess(false);
    if (customUrl.trim()) {
      localStorage.setItem('custom_api_url', customUrl.trim());
    } else {
      localStorage.removeItem('custom_api_url');
    }
    setUrlSuccess(true);
    setTimeout(() => {
      setUrlSuccess(false);
      window.location.reload();
    }, 1500);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess(false);

    const payload = {
      name: name.trim() || null,
      phone_number: phoneNumber.trim() || null,
      academic_stream: academicStream.trim() || null,
      current_semester: currentSemester ? parseInt(currentSemester, 10) : null,
      graduation_year: graduationYear ? parseInt(graduationYear, 10) : null,
      current_cgpa: currentCgpa ? parseFloat(currentCgpa) : null,
      state_of_residence: stateOfResidence.trim() || null,
      primary_language: primaryLanguage.trim() || null,
      
      // Institution
      institution_name: instName.trim() || null,
      institution_tier: instTier,
      institution_region: instRegion.trim() || null,
      institution_state: instState.trim() || null,

      // Extra settings
      targeting_gate: targetingGate,
      gate_paper_1: gatePaper1.trim() || null,
      gate_paper_2: gatePaper2.trim() || null,
      syllabus_referral: syllabusReferral.trim() || null,
      avatar: selectedAvatar,
      custom_photo_url: customPhotoUrl.trim() || null
    };

    try {
      await api.updateUserProfile(user.id, payload);
      setSaveSuccess(true);
      setEditMode(false);
      
      // Update local storage representation
      const savedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const updatedUser = { 
        ...savedUser, 
        name: name.trim() || savedUser.name,
        academic_stream: academicStream.trim() || savedUser.academic_stream,
        current_semester: currentSemester ? parseInt(currentSemester, 10) : savedUser.current_semester
      };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      await fetchProfile();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update profile details.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // Find active avatar
  const activeAvatarObj = PRESETS_AVATARS.find(a => a.id === selectedAvatar) || PRESETS_AVATARS[0];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User style={{ color: 'var(--primary)' }} />
            <span>Manage Student Profile</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Configure academic streams, targets, tenant institutions, and core avatars.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!editMode ? (
            <button className="btn btn-primary" onClick={() => setEditMode(true)} style={{ height: '40px' }}>
              <Edit3 size={16} />
              <span>Customize Profile</span>
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => setEditMode(false)} style={{ height: '40px' }}>
              <X size={16} />
              <span>Cancel</span>
            </button>
          )}
          <button className="btn btn-secondary" onClick={onLogout} style={{ height: '40px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}>
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="badge-success animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px', borderRadius: '10px', marginBottom: '24px', fontWeight: 600 }}>
          <Check size={18} />
          <span>Profile configuration updated and Redis caches synchronized successfully!</span>
        </div>
      )}

      {/* Main Profile Layout */}
      <form onSubmit={handleUpdateProfile}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: Avatar & Custom Photo Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Visual Avatar Card */}
            <div className="glass-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 16px auto', boxShadow: '0 8px 20px rgba(99,102,241,0.2)', border: '2px solid rgba(255,255,255,0.1)' }}>
                {customPhotoUrl ? (
                  <img 
                    src={customPhotoUrl} 
                    alt="Custom Avatar" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }} 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{activeAvatarObj.emoji}</span>
                )}
                {editMode && (
                  <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--accent)', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-dark)' }} title="Edit Photo">
                    <Camera size={14} />
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{name || profile?.username}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tenant Student ID: #{profile?.id}</span>

              {/* Avatar choices if in edit mode */}
              {editMode && (
                <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'left' }}>
                  <label className="form-label">Select Avatar Preset</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
                    {PRESETS_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: selectedAvatar === av.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.01)',
                          border: selectedAvatar === av.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                          fontSize: '1.3rem',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                        title={av.label}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>

                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <label className="form-label">Custom Profile Pic URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Architecture Tip Card */}
            <div className="glass-card" style={{ background: 'rgba(20, 184, 166, 0.03)', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem' }}>
                <Database size={16} />
                <span>MNC-grade Storage Audit</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                <strong>Best Practice:</strong> Profile pictures should be managed via cloud-native Object buckets (such as AWS S3 or Supabase Storage API) rather than binary blobs in MongoDB/PostgreSQL. Storing CDN URL references minimizes operational latencies.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Edit Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Academic & Personal card */}
            <div className="glass-card">
              <div className="glass-card-header" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Academic Profile Credentials</h3>
              </div>
              
              <div className="glass-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {editMode ? (
                  // EDIT MODE FORM FIELDS
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. John Doe"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="text"
                          className="form-input"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g. +91 99999 99999"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Degree Course (academic stream)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={academicStream}
                          onChange={(e) => setAcademicStream(e.target.value)}
                          placeholder="e.g. B.Tech CSE"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Current Semester</label>
                        <select
                          className="form-input"
                          value={currentSemester}
                          onChange={(e) => setCurrentSemester(e.target.value)}
                          style={{ height: '44px', background: 'var(--bg-card)', color: '#fff', cursor: 'pointer' }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={String(sem)}>Semester {sem}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Graduation Year</label>
                        <input
                          type="number"
                          className="form-input"
                          value={graduationYear}
                          onChange={(e) => setGraduationYear(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Current CGPA</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          className="form-input"
                          value={currentCgpa}
                          onChange={(e) => setCurrentCgpa(e.target.value)}
                          placeholder="e.g. 8.75"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">State of Residence</label>
                        <input
                          type="text"
                          className="form-input"
                          value={stateOfResidence}
                          onChange={(e) => setStateOfResidence(e.target.value)}
                          placeholder="e.g. Maharashtra"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Primary Language</label>
                        <input
                          type="text"
                          className="form-input"
                          value={primaryLanguage}
                          onChange={(e) => setPrimaryLanguage(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  // VIEW MODE FORM FIELDS
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Full Name</span>
                      <span style={{ fontWeight: 600 }}>{profile?.name || 'Not configured'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Phone Number</span>
                      <span style={{ fontWeight: 600 }}>{profile?.phone_number || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Academic Course</span>
                      <span style={{ fontWeight: 600 }}>{profile?.academic_stream}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Current Semester</span>
                      <span style={{ fontWeight: 600 }}>Semester {profile?.current_semester}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Graduation Year</span>
                      <span style={{ fontWeight: 600 }}>{profile?.graduation_year}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Current CGPA</span>
                      <span style={{ fontWeight: 600 }}>{profile?.current_cgpa ? `${profile.current_cgpa} / 10.0` : 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>State / Language</span>
                      <span style={{ fontWeight: 600 }}>{profile?.state_of_residence || 'N/A'} ({profile?.primary_language})</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Institution tenancy mapping card */}
            <div className="glass-card">
              <div className="glass-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Building2 size={20} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Tenant Institutional Settings</h3>
              </div>
              
              <div className="glass-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {editMode ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">College / Institution Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={instName}
                        onChange={(e) => setInstName(e.target.value)}
                        placeholder="e.g. Indian Institute of Technology"
                      />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Institution Tier</label>
                        <select
                          className="form-input"
                          value={instTier}
                          onChange={(e) => setInstTier(e.target.value)}
                          style={{ height: '44px', background: 'var(--bg-card)', color: '#fff', cursor: 'pointer' }}
                        >
                          <option value="Tier-1">Tier-1 (High Resource)</option>
                          <option value="Tier-2">Tier-2 (Medium Resource)</option>
                          <option value="Tier-3">Tier-3 (Low Resource)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Region (e.g. North, South)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={instRegion}
                          onChange={(e) => setInstRegion(e.target.value)}
                          placeholder="e.g. South"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Institution State</label>
                      <input
                        type="text"
                        className="form-input"
                        value={instState}
                        onChange={(e) => setInstState(e.target.value)}
                        placeholder="e.g. Tamil Nadu"
                      />
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Institution Name</span>
                      <span style={{ fontWeight: 600 }}>{profile?.institution_name || 'Individual Student (No Tenant)'}</span>
                    </div>
                    {profile?.institution_name && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Resource Tier</span>
                          <span className={`badge ${profile.institution_tier === 'Tier-1' ? 'badge-success' : profile.institution_tier === 'Tier-2' ? 'badge-warning' : 'badge-primary'}`}>
                            {profile.institution_tier}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Location Geography</span>
                          <span style={{ fontWeight: 600 }}>{profile.institution_region || 'N/A'}, {profile.institution_state || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* GATE Syllabus targets card */}
            <div className="glass-card">
              <div className="glass-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <GraduationCap size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Learning Target Syllabus Settings</h3>
              </div>
              
              <div className="glass-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: editMode ? 'pointer' : 'default', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={targetingGate}
                    onChange={(e) => setTargetingGate(e.target.checked)}
                    disabled={!editMode}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  <span>Targeting GATE Entrance Exam (Graduate Aptitude Test)</span>
                </label>

                {targetingGate && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
                    <div className="form-group">
                      <label className="form-label">Primary Paper Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={gatePaper1}
                        onChange={(e) => setGatePaper1(e.target.value)}
                        placeholder="e.g. CS - Computer Science"
                        disabled={!editMode}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Secondary Paper Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={gatePaper2}
                        onChange={(e) => setGatePaper2(e.target.value)}
                        placeholder="e.g. DA - Data Science"
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group" style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Link2 size={16} style={{ color: 'var(--primary)' }} />
                    <label className="form-label" style={{ margin: 0 }}>Syllabus Reference / Text Link</label>
                  </div>
                  {editMode ? (
                    <textarea
                      className="form-input"
                      value={syllabusReferral}
                      onChange={(e) => setSyllabusReferral(e.target.value)}
                      placeholder="Paste syllabus text or link to curriculum syllabus..."
                      style={{ height: '80px', resize: 'vertical' }}
                    />
                  ) : (
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                      {syllabusReferral || 'No custom syllabus registered.'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SAVE BUTTONS */}
            {editMode && (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)} style={{ height: '46px', width: '120px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saveLoading} style={{ height: '46px', width: '160px' }}>
                  <Save size={16} />
                  <span>{saveLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </form>

      {/* Gateway Configuration settings card */}
      <div className="glass-card" style={{ marginTop: '24px' }}>
        <div className="glass-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={20} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Gateway Configuration Settings</h3>
        </div>
        <div className="glass-card-body" style={{ marginTop: '16px' }}>
          <form onSubmit={handleSaveUrl}>
            <div className="form-group">
              <label className="form-label">Custom API Base URL (Override)</label>
              <input
                type="url"
                className="form-input"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="e.g. https://sahai-api-node-production.up.railway.app/api"
              />
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
                Leave empty to use automatic host detection (defaults to current window domain suffix). Updates take effect immediately.
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary" style={{ height: '40px', padding: '0 20px' }}>
                <Check size={16} />
                <span>Save Configuration</span>
              </button>
              {urlSuccess && (
                <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 600 }}>
                  Configuration saved! Reloading gateway...
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
