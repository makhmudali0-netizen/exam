import React from 'react';
import { ShieldCheck, Code, User, Lock, LogOut } from 'lucide-react';

export default function Header({ 
  examTitle, 
  studentInfo, 
  isAdminLoggedIn, 
  onOpenAdminLogin, 
  onAdminLogout,
  currentView
}) {
  return (
    <header className="app-header">
      <div className="brand-logo">
        <div className="logo-icon">
          <Code className="w-5 h-5" />
        </div>
        <div>
          <span>{examTitle || "HTML Exam System"}</span>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>
            Online Test & Boshqaruv Tizimi
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {studentInfo && currentView === 'exam' && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(30, 41, 59, 0.8)', 
            padding: '0.4rem 0.9rem', 
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '0.85rem'
          }}>
            <User className="w-4 h-4 text-indigo-400" />
            <span style={{ fontWeight: 600 }}>{studentInfo.fullName}</span>
            {studentInfo.group && (
              <span className="badge badge-indigo">{studentInfo.group}</span>
            )}
          </div>
        )}

        {isAdminLoggedIn ? (
          <button 
            onClick={onAdminLogout}
            className="btn btn-danger"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Admindan chiqish</span>
          </button>
        ) : (
          <button 
            onClick={onOpenAdminLogin}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Admin Panel</span>
          </button>
        )}
      </div>
    </header>
  );
}
