import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AIInsightCard({ feedback }) {
  const { language } = useLanguage();
  if (!feedback) return null;

  // Extract translation based on selected language
  const text = typeof feedback === 'object' 
    ? (language === 'hi' ? feedback.hi : feedback.en) 
    : feedback;

  if (!text) return null;

  return (
    <div style={{
      position: 'relative',
      borderRadius: '12px',
      padding: '1px', // Border wrapper for glowing gradient border
      background: 'linear-gradient(135deg, #00f0ff, #818cf8, #d946ef)',
      boxShadow: '0 0 20px rgba(129, 140, 248, 0.2)',
      marginTop: '16px',
      marginBottom: '16px',
      width: '100%',
      maxWidth: '600px',
      textAlign: 'left'
    }}>
      <div style={{
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '11px',
        padding: '20px',
        color: '#f3f4f6',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 800,
          fontSize: '0.95rem',
          color: '#818cf8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <Sparkles size={18} style={{ color: '#00f0ff', filter: 'drop-shadow(0 0 5px #00f0ff)' }} />
          <span>AI Tutor Insights</span>
        </div>
        
        <p style={{
          fontSize: '0.92rem',
          lineHeight: 1.6,
          color: '#e5e7eb',
          margin: 0,
          fontWeight: 400
        }}>
          {text}
        </p>
      </div>
    </div>
  );
}
