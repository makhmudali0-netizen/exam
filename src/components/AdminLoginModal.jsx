import React, { useState } from 'react';
import { Lock, KeyRound, X } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLogin, actualPassword }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === actualPassword) {
      setError('');
      setPassword('');
      onLogin();
    } else {
      setError("Parol noto'g'ri! Qayta urinib ko'ring.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ maxWidth: '420px', padding: '2rem', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            borderRadius: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Lock className="w-7 h-7" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Admin Panelga Kirish</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Tizim sozlamalari va natijalarni ko'rish uchun parolni kiriting
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.6rem 0.9rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Parol</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="Parolni kiriting (Standart: admin)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                style={{ paddingLeft: '2.5rem' }}
              />
              <KeyRound className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
}
