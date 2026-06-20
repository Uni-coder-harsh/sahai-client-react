import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
  History, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Clock, 
  Terminal, 
  AlertTriangle, 
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function HistoryScreen({ user }) {
  const { language } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'mcq', 'handwriting'

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await api.fetchAttemptHistory(user.id);
      setHistory(data);
      setError('');
    } catch (err) {
      console.error('Failed to load study history:', err);
      setError(err.message || 'Failed to load study history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user.id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #00F0FF', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const filteredHistory = history.filter(item => {
    if (activeFilter === 'mcq') return item.type === 'mcq';
    if (activeFilter === 'handwriting') return item.type === 'handwriting';
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            <History size={32} style={{ color: '#00F0FF' }} />
            <span>Study & Telemetry History</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
            Inspect your historical coding telemetry, MCQ submissions, and LLM-graded Handwriting OCR scans.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px', 
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px'
      }}>
        {['all', 'mcq', 'handwriting'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`btn ${activeFilter === filter ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: activeFilter === filter ? 'linear-gradient(135deg, #00f0ff 0%, #3b82f6 100%)' : 'rgba(255,255,255,0.02)',
              border: activeFilter === filter ? 'none' : '1px solid var(--border-color)',
              color: '#fff',
              boxShadow: activeFilter === filter ? '0 0 15px rgba(0, 240, 255, 0.25)' : 'none'
            }}
          >
            {filter === 'all' && 'All Telemetry'}
            {filter === 'mcq' && 'MCQ Submissions'}
            {filter === 'handwriting' && 'Handwriting OCR'}
          </button>
        ))}
      </div>

      {error && (
        <div className="glass-card" style={{ padding: '16px', borderColor: 'var(--error)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <AlertTriangle style={{ color: 'var(--error)' }} />
          <span style={{ color: '#fff' }}>{error}</span>
        </div>
      )}

      {/* Main History Feed */}
      {filteredHistory.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <CheckCircle2 size={48} style={{ color: '#00F0FF', marginBottom: '16px', margin: '0 auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>History is Empty</h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
            No telemetry records fit the selected filter. Try practicing in the Question Bank or scan handwriting notes in the Coding Sandbox to sync telemetry.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredHistory.map((item, idx) => {
            const dateObj = new Date(item.created_at);
            const formattedDate = dateObj.toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const isMCQ = item.type === 'mcq';

            return (
              <div 
                key={item.id || idx} 
                className="glass-card" 
                style={{ 
                  border: `1px solid ${item.is_correct ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
                  background: 'rgba(15, 23, 42, 0.65)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: item.is_correct 
                    ? '0 0 20px rgba(16, 185, 129, 0.02)' 
                    : '0 0 20px rgba(239, 68, 68, 0.02)',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Card Header Badge details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isMCQ ? (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        background: 'rgba(0, 240, 255, 0.1)',
                        color: '#00F0FF',
                        border: '1px solid rgba(0, 240, 255, 0.2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        MCQ Practice Sprint
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#a78bfa',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Handwriting OCR Scanner
                      </span>
                    )}

                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      background: item.is_correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: item.is_correct ? '#10b981' : '#ef4444',
                      border: `1px solid ${item.is_correct ? '#10b98130' : '#ef444430'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {item.is_correct ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {item.is_correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} />
                      <span>{item.time_spent_seconds || 30}s</span>
                    </div>
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Card Main Body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Question Text if exists */}
                  {item.question_text && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <HelpCircle size={18} style={{ color: '#00F0FF', flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>
                        {item.question_text}
                      </p>
                    </div>
                  )}

                  {/* MCQ specific selection details */}
                  {isMCQ && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '28px', fontSize: '0.9rem' }}>
                      <div style={{ color: item.is_correct ? '#10b981' : '#ef4444' }}>
                        <strong>Your Answer:</strong> Option {item.chosen_option_letter}) {item.chosen_option_text}
                      </div>
                      {!item.is_correct && item.correct_option_text && (
                        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ChevronRight size={14} />
                          <span><strong>Correct Option:</strong> Option {item.correct_option_letter}) {item.correct_option_text}</span>
                        </div>
                      )}
                      
                      {item.misconceptions && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                          {item.misconceptions.split(', ').map(mc => (
                            <span key={mc} style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: 'rgba(251, 191, 36, 0.1)',
                              color: '#fbbf24',
                              border: '1px solid rgba(251, 191, 36, 0.2)',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              Misconception: {mc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Handwriting specific details */}
                  {!isMCQ && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '28px' }}>
                      {/* OCR Extracted Text */}
                      {item.ocr_extracted_text && (
                        <div>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                            OCR Note Scan (Extracted Text)
                          </span>
                          <div style={{ 
                            background: 'rgba(0,0,0,0.3)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '8px', 
                            padding: '12px', 
                            fontFamily: 'var(--font-mono)', 
                            fontSize: '0.82rem', 
                            color: '#00F0FF',
                            whiteSpace: 'pre-wrap',
                            maxHeight: '120px',
                            overflowY: 'auto'
                          }}>
                            {item.ocr_extracted_text}
                          </div>
                        </div>
                      )}

                      {item.failed_node_id && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Evaluated Bottleneck:</span>
                          <span style={{ 
                            fontWeight: 700, 
                            color: '#FF4500', 
                            background: 'rgba(255, 69, 0, 0.1)', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 69, 0, 0.2)'
                          }}>
                            {item.failed_node_name || item.failed_node_id}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Generative Tutor / Logical Flaw Feedback (real responses generated by LLM/Groq) */}
                  {!item.is_correct && (item.llm_logical_flaw || item.tutor_feedback) && (
                    <div style={{
                      borderRadius: '12px',
                      padding: '1px',
                      background: 'linear-gradient(135deg, #00f0ff, #818cf8, #d946ef)',
                      marginTop: '8px'
                    }}>
                      <div style={{
                        background: 'rgba(10, 10, 15, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '11px',
                        padding: '18px',
                        color: '#f3f4f6',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: '#818cf8',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          <Sparkles size={14} style={{ color: '#00f0ff', filter: 'drop-shadow(0 0 4px #00f0ff)' }} />
                          <span>AI Tutor Audit Insight</span>
                        </div>
                        
                        <p style={{
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                          color: '#e5e7eb',
                          margin: 0,
                          fontWeight: 400
                        }}>
                          {item.llm_logical_flaw || (
                            typeof item.tutor_feedback === 'object'
                              ? (language === 'hi' ? item.tutor_feedback.hi : item.tutor_feedback.en)
                              : item.tutor_feedback
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
