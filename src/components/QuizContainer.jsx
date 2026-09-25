import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Clock, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Send, ShieldAlert, ShieldCheck, Lock, Maximize2 } from 'lucide-react';

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function QuizContainer({ questions, studentInfo, timeLimitMinutes, settings, onFinishExam }) {
  const enableAntiCheating = settings?.enableAntiCheating !== false;
  const maxViolationsAllowed = settings?.maxViolationsAllowed || 3;

  // Prepare randomized questions and options once when test starts
  const randomizedQuestions = useMemo(() => {
    const shuffledQs = shuffleArray(questions);
    return shuffledQs.map((q) => {
      const optionsWithMeta = q.options.map((optText, origIdx) => ({
        text: optText,
        isCorrect: origIdx === q.correctAnswer
      }));
      const shuffledOpts = shuffleArray(optionsWithMeta);
      return {
        id: q.id,
        question: q.question,
        options: shuffledOpts
      };
    });
  }, [questions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(timeLimitMinutes * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Anti-Cheating States
  const [violationsCount, setViolationsCount] = useState(0);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationMessage, setViolationMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  const isExamSubmittedRef = useRef(false);
  const lastViolationTimestampRef = useRef(0);

  const handleFinalSubmit = (isAutoSubmitted = false, submitReason = "Talaba tomonidan topshirildi", finalViolations = violationsCount) => {
    if (isExamSubmittedRef.current) return;
    isExamSubmittedRef.current = true;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    let correctCount = 0;
    randomizedQuestions.forEach((q, idx) => {
      const selectedOptIdx = userAnswers[idx];
      if (selectedOptIdx !== undefined && q.options[selectedOptIdx]?.isCorrect) {
        correctCount++;
      }
    });

    const totalCount = randomizedQuestions.length;
    const scorePercentage = Math.round((correctCount / totalCount) * 100);
    const totalTimeSeconds = timeLimitMinutes * 60;
    const timeSpentSeconds = totalTimeSeconds - Math.max(0, timeLeftSeconds);

    onFinishExam({
      studentInfo,
      correctCount,
      totalCount,
      scorePercentage,
      timeSpentSeconds,
      submittedAt: new Date().toLocaleString('uz-UZ'),
      violationsCount: finalViolations,
      isAutoSubmitted,
      submitReason,
      details: randomizedQuestions.map((q, idx) => {
        const selectedIdx = userAnswers[idx];
        const correctOptObj = q.options.find(o => o.isCorrect);
        const selectedOptObj = selectedIdx !== undefined ? q.options[selectedIdx] : null;
        return {
          questionText: q.question,
          selectedText: selectedOptObj ? selectedOptObj.text : "Javob berilmagan",
          correctText: correctOptObj ? correctOptObj.text : "",
          isCorrect: selectedOptObj ? selectedOptObj.isCorrect : false
        };
      })
    });
  };

  // Request Fullscreen on Exam Start
  useEffect(() => {
    if (enableAntiCheating) {
      try {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (err) {
        console.warn("Fullscreen error:", err);
      }
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [enableAntiCheating]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleFinalSubmit(false, "Imtihon vaqti tugadi");
      return;
    }
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  // Prevent refresh / closing tab (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isExamSubmittedRef.current) {
        e.preventDefault();
        e.returnValue = "Imtihon davom etmoqda. Sahifadan chiqsangiz, natijalaringiz saqlanmasligi mumkin!";
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // ANTI-CHEATING PROTECTION: Tab Switch & Window Blur Listener
  useEffect(() => {
    if (!enableAntiCheating) return;

    const handleViolation = (reasonText) => {
      if (isExamSubmittedRef.current) return;

      const now = Date.now();
      // Debounce violation detection to prevent duplicate triggers within 1.5 seconds
      if (now - lastViolationTimestampRef.current < 1500) return;
      lastViolationTimestampRef.current = now;

      setViolationsCount((prevCount) => {
        const newCount = prevCount + 1;

        if (newCount >= maxViolationsAllowed) {
          // Exceeded max violations -> Auto Submit
          setViolationMessage(`Siz ${newCount} marta taqiqlangan oynaga/saytga o'tdingiz. Tizim testni avtomatik yakunladi!`);
          handleFinalSubmit(true, `Avto-topshirildi: ${newCount} marta taqiqlangan ilovaga o'tildi (${reasonText})`, newCount);
        } else {
          // Warning modal
          setViolationMessage(`OGOHLANTIRISH #${newCount}/${maxViolationsAllowed}: Test davomida boshqa ilovaga/saytga (Google, AI, Telegram) o'tish taqiqlangan!`);
          setShowViolationModal(true);
        }
        return newCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("Brauzer vakladkasi o'zgartirildi");
      }
    };

    const handleWindowBlur = () => {
      handleViolation("Boshqa dastur/oyna aktivlashtirildi");
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [enableAntiCheating, maxViolationsAllowed]);

  // Prevent Right-Click, Copy, Cut, Paste and DevTools keybindings
  const handleContextMenu = (e) => {
    if (enableAntiCheating) {
      e.preventDefault();
    }
  };

  const handleCopyCutPaste = (e) => {
    if (enableAntiCheating) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (!enableAntiCheating) return;
    // Block Ctrl+C, Ctrl+V, Ctrl+U, Ctrl+Shift+I, F12
    if (
      (e.ctrlKey && ['c', 'v', 'u', 'a'].includes(e.key.toLowerCase())) ||
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i')
    ) {
      e.preventDefault();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const currentQ = randomizedQuestions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const isLastQuestion = currentIndex === randomizedQuestions.length - 1;



  return (
    <div
      onContextMenu={handleContextMenu}
      onCopy={handleCopyCutPaste}
      onCut={handleCopyCutPaste}
      onPaste={handleCopyCutPaste}
      onKeyDown={handleKeyDown}
      style={{
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '0 1rem',
        userSelect: enableAntiCheating ? 'none' : 'auto',
        WebkitUserSelect: enableAntiCheating ? 'none' : 'auto'
      }}
    >
      {/* Quiz Top Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Imtihon topshiruvchi:</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f8fafc' }}>
            {studentInfo.fullName} <span style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 500 }}>({studentInfo.group})</span>
          </div>
        </div>

        {/* Anti-Cheat Badge */}
        {enableAntiCheating && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '20px',
            background: violationsCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${violationsCount > 0 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
            fontSize: '0.85rem',
            fontWeight: 600,
            color: violationsCount > 0 ? '#fca5a5' : '#6ee7b7'
          }}>
            {violationsCount > 0 ? <ShieldAlert className="w-4 h-4 text-red-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            <span>Nazorat: Ogohlantirish {violationsCount} / {maxViolationsAllowed}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            Belgilangan: <strong style={{ color: '#818cf8' }}>{answeredCount}</strong> / {randomizedQuestions.length}
          </div>

          <div className={`timer-container ${timeLeftSeconds < 300 ? 'timer-warning' : ''}`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Fullscreen Prompt Bar if exited */}
      {enableAntiCheating && !isFullscreen && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.2)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '12px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fef3c7',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span><strong>Diqqat!</strong> Imtihon to'liq ekran rejimida o'tkaziladi. Qayta ulash uchun tugmani bosing.</span>
          </div>
          <button
            onClick={() => document.documentElement.requestFullscreen().catch(() => {})}
            className="btn btn-primary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>To'liq Ekran</span>
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Main Question Card */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-indigo">
                Savol {currentIndex + 1} / {randomizedQuestions.length}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                HTML Bo'limi (Ko'chirish taqiqlangan)
              </span>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.75rem', lineHeight: 1.5 }}>
              {currentQ.question}
            </h2>

            {/* Options list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentIndex] === optIdx;
                const optionLetters = ['A', 'B', 'C', 'D'];
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`option-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="option-key">
                      {optionLetters[optIdx]}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: isSelected ? 600 : 400 }}>
                      {option.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="btn btn-secondary"
              style={{ opacity: currentIndex === 0 ? 0.5 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Oldingi</span>
            </button>

            {isLastQuestion ? (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="btn btn-success"
              >
                <Send className="w-4 h-4" />
                <span>Testni Yakunlash</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(randomizedQuestions.length - 1, prev + 1))}
                className="btn btn-primary"
              >
                <span>Keyingi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Question Navigator */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
            Savollar ro'yxati
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Istalgan savolga o'tish uchun ustiga bosing
          </p>

          <div className="q-grid">
            {randomizedQuestions.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined;
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`q-pill ${isAnswered ? 'answered' : ''} ${isActive ? 'active' : ''}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="btn btn-success"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Imtihonni Yakunlash</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
              marginBottom: '1rem'
            }}>
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Testni yakunlamoqchimisiz?
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Siz {randomizedQuestions.length} ta savoldan {answeredCount} tasiga javob berdingiz. 
              {answeredCount < randomizedQuestions.length && (
                <span style={{ color: '#f59e0b', display: 'block', marginTop: '0.25rem', fontWeight: 600 }}>
                  ({randomizedQuestions.length - answeredCount} ta savol belgilanmagan qoldi!)
                </span>
              )}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Davom ettirish
              </button>
              <button
                onClick={() => handleFinalSubmit(false, "Foydalanuvchi muvaffaqiyatli yakunladi")}
                className="btn btn-success"
                style={{ flex: 1 }}
              >
                Ha, topshirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anti-Cheating Violation Warning Modal */}
      {showViolationModal && (
        <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', zIndex: 10000 }}>
          <div className="glass-panel modal-content" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '500px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              marginBottom: '1.25rem'
            }}>
              <ShieldAlert className="w-10 h-10" />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171', marginBottom: '0.75rem' }}>
              Qoidabuzarlik Oynasi!
            </h3>
            <p style={{ color: '#fca5a5', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {violationMessage}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
              Diqqat: Javoblarni AI, Google yoki boshqa vositalardan qidirish qat'iyan man etiladi. {maxViolationsAllowed} ta ogohlantirishdan so'ng test avtomatik yakunlanadi.
            </p>

            <button
              onClick={() => {
                setShowViolationModal(false);
                if (enableAntiCheating && !document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
              }}
              className="btn btn-danger"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
            >
              Tushundim, Testga Qaytaman
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
