import React, { useState } from 'react';
import { UserCheck, Sparkles, Clock, Shuffle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function StudentLogin({ onStartExam, totalQuestionsCount, timeLimitMinutes }) {
  const [fullName, setFullName] = useState('');
  const [group, setGroup] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Iltimos, ism va familiyangizni kiriting!");
      return;
    }
    setError('');
    onStartExam({
      fullName: fullName.trim(),
      group: group.trim() || 'Guruh ko\'rsatilmagan'
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem' }}>
      <div className="glass-panel glass-panel-hover" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)'
        }}>
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          HTML Bilimlarini Sinash Imtihoni
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Imtihonni boshlash uchun ma'lumotlaringizni kiritishingiz so'raladi.
        </p>

        {/* Anti-cheat info card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.75rem' }}>
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            <span>Imtihon qoidalari va xavfsizlik:</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shuffle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>Savollar va variantlar o'rni har bir o'quvchi uchun <strong>avtomatik almashtiriladi</strong>.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>Imtihon vaqti: <strong>{timeLimitMinutes} daqiqa</strong> ({totalQuestionsCount} ta savol).</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>Test yakunlangach, javoblar to'g'ridan-to'g'ri adminga topshiriladi.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span><strong>Anti-Cheating Nazorati:</strong> Boshqa oynaga (Google, AI, Telegram) o'tish taqiqlangan! Tizim ogohlantirish beradi va avto-topshiradi.</span>
            </li>
          </ul>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">F.I.SH (Ismingiz va Familiyangiz) *</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Masalan: Ali Valiyev"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Guruh / Sinf (ixtiyoriy)</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Masalan: HTML-101 yoki 9-B"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', marginTop: '1rem' }}
          >
            <UserCheck className="w-5 h-5" />
            <span>Imtihonni Boshlash</span>
          </button>
        </form>
      </div>
    </div>
  );
}
