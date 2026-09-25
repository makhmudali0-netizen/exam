import React, { useState, useEffect } from 'react';
import { X, Check, HelpCircle } from 'lucide-react';

export default function QuestionEditorModal({ isOpen, onClose, onSave, editingQuestion }) {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingQuestion) {
      setQuestionText(editingQuestion.question || '');
      setOptions(editingQuestion.options ? [...editingQuestion.options] : ['', '', '', '']);
      setCorrectAnswer(editingQuestion.correctAnswer || 0);
    } else {
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
    }
    setError('');
  }, [editingQuestion, isOpen]);

  if (!isOpen) return null;

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setError("Savol matnini kiriting!");
      return;
    }
    for (let i = 0; i < 4; i++) {
      if (!options[i].trim()) {
        setError(`Barcha 4 ta variant to'ldirilishi shart! (${i + 1}-variant bo'sh)`);
        return;
      }
    }

    onSave({
      id: editingQuestion ? editingQuestion.id : Date.now(),
      question: questionText.trim(),
      options: options.map(o => o.trim()),
      correctAnswer: Number(correctAnswer)
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ maxWidth: '650px', padding: '2rem', position: 'relative' }}>
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

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle className="w-6 h-6 text-indigo-400" />
          <span>{editingQuestion ? "Savolni tahrirlash" : "Yangi savol qo'shish"}</span>
        </h2>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Savol matni *</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Masalan: HTML da rasm joylashtirish uchun qaysi teg ishlatiladi?"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          <div style={{ margin: '1.5rem 0' }}>
            <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
              Javob variantlari (To'g'ri javobni tanlang) *
            </label>

            {['A', 'B', 'C', 'D'].map((letter, idx) => (
              <div 
                key={idx} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  background: correctAnswer === idx ? 'rgba(99, 102, 241, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '10px',
                  border: correctAnswer === idx ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <input
                  type="radio"
                  name="correctAnswer"
                  id={`radio-${idx}`}
                  checked={correctAnswer === idx}
                  onChange={() => setCorrectAnswer(idx)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6366f1' }}
                />
                <label 
                  htmlFor={`radio-${idx}`} 
                  style={{ 
                    fontWeight: 700, 
                    color: correctAnswer === idx ? '#818cf8' : '#94a3b8', 
                    minWidth: '24px',
                    cursor: 'pointer' 
                  }}
                >
                  {letter})
                </label>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '0.5rem 0.75rem' }}
                  placeholder={`${letter} javobini kiriting`}
                  value={options[idx]}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Check className="w-4 h-4" />
              <span>Saqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
