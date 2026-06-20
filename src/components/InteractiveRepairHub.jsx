import React, { useState } from 'react';
import { 
  Trophy, 
  Cpu, 
  Flame, 
  Target, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

/**
 * SkillPassport React Component
 * Displays Global Rank, Cognitive Elo Rating, and System Confidence.
 */
export function SkillPassport({ user, cognitiveState }) {
  const averageMastery = cognitiveState && cognitiveState.length > 0
    ? cognitiveState.reduce((acc, curr) => acc + parseFloat(curr.expected_mastery || 0.5), 0) / cognitiveState.length
    : 0.50;

  const eloRating = Math.round(averageMastery * 2000);

  return (
    <div className="glass-card" style={{
      padding: '24px',
      background: 'rgba(11, 17, 32, 0.7)',
      border: '1px solid rgba(0, 240, 255, 0.15)',
      boxShadow: '0 0 25px rgba(0, 240, 255, 0.05)',
      borderRadius: '16px',
      width: '100%',
      marginBottom: '24px',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={24} style={{ color: '#00F0FF' }} />
            <span>Skill Passport</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', marginBottom: 0 }}>
            {user?.name || 'Student'} | Cognitive Diagnostics Passport
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          {/* Global Rank */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Global Rank</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00F0FF', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={16} />
              <span>Top 14% in B.Tech CSE</span>
            </span>
          </div>

          {/* Cognitive Elo Rating */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Cognitive Elo</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00F0FF', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} />
              <span>{eloRating}</span>
            </span>
          </div>

          {/* System Confidence */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>System Confidence</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00F0FF', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={16} />
              <span>96%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MasteryTrajectoryChart React Component
 * Renders a glowing LineChart representing the history of mastery changes.
 */
export function MasteryTrajectoryChart({ historyData }) {
  const formattedData = (historyData || []).map(d => {
    let dateStr = d.date;
    try {
      const parsedDate = new Date(d.date);
      dateStr = parsedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (_) {}
    return {
      ...d,
      displayDate: dateStr,
      masteryPct: Math.round(d.mastery * 100)
    };
  });

  return (
    <div style={{ width: '100%', height: 300, background: 'rgba(10, 10, 15, 0.4)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="displayDate" 
            stroke="var(--text-secondary)" 
            fontSize={10}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 100]} 
            stroke="var(--text-secondary)" 
            fontSize={10}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0B1120', 
              borderColor: 'rgba(0, 240, 255, 0.2)', 
              color: '#fff',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}
            formatter={(value) => [`${value}% Mastery`, 'Cognitive Mastery']}
            labelFormatter={(label) => `Timestamp: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="masteryPct" 
            stroke="#00F0FF" 
            strokeWidth={3} 
            dot={{ r: 5, stroke: '#FF4500', strokeWidth: 2, fill: '#FF4500' }}
            activeDot={{ r: 7, stroke: '#00F0FF', strokeWidth: 1, fill: '#FF4500' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * HistoryRepairList React Component
 * Render expandable Accordion list showing topics needing repair, feedback and behavioral modifiers.
 */
export function HistoryRepairList({ history, conceptNode, onPracticeClick }) {
  const { language } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (idx) => {
    if (expandedIndex === idx) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(idx);
    }
  };

  const repairHistory = (history || []).filter(h => h.mastery < 0.6);

  if (repairHistory.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>This concept is currently healthy (E[K] &gt;= 60%). No repairs needed!</p>
      </div>
    );
  }

  const getFlagBadge = (flag) => {
    const flagStyles = {
      'BLIND_GUESSING': { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Blind Guessing' },
      'COPY_PASTE_DEPENDENCY': { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Copy-Paste Dependency' },
      'SHOTGUN_DEBUGGING': { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'Shotgun Debugging' },
      'MISCONCEPTION_TRIGGERED': { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'Misconception Triggered' },
      'LOGICAL_FLAW_DETECTED': { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Logical Flaw' },
      'FOUNDATIONAL_VOID': { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Foundational Void' }
    };

    const style = flagStyles[flag] || { bg: 'rgba(255, 255, 255, 0.05)', text: 'var(--text-secondary)', label: flag };
    return (
      <span key={flag} style={{
        fontSize: '0.72rem',
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: '4px',
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.text}20`,
        display: 'inline-block'
      }}>
        {style.label}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {repairHistory.map((item, idx) => {
        const isExpanded = expandedIndex === idx;
        const dateObj = new Date(item.date);
        const formattedDate = dateObj.toLocaleDateString(undefined, { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const feedbackObj = item.tutor_feedback;
        const feedbackText = typeof feedbackObj === 'object' && feedbackObj !== null
          ? (language === 'hi' ? feedbackObj.hi : feedbackObj.en)
          : (feedbackObj || "It seems you had some trouble with this concept. Let's review it together to build a stronger foundation.");

        return (
          <div 
            key={idx} 
            className="glass-card" 
            style={{ 
              border: isExpanded ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid var(--border-color)',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'all var(--transition-fast)'
            }}
          >
            {/* Header */}
            <div 
              onClick={() => toggleExpand(idx)}
              style={{ 
                padding: '16px 20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  {conceptNode?.concept_name || 'Active Concept'}
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>
                  {formattedDate}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(255, 69, 0, 0.1)',
                  color: '#FF4500',
                  border: '1px solid rgba(255, 69, 0, 0.2)'
                }}>
                  Needs Repair ({(item.mastery * 100).toFixed(0)}%)
                </span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div style={{ 
                padding: '0 20px 20px 20px', 
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {/* Behavioral Flags */}
                {item.behavioral_flags && item.behavioral_flags.length > 0 && (
                  <div>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Behavioral Triggers Detected
                    </h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {item.behavioral_flags.map(flag => getFlagBadge(flag))}
                    </div>
                  </div>
                )}

                {/* Tutor Feedback */}
                <div>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} style={{ color: '#00F0FF' }} />
                    <span>AI Generative Tutor Feedback</span>
                  </h5>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--border-color)',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    color: '#e5e7eb',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {feedbackText}
                  </div>
                </div>

                {/* Practice Button */}
                <button 
                  className="btn btn-primary"
                  onClick={onPracticeClick}
                  style={{ 
                    alignSelf: 'flex-start', 
                    height: '38px', 
                    fontSize: '0.85rem',
                    background: 'linear-gradient(135deg, #00f0ff 0%, #3b82f6 100%)',
                    boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
                    border: 'none',
                    fontWeight: 700
                  }}
                >
                  Practice this Concept Again
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
