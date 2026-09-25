import React, { useState } from 'react';
import { Award, HelpCircle, Settings, Plus, Edit2, Trash2, RefreshCw, Save, Clock, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';
import ResultsTable from './ResultsTable';
import QuestionEditorModal from './QuestionEditorModal';

export default function AdminDashboard({
  questions,
  onSaveQuestions,
  onRestoreDefaultQuestions,
  results,
  onDeleteStudent,
  onClearResults,
  settings,
  onSaveSettings
}) {
  const [activeTab, setActiveTab] = useState('results'); // 'results' | 'questions' | 'settings'

  // Question Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Settings form state
  const [timeLimit, setTimeLimit] = useState(settings.timeLimitMinutes);
  const [examTitle, setExamTitle] = useState(settings.examTitle);
  const [adminPassword, setAdminPassword] = useState(settings.adminPassword);
  const [enableAntiCheating, setEnableAntiCheating] = useState(settings.enableAntiCheating !== false);
  const [maxViolationsAllowed, setMaxViolationsAllowed] = useState(settings.maxViolationsAllowed || 3);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setIsEditorOpen(true);
  };

  const handleDeleteQuestion = (id) => {
    if (questions.length <= 1) {
      alert("Kamida 1 ta savol bo'lishi kerak!");
      return;
    }
    if (window.confirm("Ushbu savolni o'chirmoqchimisiz?")) {
      const updated = questions.filter((q) => q.id !== id);
      onSaveQuestions(updated);
    }
  };

  const handleSaveQuestionItem = (qData) => {
    let updated;
    if (editingQuestion) {
      updated = questions.map((q) => (q.id === qData.id ? qData : q));
    } else {
      updated = [...questions, qData];
    }
    onSaveQuestions(updated);
  };

  const handleSaveSettingsSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      timeLimitMinutes: Number(timeLimit) || 30,
      examTitle: examTitle.trim() || "HTML Exam System",
      adminPassword: adminPassword.trim() || "admin",
      enableAntiCheating: !!enableAntiCheating,
      maxViolationsAllowed: Number(maxViolationsAllowed) || 3
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Admin Boshqaruv Paneli</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Savollar, natijalar hamda vaqt sozlamalarini boshqarish
          </p>
        </div>
        <div className="badge badge-indigo" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          Tizim faol: {questions.length} ta savol | {settings.timeLimitMinutes} daqiqa
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          onClick={() => setActiveTab('results')}
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
        >
          <Award className="w-4 h-4" />
          <span>O'quvchilar Natijalari ({results.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Savollar Boshqaruvi ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Settings className="w-4 h-4" />
          <span>Test Sozlamalari</span>
        </button>
      </div>

      {/* TAB 1: RESULTS */}
      {activeTab === 'results' && (
        <ResultsTable
          results={results}
          onDeleteStudent={onDeleteStudent}
          onClearResults={onClearResults}
        />
      )}

      {/* TAB 2: QUESTIONS */}
      {activeTab === 'questions' && (
        <div>
          <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Savollar ro'yxati ({questions.length} ta)</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Ushbu savollar tasodifiy o'rinda o'quvchilarga tushadi</p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  if (window.confirm("Barcha savollarni standart 30 ta HTML savolga qaytarasizmi?")) {
                    onRestoreDefaultQuestions();
                  }
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Standart 30 savolga tiklash</span>
              </button>

              <button
                onClick={handleOpenAddModal}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem' }}
              >
                <Plus className="w-4 h-4" />
                <span>Yangi savol qo'shish</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map((q, idx) => (
              <div key={q.id || idx} className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-indigo">#{idx + 1} Savol</span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
                      {q.question}
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
                      {q.options.map((optText, optIdx) => {
                        const isCorrect = optIdx === q.correctAnswer;
                        const letters = ['A', 'B', 'C', 'D'];
                        return (
                          <div
                            key={optIdx}
                            style={{
                              padding: '0.5rem 0.75rem',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              background: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                              border: isCorrect ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                              color: isCorrect ? '#6ee7b7' : '#cbd5e1',
                              fontWeight: isCorrect ? 700 : 400
                            }}
                          >
                            <strong>{letters[optIdx]})</strong> {optText} {isCorrect && "✓ (To'g'ri)"}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleOpenEditModal(q)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.6rem' }}
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-4 h-4 text-indigo-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="btn btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '650px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Test Sozlamalarini Boshqarish
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Vaqt chegarasini, imtihon nomini hamda admin parolini shu yerdan o'zgartirishingiz mumkin.
          </p>

          {settingsSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#6ee7b7',
              padding: '0.75rem',
              borderRadius: '10px',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Sozlamalar muvaffaqiyatli saqlandi!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettingsSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Test Uchu Mo'ljallangan Vaqt (daqiqada) *</span>
              </label>
              <input
                type="number"
                min="1"
                max="180"
                className="form-input"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Har bir o'quvchiga imtihon uchun beriladigan vaqt (masalan: 15, 30, 45, 60 daqiqa).
              </span>
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">Imtihon / Sayt Nomi *</label>
              <input
                type="text"
                className="form-input"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Admin Paroli *</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>

            {/* Anti-Cheating Controls */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '1rem' }}>
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                <span>Anti-Cheating (Ko'chirishga qarshi nazorat):</span>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>Boshqa ilovaga/saytga o'tishni taqiqlash</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Student test paytida Google, ChatGPT yoki Telegram'ga o'tganida ogohlantirish berish</div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#6366f1' }}
                  checked={enableAntiCheating}
                  onChange={(e) => setEnableAntiCheating(e.target.checked)}
                />
              </div>

              {enableAntiCheating && (
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label">Maksimal Ruxsat Etilgan Ogohlantirishlar Soni</label>
                  <select
                    className="form-input"
                    value={maxViolationsAllowed}
                    onChange={(e) => setMaxViolationsAllowed(Number(e.target.value))}
                  >
                    <option value={1} style={{ background: '#0f172a' }}>1 marta (Darhol avto-topshiriladi)</option>
                    <option value={2} style={{ background: '#0f172a' }}>2 marta ogohlantirish</option>
                    <option value={3} style={{ background: '#0f172a' }}>3 marta ogohlantirish (Tavsiya etiladi)</option>
                    <option value={5} style={{ background: '#0f172a' }}>5 marta ogohlantirish</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '1.5rem', fontSize: '1rem' }}
            >
              <Save className="w-5 h-5" />
              <span>Sozlamalarni Saqlash</span>
            </button>
          </form>
        </div>
      )}

      {/* Editor Modal */}
      <QuestionEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveQuestionItem}
        editingQuestion={editingQuestion}
      />
    </div>
  );
}
