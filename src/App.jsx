import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StudentLogin from './components/StudentLogin';
import QuizContainer from './components/QuizContainer';
import QuizSuccess from './components/QuizSuccess';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import { DEFAULT_QUESTIONS, DEFAULT_SETTINGS } from './data/defaultQuestions';
import './styles/App.css';

export default function App() {
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('exam_questions');
    return saved ? JSON.parse(saved) : DEFAULT_QUESTIONS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('exam_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem('exam_results');
    return saved ? JSON.parse(saved) : [];
  });

  // App View Navigation State
  const [currentView, setCurrentView] = useState('login');
  const [studentInfo, setStudentInfo] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Fetch initial data from SQLite Database API on startup
  useEffect(() => {
    const loadDbData = async () => {
      try {
        // Fetch Questions
        const qRes = await fetch('/api/questions');
        if (qRes.ok) {
          const qData = await qRes.json();
          if (Array.isArray(qData) && qData.length > 0) {
            setQuestions(qData);
            localStorage.setItem('exam_questions', JSON.stringify(qData));
          }
        }

        // Fetch Settings
        const sRes = await fetch('/api/settings');
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData && sData.timeLimitMinutes) {
            setSettings(prev => ({ ...prev, ...sData }));
            localStorage.setItem('exam_settings', JSON.stringify(sData));
          }
        }

        // Fetch Student Results
        const rRes = await fetch('/api/results');
        if (rRes.ok) {
          const rData = await rRes.json();
          if (Array.isArray(rData)) {
            setResults(rData);
            localStorage.setItem('exam_results', JSON.stringify(rData));
          }
        }
      } catch (err) {
        console.warn("Could not connect to backend server DB, using local state fallback:", err);
      }
    };

    loadDbData();
  }, []);

  // Handlers
  const handleStartExam = (info) => {
    setStudentInfo(info);
    setCurrentView('exam');
  };

  const handleFinishExam = async (submissionData) => {
    // Save to State & LocalStorage immediately
    setResults((prev) => [submissionData, ...prev]);

    // Send POST to SQLite Database Server
    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      if (response.ok) {
        const resData = await response.json();
        submissionData.dbId = resData.dbId;
      }
    } catch (e) {
      console.error("Database save error:", e);
    }

    setCurrentView('success');
  };

  const handleResetForNextStudent = () => {
    setStudentInfo(null);
    setCurrentView('login');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminLoginModalOpen(false);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('login');
  };

  // Admin Question Handlers
  const handleSaveQuestions = async (newQuestions) => {
    setQuestions(newQuestions);
    localStorage.setItem('exam_questions', JSON.stringify(newQuestions));
    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestions)
      });
    } catch (e) {
      console.error("Save questions DB error:", e);
    }
  };

  const handleRestoreDefaultQuestions = async () => {
    setQuestions(DEFAULT_QUESTIONS);
    localStorage.setItem('exam_questions', JSON.stringify(DEFAULT_QUESTIONS));
    try {
      await fetch('/api/questions/restore-defaults', { method: 'POST' });
    } catch (e) {
      console.error("Restore questions DB error:", e);
    }
  };

  // Admin Student Result Deletion Handlers
  const handleDeleteStudent = async (dbId, index) => {
    // Remove from UI state
    setResults((prev) => prev.filter((r, i) => (r.dbId ? r.dbId !== dbId : i !== index)));

    // Send DELETE to SQLite DB
    if (dbId) {
      try {
        await fetch(`/api/results/${dbId}`, { method: 'DELETE' });
      } catch (e) {
        console.error("Delete student DB error:", e);
      }
    }
  };

  const handleClearResults = async () => {
    setResults([]);
    localStorage.removeItem('exam_results');
    try {
      await fetch('/api/results', { method: 'DELETE' });
    } catch (e) {
      console.error("Clear results DB error:", e);
    }
  };

  // Admin Settings Handler
  const handleSaveSettings = async (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('exam_settings', JSON.stringify(newSettings));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {
      console.error("Save settings DB error:", e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        examTitle={settings.examTitle}
        studentInfo={studentInfo}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onAdminLogout={handleAdminLogout}
        currentView={currentView}
      />

      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {currentView === 'login' && (
          <StudentLogin
            onStartExam={handleStartExam}
            totalQuestionsCount={questions.length}
            timeLimitMinutes={settings.timeLimitMinutes}
          />
        )}

        {currentView === 'exam' && studentInfo && (
          <QuizContainer
            questions={questions}
            studentInfo={studentInfo}
            timeLimitMinutes={settings.timeLimitMinutes}
            settings={settings}
            onFinishExam={handleFinishExam}
          />
        )}

        {currentView === 'success' && (
          <QuizSuccess
            studentInfo={studentInfo}
            onResetForNextStudent={handleResetForNextStudent}
          />
        )}

        {currentView === 'admin' && isAdminLoggedIn && (
          <AdminDashboard
            questions={questions}
            onSaveQuestions={handleSaveQuestions}
            onRestoreDefaultQuestions={handleRestoreDefaultQuestions}
            results={results}
            onDeleteStudent={handleDeleteStudent}
            onClearResults={handleClearResults}
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}
      </main>

      {/* Admin Login Dialog */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLogin={handleAdminLoginSuccess}
        actualPassword={settings.adminPassword}
      />
    </div>
  );
}
